const Employee = require("../models/Employee");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Employee.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email, type: user.type },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      token,
      user: {
        id: user._id, 
        name: user.name,
        type: user.type,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// كونترولر تسجيل مستخدم جديد
exports.registerUser = async (req, res) => {
  const { name, email, password, type } = req.body;

  try {
    // تحقق اذا الايميل موجود أصلاً
    const existingUser = await Employee.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already in use" });

    // تشفير كلمة المرور
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // إنشاء مستخدم جديد
    const newUser = new Employee({
      name,
      email,
      password: hashedPassword,
      type: type || "employee", // نوع المستخدم إفتراضي employee إذا ما تم تحديده
      progress: 0,
      currentStep: 1,
      completedSteps: [],
      status: "Not Started",
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
