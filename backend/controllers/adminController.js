const Employee = require('../models/Employee');
const bcrypt=require("bcryptjs")

// جلب جميع الموظفين
exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().select('-password'); // استبعاد كلمة السر
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// إضافة موظف جديد
exports.addEmployee = async (req, res) => {
  const { name, email, password} = req.body;

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  try {
    const newEmployee = new Employee({
      name,
      email,
      password: hashedPassword,
      type: 'employee'
    });
    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (err) {
    res.status(400).json({ message: 'Error adding employee' });
  }
};

// controllers/adminController.js
exports.getStats = async (req, res) => {
  try {
    const employees = await Employee.find().select('progress status type');
    const totalEmployees = employees.filter(em=>em.type==="employee").length;

    // حساب الإحصائيات
    const completed = employees.filter(e => e.status === 'Completed').length;
    const inProgress = employees.filter(e => e.status === 'In Progress').length;
    const averageProgress = employees.reduce((sum, e) => sum + e.progress, 0) / totalEmployees || 0;

    res.json({
      totalEmployees,
      completed,
      inProgress,
      averageProgress: Math.round(averageProgress),
      progressDistribution: {
        '0-25%': employees.filter(e => e.progress <= 25).length,
        '26-50%': employees.filter(e => e.progress > 25 && e.progress <= 50).length,
        '51-75%': employees.filter(e => e.progress > 50 && e.progress <= 75).length,
        '76-100%': employees.filter(e => e.progress > 75).length
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const employeeId = req.params.id;

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    await Employee.findByIdAndDelete(employeeId);

    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ message: 'Server error' });
  }
};