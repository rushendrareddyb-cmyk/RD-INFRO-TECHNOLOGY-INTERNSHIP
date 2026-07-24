const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/employee_management', {
      serverSelectionTimeoutMS: 5000,
    });
    const users = await User.find({}).lean();
    console.log(JSON.stringify(users, null, 2));
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
