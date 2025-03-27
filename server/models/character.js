const mongoose = require("mongoose");

// Character schema for the CharacterInfo collection
const characterSchema = new mongoose.Schema({
  name: String,           // Character name (e.g., "Luna")
  personality: String,    // Short description of personality
  promptPrefix: String    // Prompt template for consistent tone
});

// Use the "CharacterInfo" collection in the "Characters" database
module.exports = mongoose.model("Character", characterSchema, "CharacterInfo");
