// module/characterCache.js
const Character = require("../models/character");

let characterMap = new Map(); // 캐릭터 이름 → 성격 정보

const loadCharacters = async () => {
  const characters = await Character.find({});
  characterMap.clear();
  characters.forEach((c) => {
    characterMap.set(c.name, c); // key: "Luna", value: { personality, promptPrefix, ... }
  });
  console.log("✅ Characters cached in memory");
};

const getCharacterByName = (name) => {
  return characterMap.get(name);
};

module.exports = { loadCharacters, getCharacterByName };
