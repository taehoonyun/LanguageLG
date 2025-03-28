const db = require("../database/mongoDB");
const History = require("../models/History");

async function saveConversationSummary(userId, friendId, summary) {
  try {
    const doc = new History({ userId, friendId, summary });
    await doc.save();
    console.log("✅ Conversation summary saved with Mongoose!");
  } catch (error) {
    console.error("Error saving conversation summary:", error);
    throw error;
  }
}

async function getLastSummary(userId, friendId) {
  try {
    const summary = await History.findOne({ userId, friendId })
      .sort({ timestamp: -1 })
      .exec();

    return summary ? [summary] : [];
  } catch (error) {
    console.error("Error getting last summary:", error);
    return [];
  }
}

module.exports = { saveConversationSummary, getLastSummary };
