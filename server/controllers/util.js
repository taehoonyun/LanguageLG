const mRes = require("../module/commonResponse");
const Character = require("../models/character");
const mongoose = require("mongoose");

// GET only the names of the characters from CharacterInfo collection
exports.getCharacterNames = async (req, res) => {
  try {
    const characters = await mongoose.connection.db
      .collection("CharacterInfo")
      .find({}, { projection: { name: 1, _id: 0 } })
      .toArray();
    if (characters.length < 0) {
      return;
    }
    const names = characters.map((c) => c.name);

    mRes.sendJSON(res, 200, names);
  } catch (err) {
    console.error("Error in getCharacterNames:", err);
    mRes.sendJSONError(res, 500, "Failed to get character names");
  }
};

exports.getCharacterByName = async (req, res) => {
  try {
    const { name } = req.params;
    const character = await mongoose.connection.db
      .collection("CharacterInfo")
      .findOne({ name }, { projection: { _id: 0 } });

    if (!character) {
      return mRes.sendJSONError(res, 404, "Character not found");
    }

    mRes.sendJSON(res, 200, character);
  } catch (err) {
    console.error("Error in getCharacterByName:", err);
    mRes.sendJSONError(res, 500, "Failed to get character details");
  }
};

module.exports.getCharacters = async (req, res) => {
  try {
    const characters = await Character.find().select("name -_id"); // Only name field

    mRes.sendJSON(res, 200, characters);
  } catch (error) {
    console.error("Error fetching characters:", error);
    mRes.sendJSONError(res, 500, "Failed to fetch characters");
  }
};
