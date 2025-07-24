// routes/admin.js
const express = require('express');
const router = express.Router();
const { getEmployees, addEmployee, getStats, deleteEmployee } = require('../controllers/adminController');
const { auth, isAdmin } = require('../middleware/authMiddleware');

router.get('/employees', auth, isAdmin, getEmployees);

router.post('/employees', auth, isAdmin, addEmployee);

// عرض احصائيات الموظفين 
// response
// {
//   "totalEmployees": 10,
//   "completed": 3,
//   "inProgress": 5,
//   "averageProgress": 62,
//   "progressDistribution": {
//     "0-25%": 2,
//     "26-50%": 3,
//     "51-75%": 3,
//     "76-100%": 2
//   }
// }


router.get('/stats', auth, isAdmin, getStats);

router.delete('/employees/:id', auth, isAdmin, deleteEmployee);





module.exports = router;