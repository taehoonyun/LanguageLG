const mRes = require("../module/commonResponse");
const { callOpenAIAPI } = require("../module/chatGPT");
const {
  saveConversationSummary,
  getLastSummary,
} = require("../services/memoryService");
const Character = require("../models/character");
const { getCharacterByName } = require("../module/characterCache");

let messageHistory = [
  {
    role: "system",
    content: `You are a native English speaker from the U.S. helping a user practice English through casual roleplay based on locations (e.g., cafe, gym, restaurant).

The user will specify which tutor to talk to by saying:
"Tutor: <name>"

Respond on behalf of the selected tutor. Keep your reply short (3–5 sentences max) and casual.

ALWAYS respond strictly in this JSON format:
{
  "Response": "GPT’s reply based on the location and user input.",
  "Error": "Correct any grammar mistakes and suggest a more natural or native-like way to say the same sentence, if needed."
}`,
  },
];

exports.sendMessage = async (req, res) => {
  const userMessage = req.body.params.messages;

  if (!userMessage) {
    return res.status(400).json({ error: "message is required" });
  }

  messageHistory.push({ role: "user", content: userMessage });
  try {
    const assistantMessage = await callOpenAIAPI(messageHistory);

    messageHistory.push({ role: "assistant", content: assistantMessage });
    mRes.sendJSON(res, 200, {
      result: true,
      data: JSON.parse(assistantMessage),
    });
  } catch (error) {
    console.error("Error calling ChatGPT:", error.message);
    res.status(500).json({ error: "Failed to call ChatGPT API" });
  }
};

exports.resetHistory = (req, res) => {
  messageHistory = messageHistory.slice(0, 1); // system 메시지만 유지
  mRes.sendJSON(res, 200, {
    result: true,
    data: "Chat history reset.",
  });
};
exports.talkToFriend = async (req, res) => {
  const { userId, friendId, messages } = req.body;
  const personality = getCharacterByName(friendId); // 캐시에서 바로 가져옴
  if (!personality) {
    return res.status(400).json({ error: "Invalid friend name" });
  }

  const lastSummary = await getLastSummary(userId, friendId);
  const memoryContext = lastSummary[0]?.summary || "";

  const promptMessages = [
    {
      role: "system",
      content:
        personality.promptPrefix +
        " 아래는 과거 대화 요약이다: " +
        memoryContext,
    },
    ...messages,
  ];

  const responseText = callOpenAIAPI(promptMessages);

  // 간단 요약 생성 후 저장
  const summaryPrompt = [
    {
      role: "system",
      content:
        "다음 대화를 간단하지만 키포인트를 놓지지 않고 chatGPT 4o가 잘 이해 할 수 있게게 요약해줘.",
    },
    ...messages,
    { role: "assistant", content: responseText },
  ];

  const summaryResult = callOpenAIAPI(summaryPrompt);

  await saveConversationSummary(
    userId,
    friendId,
    summaryResult.choices[0].message.content
  );

  res.json({ reply: responseText });
};
