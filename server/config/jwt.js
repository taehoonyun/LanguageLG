module.exports = {
  secret: process.env.JWT_SECRET || 'your-secret-key',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
  expiresIn: '1h',
  refreshExpiresIn: '7d',
  algorithm: 'HS256',
  issuer: 'llg-app',
  audience: 'llg-users'
}; 