const { body, validationResult } = require('express-validator');

/**
 * Middleware to check validation results from express-validator
 * If errors exist, returns a 400 response with details
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'fail',
      message: 'Validation Error',
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

/**
 * Validation rules for user registration
 */
const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

/**
 * Validation rules for user login
 */
const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

/**
 * Validation rules for creating/updating an employee
 */
const employeeValidation = [
  body('employeeId')
    .trim()
    .notEmpty()
    .withMessage('Employee ID is required')
    .isLength({ min: 1, max: 20 })
    .withMessage('Employee ID must be between 1 and 20 characters'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Employee name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('department')
    .trim()
    .notEmpty()
    .withMessage('Department is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Department must be between 2 and 50 characters'),
  body('designation')
    .trim()
    .notEmpty()
    .withMessage('Designation is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Designation must be between 2 and 50 characters'),
  body('salary')
    .notEmpty()
    .withMessage('Salary is required')
    .isNumeric()
    .withMessage('Salary must be a number')
    .custom((value) => {
      if (value < 0) throw new Error('Salary cannot be negative');
      return true;
    }),
];

/**
 * Validation rules for updating an employee (all fields optional)
 */
const employeeUpdateValidation = [
  body('employeeId')
    .optional()
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage('Employee ID must be between 1 and 20 characters'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('department')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Department must be between 2 and 50 characters'),
  body('designation')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Designation must be between 2 and 50 characters'),
  body('salary')
    .optional()
    .isNumeric()
    .withMessage('Salary must be a number')
    .custom((value) => {
      if (value < 0) throw new Error('Salary cannot be negative');
      return true;
    }),
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  employeeValidation,
  employeeUpdateValidation,
};
