const User = require('../models/User');
const { createAccessToken, createRefreshToken, verifyPassword } = require('../middlewares/token');
const { encryptPassword } = require('../utils/util');

class UserController {
  static async register(request, response) {
    try {
      const { email, password } = request.body;

      // Validate email and password
      if (!this.validateEmail(email) || !this.validatePassword(password)) {
        return response.status(400).json({ error: 'Invalid email or password format' });
      }

      // Check if email already exists
      const existingUser = await User.query().findOne({ email });
      if (existingUser) {
        return response.status(400).json({ error: 'Email already registered' });
      }

      // Encrypt password
      const hashedPassword = await encryptPassword(password);

      // Create a new user
      const newUser = await User.query().insert({ email, password: hashedPassword });

      // Create tokens
      const accessToken = await createAccessToken(email);
      const refreshToken = await createRefreshToken(email);

      return response.status(201).json({
        message: 'Registration successful',
        accessToken,
        refreshToken,
        ...newUser,
      });
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Internal server error' });
    }
  }

  static async login(request, response) {
    try {
      const { email, password } = request.body;

      // Verify user
      const user = await User.query().findOne({ email });
      if (!user) {
        return response.status(400).json({ error: 'User not found' });
      }

      // Verify password
      const isMatch = await verifyPassword(password, user.password);
      if (!isMatch) {
        return response.status(400).json({ error: 'Wrong password' });
      }

      // Create tokens
      const accessToken = await createAccessToken(email);
      const refreshToken = await createRefreshToken(email);

      return response.status(200).json({
        message: 'Login successful',
        accessToken,
        refreshToken,
        ...user,
      });
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Internal server error' });
    }
  }

  // Validation methods
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePassword(password) {
    return password.length >= 8;
  }
}

module.exports = UserController;
