const express = require("express");
const router = express.Router();
const ctrlGame = require("../controllers/master");
const ctrlAuth = require("../controllers/auth");
const ctrlUtil = require("../controllers/util");
const ctrlChat = require("../controllers/chatController");
const authMiddleware = require("../middleware/auth");

// Public routes
router.get("/auth/login", ctrlGame.game);
router.post('/auth/login', ctrlAuth.login);
router.post('/auth/refresh-token', ctrlAuth.refreshToken);

// Protected routes
router.use(authMiddleware);
router.post('/auth/logout', ctrlAuth.logout);
router.post('/chat/sendMessage', ctrlChat.sendMessage);
router.post('/chat/resetHistory', ctrlChat.resetHistory);
router.get("/util/getCharacterNames", ctrlUtil.getCharacterNames);

module.exports = router;
