const Employee = require('../models/Employee');
const { ApiError } = require('../middleware/errorMiddleware');

/**
 * @desc    Get all employees with search, pagination, and sorting
 * @route   GET /api/employees
 * @access  Private
 * @query   search, page, limit, sortBy, order
 */
const getEmployees = async (req, res, next) => {
  try {
    const {
      search = '',
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    // Build search filter
    const searchFilter = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { department: { $regex: search, $options: 'i' } },
            { designation: { $regex: search, $options: 'i' } },
            { employeeId: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    // Calculate pagination
    const pageNum = Math.max(parseInt(page, 10), 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10), 1), 100);
    const skip = (pageNum - 1) * limitNum;

    // Build sort object
    const sortOrder = order === 'asc' ? 1 : -1;
    const sortObj = { [sortBy]: sortOrder };

    // Execute query with pagination
    const [employees, total] = await Promise.all([
      Employee.find(searchFilter).sort(sortObj).skip(skip).limit(limitNum),
      Employee.countDocuments(searchFilter),
    ]);

    res.status(200).json({
      status: 'success',
      results: employees.length,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalRecords: total,
        limit: limitNum,
      },
      data: employees,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single employee by ID
 * @route   GET /api/employees/:id
 * @access  Private
 */
const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return next(new ApiError(404, 'Employee not found'));
    }

    res.status(200).json({
      status: 'success',
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new employee
 * @route   POST /api/employees
 * @access  Private
 */
const createEmployee = async (req, res, next) => {
  try {
    const { employeeId, name, email, department, designation, salary } = req.body;

    // Check if employee ID already exists
    const employeeExists = await Employee.findOne({ employeeId });
    if (employeeExists) {
      return next(new ApiError(409, `Employee with ID '${employeeId}' already exists`));
    }

    // Check if email already exists
    const emailExists = await Employee.findOne({ email: email.toLowerCase() });
    if (emailExists) {
      return next(new ApiError(409, `Employee with email '${email}' already exists`));
    }

    const employee = await Employee.create({
      employeeId,
      name,
      email: email.toLowerCase(),
      department,
      designation,
      salary,
    });

    res.status(201).json({
      status: 'success',
      message: 'Employee created successfully',
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an employee
 * @route   PUT /api/employees/:id
 * @access  Private
 */
const updateEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return next(new ApiError(404, 'Employee not found'));
    }

    // If updating email, check for duplicates
    if (req.body.email && req.body.email.toLowerCase() !== employee.email) {
      const emailExists = await Employee.findOne({
        email: req.body.email.toLowerCase(),
        _id: { $ne: req.params.id },
      });
      if (emailExists) {
        return next(new ApiError(409, `Email '${req.body.email}' is already in use`));
      }
    }

    // If updating employeeId, check for duplicates
    if (req.body.employeeId && req.body.employeeId !== employee.employeeId) {
      const idExists = await Employee.findOne({
        employeeId: req.body.employeeId,
        _id: { $ne: req.params.id },
      });
      if (idExists) {
        return next(new ApiError(409, `Employee ID '${req.body.employeeId}' is already in use`));
      }
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      message: 'Employee updated successfully',
      data: updatedEmployee,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete an employee
 * @route   DELETE /api/employees/:id
 * @access  Private
 */
const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return next(new ApiError(404, 'Employee not found'));
    }

    await employee.deleteOne();

    res.status(200).json({
      status: 'success',
      message: 'Employee deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get employee statistics (for dashboard)
 * @route   GET /api/employees/stats
 * @access  Private
 */
const getEmployeeStats = async (req, res, next) => {
  try {
    const [totalEmployees, departmentStats, salaryStats] = await Promise.all([
      Employee.countDocuments(),
      Employee.aggregate([
        { $group: { _id: '$department', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Employee.aggregate([
        {
          $group: {
            _id: null,
            totalPayroll: { $sum: '$salary' },
            avgSalary: { $avg: '$salary' },
            maxSalary: { $max: '$salary' },
            minSalary: { $min: '$salary' },
          },
        },
      ]),
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        totalEmployees,
        departments: departmentStats,
        salary: salaryStats[0] || {
          totalPayroll: 0,
          avgSalary: 0,
          maxSalary: 0,
          minSalary: 0,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeStats,
};
