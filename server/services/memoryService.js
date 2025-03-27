const db = require("../database/mongoDB");

async function saveConversationSummary(userId, friendId, summary) {
  await db.conversations.insertOne({
    userId,
    friendId,
    summary,
    timestamp: new Date(),
  });
}

async function getLastSummary(userId, friendId) {
  return await db.conversations
    .find({ userId, friendId })
    .sort({ timestamp: -1 })
    .limit(1)
    .toArray();
}

module.exports = { saveConversationSummary, getLastSummary };
