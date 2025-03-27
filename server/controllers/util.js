const mRes = require("../module/commonResponse");
const { callDeepseekAPI } = require("../module/deepseek");
const Character = require("../models/character");

// GET only the names of the characters from CharacterInfo collection
exports.getCharacterNames = async (req, res) => {
  try {
    const characters = await Character.find().select("name -_id"); // Only name field

    const names = characters.map(c => c.name);
    mRes.sendJSON(res, 200, {
      result: true,
      data: names,
    });
  } catch (err) {
    console.error("Error fetching character names:", err.message);
    mRes.sendJSONError(res, 500, "Failed to get character names");
  }
};