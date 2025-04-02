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
  content: `You are just a friend casually chatting with the user in English. Don't sound like a teacher or tutor. 
Just chat like a real friend would and show your opinion.

Keep your reply short (3–5 sentences max) and casual.

ALWAYS respond strictly in this JSON format:
{
  "Response": "GPT's reply.",
  "Error": "Correct any grammar mistakes and suggest a more natural or native-like way to say the same sentence, if needed."
}`,
};

const summaryPromptTemplate = {
  role: "system",
  content: `Summarize what the user has told you so far in 3–5 short bullet points. 
Only include key facts, habits, preferences, or repeated topics they’ve mentioned.
Avoid full sentences. Use simple, memory-style phrases like:
- Likes spicy ramen
- Works late shifts
- Goes to the gym at night
Now, summarize this chat:
---
<Insert Chat Log Here>
`
};

const shouldSummarize = (chatHistory) => {
  return chatHistory.length >= 7; 
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

  const { messageHistory: userMessageHistory, friendId } = conversation;

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

    // Check if we should summarize the conversation
    console.log(userMessageHistory);
    
    if (shouldSummarize(userMessageHistory)) {
      try {
        // Create summary of the conversation
        const summaryPrompt = [
          summaryPromptTemplate,
          ...userMessageHistory,
        ];
        const trimmedPrompt = summaryPrompt.filter((_, i) => i !== 1);
        const summaryResult = await callOpenAIAPI(trimmedPrompt);

        // Save the summary to database
        await saveConversationSummary(
          userId,
          friendId,
          summaryResult
        );

        // Clear the message history after saving summary
        activeConversations.set(userId, {
          ...conversation,
          messageHistory: [
            baseSystemMessage,
            {
              role: "system",
              content: conversation.personality.promptPrefix + 
                (conversation.location ? ` You are at ${conversation.location}. ` : "") +
                " Here is the summary of past conversations: " + summaryResult,
            },
          ],
        });
      } catch (error) {
        console.error("Error saving conversation summary:", error);
      }
    }

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
      summaryPromptTemplate,
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
