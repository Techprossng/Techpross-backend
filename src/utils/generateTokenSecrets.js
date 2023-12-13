const crypto = require('crypto');
require('dotenv/config');


// Read the secret keys from the environment variables
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
console.log(accessTokenSecret, refreshTokenSecret);

// If the secret keys are not defined in the environment variables, generate new ones
if (!accessTokenSecret || !refreshTokenSecret) {
  // Generate secure random buffers for access and refresh tokens
  const secureRandomBufferForAccessToken = crypto.randomBytes(64);
  const secureRandomBufferForRefreshToken = crypto.randomBytes(64);

  // Convert the buffers to hexadecimal strings
  const secureAccessTokenSecret = secureRandomBufferForAccessToken.toString('hex');
  const secureRefreshTokenSecret = secureRandomBufferForRefreshToken.toString('hex');

  // Assign the generated keys to the environment variables
  process.env.ACCESS_TOKEN_SECRET = secureAccessTokenSecret;
  process.env.REFRESH_TOKEN_SECRET = secureRefreshTokenSecret;
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
  console.log(accessTokenSecret, refreshTokenSecret);

}

