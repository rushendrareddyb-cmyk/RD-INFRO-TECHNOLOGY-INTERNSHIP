const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { ApiError } = require('./errorMiddleware');

/**
 * @middleware protect
 * @desc     Protects routes by verifying JWT token
 * @usage    Add as middleware to any route that requires authentication
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token from "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request (excluding password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return next(new ApiError(401, 'User not found. Token is invalid.'));
      }

      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return next(new ApiError(401, 'Token expired. Please log in again.'));
      }
      return next(new ApiError(401, 'Not authorized, token verification failed.'));
    }
  } else {
    return next(new ApiError(401, 'Not authorized, no token provided.'));
  }
};

/**
 * @middleware authorize
 * @desc     Restricts access to specific user roles
 * @param    {...String} roles - Allowed roles (e.g., 'admin', 'manager')
 * @usage    router.get('/admin', protect, authorize('admin'), handler)
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(403, `User role '${req.user.role}' is not authorized to access this resource`)
      );
    }
    next();
  };
};

module.exports = { protect, authorize };
