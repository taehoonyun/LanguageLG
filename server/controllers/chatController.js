const mRes = require("../module/commonResponse");
const { callOpenAIAPI } = require("../module/chatGPT");
const {
  saveConversationSummary,
  getLastSummary,
} = require("../services/memoryService");
const Character = require("../models/character");
const { getCharacterByName } = require("../module/characterCache");

// Store active conversations for each user
const activeConversations = new Map();

// Base system message for English practice
const baseSystemMessage = {
  role: "system",
  content: `You are just a chill American friend casually chatting with the user in English. You're hanging out at places like a cafe, gym, or restaurant. 
Be laid-back and friendly. Don't sound like a teacher or tutor. 
Just chat like a real friend would and show your opinion.

Respond on behalf of the selected tutor. Keep your reply short (3–5 sentences max) and casual.

ALWAYS respond strictly in this JSON format:
{
  "Response": "GPT's reply.",
  "Error": "Correct any grammar mistakes and suggest a more natural or native-like way to say the same sentence, if needed."
}`,
};

exports.sendMessage = async (req, res) => {
  const { userId, message } = req.body;

  if (!message) {
    return mRes.sendJSONError(res, 400, "Message is required");
  }
  // Get the active conversation for this user
  const conversation = activeConversations.get(userId);
  if (!conversation) {
    return mRes.sendJSONError(
      res,
      400,
      "No active conversation found. Please select a character first."
    );
  }

  const { messageHistory: userMessageHistory } = conversation;

  // Add the new message to the history
  userMessageHistory.push({ role: "user", content: message });

  try {
    const assistantMessage = await callOpenAIAPI(userMessageHistory);
    userMessageHistory.push({ role: "assistant", content: assistantMessage });

    // Update the conversation in activeConversations
    activeConversations.set(userId, {
      ...conversation,
      messageHistory: userMessageHistory,
    });

    mRes.sendJSON(res, 200, JSON.parse(assistantMessage));
  } catch (error) {
    console.error("Error calling ChatGPT:", error.message);
    mRes.sendJSONError(res, 500, "Failed to call ChatGPT API");
  }
};

exports.resetHistory = (req, res) => {
  const { userId } = req.body;
  if (userId) {
    activeConversations.delete(userId);
  }
  mRes.sendJSON(res, 200, {
    result: true,
    data: "Chat history reset.",
  });
};

exports.quitChat = async (req, res) => {
  const { userId } = req.body;

  try {
    const conversation = activeConversations.get(userId);
    if (!conversation) {
      return res.status(400).json({ error: "No active conversation found." });
    }

    const { messageHistory, friendId } = conversation;

    // Create summary of the conversation
    const summaryPrompt = [
      {
        role: "system",
        content:
          `Please summarize the following chat between a user and an AI assistant in a format that is optimized for AI memory and contextual understanding.
Focus on:
- The user's intentions and questions
- The assistant's answers and reasoning
- Maintaining logical flow of the conversation
- Structuring by roles if possible (e.g., [User]: ..., [AI]: ...)
- Save only Responses and remove Errors

Avoid unnecessary small talk or emotional expressions. The goal is to help another AI understand what was discussed and why.

Format example:

[User]: Asked how to get better at speaking English naturally.  
[AI]: Suggested practicing with native-like phrases and listening to real conversations.  
[User]: Said they're afraid of making mistakes.  
[AI]: Encouraged them not to worry and reminded that making mistakes is part of learning.  
[User]: Asked for a daily routine to improve.  
[AI]: Shared a simple routine: 10 minutes of listening, 5 minutes of speaking, and 5 minutes of writing each day.

Now, summarize this chat:
---
<Insert Chat Log Here>
`,
      },
      ...messageHistory,
    ];
    const trimmedPrompt = summaryPrompt.filter((_, i) => i !== 1);
    const summaryResult = await callOpenAIAPI(trimmedPrompt);

    // Save the summary to database
    await saveConversationSummary(
      userId,
      friendId,
      summaryResult
    );

    // Remove the conversation from active conversations
    // activeConversations.delete(userId);

    mRes.sendJSON(res, 200, {
      result: true,
      data: "Chat ended and summary saved.",
    });
  } catch (error) {
    console.error("Error in quitChat:", error.message);
    mRes.sendJSONError(res, 500, "Failed to end chat");
  }
};

exports.talkToFriend = async (req, res) => {
  const { userId, friendId, messages, location } = req.body;

  const personality = getCharacterByName(friendId); // Get directly from cache
  if (!personality) {
    return mRes.sendJSONError(res, 400, "Invalid friend name");
  }

  const lastSummary = await getLastSummary(userId, friendId);
  const memoryContext = lastSummary.length > 0 ? lastSummary[0].summary : "";

  // Create initial message history with base system message and character context
  const initialMessageHistory = [
    baseSystemMessage,
    {
      role: "system",
      content:
        personality.promptPrefix +
        (location ? ` You are at ${location}. ` : "") +
        (memoryContext
          ? " Here is the summary of past conversations: " + memoryContext
          : ""),
    },
    ...messages,
  ];
  try {
    const responseText = await callOpenAIAPI(initialMessageHistory);
    initialMessageHistory.push({ role: "assistant", content: responseText });

    // Store the conversation context for this user
    activeConversations.set(userId, {
      personality,
      friendId,
      messageHistory: initialMessageHistory,
      location: location || null
    });

    mRes.sendJSON(res, 200, {
      result: true,
      responseText,
    });
  } catch (error) {
    console.error("Error in talkToFriend:", error.message);
    mRes.sendJSONError(res, 500, "Failed to start conversation");
  }
};
