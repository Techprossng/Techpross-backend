const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

const createAccessToken = async (email) => {
  const sign = promisify(jwt.sign);
  const token = await sign({ email }, secretKey, { expiresIn: '1d' });
  return token;
};

const createRefreshToken = async (email) => {
  const sign = promisify(jwt.sign);
  const refreshToken = await sign({ email }, refreshTokenSecret, { expiresIn: '1d' });
  return refreshToken;
};

const verifyAccessToken = async (token) => {
  const verify = promisify(jwt.verify);
  try {
    const decoded = await verify(token, accessTokenSecret);
    return decoded;
  } catch (error) {
    throw new Error('Invalid access token');
  }
};

const verifyRefreshToken = async (token) => {
  const verify = promisify(jwt.verify);
  try {
    const decoded = await verify(token, refreshTokenSecret);
    return decoded;
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};

module.exports = { createAccessToken, createRefreshToken, verifyAccessToken, verifyRefreshToken };
