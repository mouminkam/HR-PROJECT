const Employee = require("../models/Employee");

// تحديث حالة التقدم
exports.completeStep = async (req, res) => {
  const { id } = req.params;
  const { stepId } = req.body;
  const TOTAL_STEPS = 6; // افتراضيًا، يمكن تعديله

  try {
    const employee = await Employee.findById(id);
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    // تجنب تكرار الخطوة إذا كانت مكتملة سابقًا
    if (!employee.completedSteps.includes(stepId)) {
      employee.completedSteps.push(stepId);
      employee.currentStep = stepId + 1; // الانتقال للخطوة التالية
      employee.progress = Math.round(
        (employee.completedSteps.length / TOTAL_STEPS) * 100
      );
      employee.status = "In Progress"
      // تحديث الحالة إذا أكمل جميع الخطوات
      if (employee.completedSteps.length === TOTAL_STEPS) {
        employee.status = "Completed";
      }

      await employee.save();
    }

    res.json({
      progress: employee.progress,
      currentStep: employee.currentStep,
      status: employee.status,
      completedSteps: employee.completedSteps,
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

//جلب اليو سر الحالي

exports.getEmployeeProgress = async (req, res) => {
  const { id } = req.params;

  try {
    const employee = await Employee.findById(id).select("-password");
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    res.json({
      progress: employee.progress,
      currentStep: employee.currentStep,
      completedSteps: employee.completedSteps,
      status: employee.status,
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// عرض البيانات بعد اكمال جميع الخطوات

exports.getCompletionData = async (req, res) => {
  const { id } = req.params;

  try {
    const employee = await Employee.findById(id);
    if (!employee || employee.status !== "Completed") {
      return res
        .status(400)
        .json({ message: "Employee has not completed all steps" });
    }

    res.json({
      totalSteps: 6,
      timeSpent: "2 hours", // يمكنك حساب الوقت الفعلي بين startDate والآن
      achievement: "Onboarding Champion!",
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};
