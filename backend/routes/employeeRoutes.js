const express = require('express');
const router = express.Router();
const {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeStats,
} = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');
const {
  validate,
  employeeValidation,
  employeeUpdateValidation,
} = require('../middleware/validateMiddleware');

/**
 * @route   GET /api/employees/stats
 * @desc    Get employee statistics for dashboard
 * @access  Private
 * @note    Must be defined BEFORE /:id to avoid conflict
 */
router.get('/stats', protect, getEmployeeStats);

/**
 * @route   GET  /api/employees       - Get all employees (with search, pagination, sorting)
 * @route   POST /api/employees       - Create a new employee
 * @access  Private
 */
router
  .route('/')
  .get(protect, getEmployees)
  .post(protect, employeeValidation, validate, createEmployee);

/**
 * @route   GET    /api/employees/:id  - Get single employee
 * @route   PUT    /api/employees/:id  - Update employee
 * @route   DELETE /api/employees/:id  - Delete employee
 * @access  Private
 */
router
  .route('/:id')
  .get(protect, getEmployeeById)
  .put(protect, employeeUpdateValidation, validate, updateEmployee)
  .delete(protect, deleteEmployee);

module.exports = router;
