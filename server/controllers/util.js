const mRes = require("../module/commonResponse");
const { callDeepseekAPI } = require("../module/deepseek");

let messageHistory = [
  {
    role: "system",
    content: `You are a friendly native English speaker from the U.S. You're helping a Korean user practice English through casual roleplay. Start conversations based on a location the user gives. You must reply in JSON format: { "Response": "...", "Error": "Suggestion will be here" }. Correct the user’s English naturally. Keep it short and casual.`,
  },
];

exports.sendMessage = async (req, res) => {
  const userMessage = req.body.params.messages;

  if (!userMessage) {
    return res.status(400).json({ error: "message is required" });
  }

  messageHistory.push({ role: "user", content: userMessage });
  if (!messageHistory) {
    try {
      const assistantMessage = await callDeepseekAPI(messageHistory);

      messageHistory.push({ role: "assistant", content: assistantMessage });
      mRes.sendJSON(res, 200, {
        result: true,
        data: JSON.parse(assistantMessage),
      });
    } catch (error) {
      console.error("Error calling Deepseek:", error.message);
      res.status(500).json({ error: "Failed to call Deepseek API" });
    }
  }
};

exports.resetHistory = (req, res) => {
  messageHistory = messageHistory.slice(0, 1); // system 메시지만 유지
  mRes.sendJSON(res, 200, {
    result: true,
    data: "Chat history reset.",
  });
};
