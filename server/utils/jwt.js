const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || 'your-access-token-secret';
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-token-secret';

const generateAccessToken = (username) => {
  console.log("Generating access token for:", username);
  const token = jwt.sign({ username }, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
  console.log("Generated token:", token);
  return token;
};

const generateRefreshToken = (username) => {
  console.log("Generating refresh token for:", username);
  return jwt.sign({ username }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    return decoded;
  } catch (error) {
    console.error("Token verification failed:", error);
    throw new Error('Invalid access token');
  }
};

const verifyRefreshToken = (token) => {
  try {
    console.log("Verifying refresh token:", token);
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
    console.log("Decoded refresh token:", decoded);
    return decoded;
  } catch (error) {
    console.error("Refresh token verification failed:", error);
    throw new Error('Invalid refresh token');
  }
};

const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    throw new Error('Invalid token format');
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  decodeToken
}; 