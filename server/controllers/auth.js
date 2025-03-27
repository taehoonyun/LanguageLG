const mRes = require("../module/commonResponse");
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require("../utils/jwt");

const validateLoginRequest = (req) => {
  if (!req.body?.params?.userId) {
    throw new Error("Username is required!");
  }
  return req.body.params.userId;
};

const handleLoginSuccess = (res, userId) => {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId);
  
  // Set refresh token in HTTP-only cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  mRes.sendJSON(res, 200, {
    userId,
    accessToken,
    message: "Login successful"
  });
};

const handleLoginError = (res, error) => {
  mRes.sendJSONError(res, 400, error.message);
};

module.exports.login = async (req, res) => {
  try {
    const userId = validateLoginRequest(req);
    handleLoginSuccess(res, userId);
  } catch (error) {
    handleLoginError(res, error);
  }
};

const handleRefreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new Error("No refresh token provided");
    }

    const decoded = verifyRefreshToken(refreshToken);
    const newAccessToken = generateAccessToken(decoded.userId);
    
    mRes.sendJSON(res, 200, {
      accessToken: newAccessToken,
      message: "Token refreshed successfully"
    });
  } catch (error) {
    mRes.sendJSONError(res, 401, "Invalid refresh token");
  }
};

const handleLogoutSuccess = (res) => {
  // Clear refresh token cookie
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });

  mRes.sendJSON(res, 200, {
    message: "Logout successful"
  });
};

const handleLogoutError = (res, error) => {
  mRes.sendJSONError(res, 500, "Error during logout");
};

module.exports.logout = async (req, res) => {
  try {
    handleLogoutSuccess(res);
  } catch (error) {
    handleLogoutError(res, error);
  }
};

module.exports.refreshToken = handleRefreshToken;
