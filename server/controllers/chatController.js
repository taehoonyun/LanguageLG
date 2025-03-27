const { callOpenAIAPI } = require("../module/chatGPT");
const {
  saveConversationSummary,
  getLastSummary,
} = require("../services/memoryService");
const personalities = require("../services/personalityService");

exports.talkToFriend = async (req, res) => {
  const { userId, friendId, messages } = req.body;
  const personality = personalities[friendId];

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
    { role: "system", content: "다음 대화를 간단하지만 키포인트를 놓지지 않고 chatGPT 4o가 잘 이해 할 수 있게게 요약해줘." },
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
