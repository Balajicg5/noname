
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { successResponse, errorResponse } = require('../utils/responseUtils');

// @desc    Register a new user
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return errorResponse(res, 'User already exists', 400);
    }

    // Create a new user
    user = new User({
      username,
      email,
      password,
    });

    // Save the user to the database
    await user.save();

    successResponse(res, 'User registered successfully', null, 201);
  } catch (error) {
    console.error(error.message);
    errorResponse(res, 'Server error');
  }
};

// @desc    Authenticate user & get token
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse(res, 'Invalid credentials', 400);
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid credentials', 400);
    }

    // Create and sign a JWT
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        successResponse(res, 'Authentication successful', { token });
      }
    );
  } catch (error) {
    console.error(error.message);
    errorResponse(res, 'Server error');
  }
};
