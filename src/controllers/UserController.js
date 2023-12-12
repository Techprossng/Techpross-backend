const User = require('../models/User');
const { createAccessToken, createRefreshToken, verifyAccessToken } = require('../middlewares/token');
const { encryptPassword, comparePasswords } = require('../utils/util');
const cookieParser = require('cookie-parser');

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

      // Set cookies
      response.cookie('access_token', accessToken, { httpOnly: true });
      response.cookie('refresh_token', refreshToken, { httpOnly: true });

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

  static async protectedRoute(request, response) {
    try {
      // Access token from cookie
      const accessToken = request.cookies.access_token;
      
      // Verify the access token and get decoded token data
      const decodedToken = await verifyAccessToken(accessToken);

      // Access decoded token data
      console.log(decodedToken);

      // User model has method to find a user by ID
      const userId = decodedToken.id; 
      const user = await User.query().findById(userId);

      return response.status(200).json({
        message: 'Protected route accessed',
        user: {
          id: user.id,
          email: user.email,
          // User details as needed can be added here
        },
      });
    } catch (error) {
      console.error(error);
      return response.status(401).json({ error: 'Unauthorized' });
    }
  }
}

module.exports = UserController;
