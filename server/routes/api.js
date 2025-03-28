const express = require("express");
const router = express.Router();
const ctrlAuth = require("../controllers/auth");
const ctrlUtil = require("../controllers/util");
const ctrlChat = require("../controllers/chatController");
const authMiddleware = require("../middleware/auth");

// Public routes
router.post('/auth/login', ctrlAuth.login);
router.post('/auth/refresh-token', ctrlAuth.refreshToken);
router.get('/util/getCharacterNames', ctrlUtil.getCharacterNames);
router.get('/util/getCharacter/:name', ctrlUtil.getCharacterByName);

// Protected routes
router.use(authMiddleware);
router.post('/auth/logout', ctrlAuth.logout);
router.post('/chat/sendMessage', ctrlChat.sendMessage);
router.post('/chat/resetHistory', ctrlChat.resetHistory);
router.post('/chat/talkToFriend', ctrlChat.talkToFriend);
router.post('/chat/quit', ctrlChat.quitChat);

module.exports = router;
