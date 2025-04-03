const mRes = require("../module/commonResponse");
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require("../utils/jwt");

const validateLoginRequest = (req) => {
  if (!req.body?.username) {
    throw new Error("Username is required!");
  }
  return req.body.username;
};

const handleLoginSuccess = (res, username) => {
  const accessToken = generateAccessToken(username);
  const refreshToken = generateRefreshToken(username);
  
  // Set refresh token in HTTP-only cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  const response = {
    result: true,
    token: accessToken,
    user: {
      id: username,
      username: username
    },
    message: "Login successful",
    timestamp: new Date().toISOString()
  };
  mRes.sendJSON(res, 200, response);
};

const handleLoginError = (res, error) => {
  console.error("Login error:", error);
  mRes.sendJSONError(res, 400, error.message);
};

module.exports.login = async (req, res) => {
  try {

    const username = validateLoginRequest(req);
    handleLoginSuccess(res, username);
  } catch (error) {
    console.error("Login process failed:", error);
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
    const newAccessToken = generateAccessToken(decoded.username);
    
    mRes.sendJSON(res, 200, {
      token: newAccessToken,
      message: "Token refreshed successfully"
    });
  } catch (error) {
    mRes.sendJSONError(res, 401, "Invalid refresh token");
  }
};

const handleLogoutSuccess = (res) => {
  res.clearCookie('refreshToken');
  mRes.sendJSON(res, 200, { message: "Logout successful" });
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
