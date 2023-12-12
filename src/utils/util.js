const bcrypt = require('bcrypt');

const saltRounds = 10;

const encryptPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

const comparePasswords = async (password, hashedPassword) => {
  const match = await bcrypt.compare(password, hashedPassword);
  return match;
};

module.exports = { encryptPassword, comparePasswords };
