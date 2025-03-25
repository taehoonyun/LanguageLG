const mRes = require("../module/commonResponse");
const { callDeepseekAPI } = require("../module/deepseek");
const { callOpenAIAPI } = require("../module/chatGPT");

let messageHistory = [
  {
    role: "system",
    content: `You are a native English speaker from the U.S. helping a user practice English through casual roleplay based on locations (e.g., cafe, gym, restaurant).

There are 3 fictional tutors available:
- Alice: cheerful and friendly, uses simple language
- James: grammar-focused and formal, corrects precisely
- Luna: creative and metaphorical, encourages expressive English

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
    console.error("Error calling Deepseek:", error.message);
    res.status(500).json({ error: "Failed to call Deepseek API" });
  }
};

exports.resetHistory = (req, res) => {
  messageHistory = messageHistory.slice(0, 1); // system 메시지만 유지
  mRes.sendJSON(res, 200, {
    result: true,
    data: "Chat history reset.",
  });
};
