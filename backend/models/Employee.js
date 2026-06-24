const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: [true, 'Please add an employee ID'],
      unique: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    department: {
      type: String,
      required: [true, 'Please add a department'],
      trim: true,
      index: true,
    },
    designation: {
      type: String,
      required: [true, 'Please add a designation'],
      trim: true,
    },
    salary: {
      type: Number,
      required: [true, 'Please add a salary'],
      min: [0, 'Salary cannot be negative'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for search performance
employeeSchema.index({ name: 'text', department: 'text', designation: 'text' });

module.exports = mongoose.model('Employee', employeeSchema);
