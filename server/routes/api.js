const express = require("express");
const router = express.Router();
const ctrlGame = require("../controllers/master");
const ctrlAuth = require("../controllers/auth");
const ctrlUtil = require("../controllers/util");

router.get("/auth/login", ctrlGame.game);
router.post('/auth/login', ctrlAuth.login);
router.post('/util/sendMessage', ctrlUtil.sendMessage);
router.post('/util/resetHistory', ctrlUtil.resetHistory);
router.get("/util/getCharacterNames", ctrlUtil.getCharacterNames);

module.exports = router;
