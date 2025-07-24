import { useState } from "react";
import { useTheme } from "../Context/ThemeContext";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield } from "lucide-react";

const Login = () => {
  const { isDark, toggleTheme } = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    if (!validateForm()) return;
    console.log("Sending:", {
  email: formData.email,
  password: formData.password
});
    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:5150/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      const { token, user } = res.data;

      // Save user data using AuthContext
      login(token, user);

      // Redirect based on role
      setTimeout(() => {
        if (user.type === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      }, 0);
      
    } catch (error) {
      setApiError(error.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex transition-colors duration-300 ${
        isDark ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative overflow-hidden">
        {/* Animated background elements */}
        <motion.div
          className="absolute -left-32 -top-32 w-64 h-64 rounded-full bg-orange-100 dark:bg-orange-900 opacity-20"
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 10, 0],
            y: [0, 10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -right-32 -bottom-32 w-64 h-64 rounded-full bg-orange-100 dark:bg-orange-900 opacity-20"
          animate={{
            scale: [1, 1.1, 1],
            x: [0, -10, 0],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="max-w-md w-full z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-between items-center mb-10">
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div
                className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-orange-500/30 transition-all"
                whileHover={{ rotate: 10, scale: 1.05 }}
              >
                <span className="text-white font-bold text-xl">O</span>
              </motion.div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                OnboardPro
              </span>
            </Link>
       
          </div>

          <div className="mb-10">
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              Welcome back
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Sign in to continue your onboarding journey
            </p>
          </div>

        

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
<input
  type="email"
  name="email"
  value={formData.email}
  onChange={handleChange}
  className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
    errors.email
      ? "border-red-300"
      : "border-gray-300 dark:border-gray-600"
  } bg-white dark:bg-transparent focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all shadow-sm`}
  placeholder="Enter your email"
/>

                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
<input
  type={showPassword ? "text" : "password"}
  name="password"
  value={formData.password}
  onChange={handleChange}
  className={`w-full pl-10 pr-10 py-3 rounded-xl border ${
    errors.password
      ? "border-red-300"
      : "border-gray-300 dark:border-gray-600"
  } bg-white dark:bg-transparent focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all shadow-sm`}
  placeholder="Enter your password"
/>

                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.password}
                  </p>
                )}
              </div>
            </div>

            <motion.button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3.5 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-orange-500/30 relative overflow-hidden"
              whileHover={{ scale: 1.01, y: -2 }}
              whileTap={{ scale: 0.99 }}
              disabled={isLoading}
            >
              <span
                className={`relative z-10 flex items-center justify-center ${
                  isLoading ? "opacity-0" : "opacity-100"
                }`}
              >
                Sign In <ArrowRight className="ml-2 h-4 w-4" />
              </span>
              {isLoading && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center z-20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </motion.div>
              )}
            </motion.button>
          </form>

          {/* Security Badge */}
          <div className="mt-4 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
            <Shield className="w-4 h-4 mr-1.5 text-gray-400 dark:text-gray-500" />
            Your data is securely encrypted
          </div>
        </motion.div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-orange-500 to-orange-600 items-center justify-center p-12 relative overflow-hidden">
        {/* Floating circles */}
        <div className="absolute top-1/4 left-1/4 w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm animate-float"></div>
        <div className="absolute bottom-1/3 right-1/3 w-24 h-24 rounded-full bg-white/15 backdrop-blur-sm animate-float-delay"></div>
        <div className="absolute top-1/3 right-1/4 w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm animate-float-delay-2"></div>

        <motion.div
          className="text-white text-center max-w-md z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.div
            className="w-28 h-28 bg-white/20 rounded-2xl flex items-center justify-center mb-8 mx-auto backdrop-blur-sm shadow-lg"
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <span className="text-5xl">🚀</span>
          </motion.div>
          <h2 className="text-4xl font-bold mb-6">Start Your Journey</h2>
          <p className="text-xl opacity-90 leading-relaxed">
            Join thousands of employees who have successfully completed their
            onboarding with our platform
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
