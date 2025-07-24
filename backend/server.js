// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');

// إعدادات
dotenv.config();
const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());

// ربط قاعدة البيانات
const connectDB = require('./config/db');
connectDB();

// الراوتات
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/employee', require('./routes/employee'));
// app.use('/api/steps', require('./routes/steps'));





// تشغيل السيرفر
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
