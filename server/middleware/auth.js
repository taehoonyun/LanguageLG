const mRes = require("../module/commonResponse");
const { verifyAccessToken } = require("../utils/jwt");

const validateToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error("No token provided");
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyAccessToken(token);
  
  // Add user info to request
  req.user = decoded;
  return true;
};

const authMiddleware = (req, res, next) => {
  try {
    validateToken(req);
    next();
  } catch (error) {
    if (error.message === 'Invalid access token') {
      mRes.sendJSONError(res, 401, "Invalid or expired access token");
    } else {
      mRes.sendJSONError(res, 401, "Authentication failed");
    }
  }
};

module.exports = authMiddleware; 