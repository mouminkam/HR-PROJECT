const express = require('express');
const router = express.Router();
const { completeStep, getEmployeeProgress, getCompletionData } = require('../controllers/employeeController');
const { auth } = require('../middleware/authMiddleware');


//  يستخدم عندما يضغط الموظف على زر "أكملت الخطوة" في الواجهة الأمامية (مثل: بعد مشاهدة فيديو أو حل كويز).
// Response
// {
//   "progress": 50,
//   "currentStep": 4,
//   "status": "In Progress"
// }
router.post('/:id/complete-step', auth, completeStep);
// يجلب حالة التقدم الحالية للموظف (نسبة الإكمال، الخطوة الحالية، الخطوات المكتملة).
// respons
//{
//   "progress": 50,
//   "currentStep": 4,
//   "completedSteps": [1, 2, 3],
//   "status": "In Progress"
// }
router.get('/:id/progress', auth, getEmployeeProgress);
//يعرض بيانات الإنجاز بعد إكمال جميع الخطوات (مثال: رسالة تهنئة، الوقت المستغرق).
//response 
// {
//   "totalSteps": 6,
//   "timeSpent": "2 hours",
//   "achievement": "Onboarding Champion!"
// }
router.get('/:id/completion-data', auth, getCompletionData);

module.exports = router;