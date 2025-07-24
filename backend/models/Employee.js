const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  type: { type: String, enum: ['admin', 'employee'], default: 'employee' },
  startDate: { type: Date, default: Date.now },  
  progress: { type: Number, default: 0 },
  currentStep: { type: Number, default: 1 },
  completedSteps: [Number],
  status: { type: String, default: 'Just Started' }
});

module.exports = mongoose.model('Employee', employeeSchema);
