import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FiLogOut, FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../Context/ThemeContext";
import { useAuth } from "../Context/AuthContext";

const Header = () => {
  const { isDark, toggleTheme } = useTheme();
  const { userdata: user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    localStorage.removeItem("userdata")
  };

  const handleLogoClick = () => {
    const userData = localStorage.getItem("userdata");

    if (!userData) {
      navigate("/");
    } else {
      try {
        const parsed = JSON.parse(userData);
        if (parsed.type === "admin") {
          navigate("/admin");
        } else if (parsed.type === "employee") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      } catch (err) {
        console.error("Error parsing user data", err);
        navigate("/");
      }
    }
  };

  // Color definitions for consistent theming
  const colors = {
    light: {
      background: "bg-white/80",
      border: "border-gray-200",
      textPrimary: "text-gray-800",
      textSecondary: "text-gray-600",
      buttonBg: "bg-gray-100",
      buttonText: "text-gray-700",
      hoverText: "hover:text-orange-600",
      logoGradient: "from-orange-500 to-amber-500",
      userBadge: "bg-gray-200 text-gray-800",
    },
    dark: {
      background: "bg-gray-800/80",
      border: "border-gray-700",
      textPrimary: "text-gray-100",
      textSecondary: "text-gray-300",
      buttonBg: "bg-gray-700",
      buttonText: "text-amber-300",
      hoverText: "hover:text-amber-400",
      logoGradient: "from-orange-400 to-amber-400",
      userBadge: "bg-gray-700 text-gray-100",
    }
  };

  const currentColors = isDark ? colors.dark : colors.light;

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`sticky top-0 z-50 backdrop-blur-md ${currentColors.background} shadow-sm border-b ${currentColors.border}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div onClick={handleLogoClick} className="flex items-center space-x-2 group cursor-pointer">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-9 h-9 bg-gradient-to-r ${currentColors.logoGradient} rounded-lg flex items-center justify-center shadow-md`}
              >
                <span className="text-white font-bold text-lg">O</span>
              </motion.div>
              <span className={`text-xl font-bold bg-gradient-to-r ${currentColors.logoGradient} bg-clip-text text-transparent`}>
                OnboardPro
              </span>
              {user?.type === "admin" && (
                <div className="hidden md:block">
                  <span className="text-gray-500 dark:text-gray-400">Admin Dashboard</span>
                </div>
              )}
              {user?.type === "employee" && (
                <div className="hidden md:block">
                  <span className="text-gray-500 dark:text-gray-400">Employee</span>
                </div>
              )}

            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`flex items-center space-x-2 px-3 py-1 rounded-full ${currentColors.userBadge}`}
                >
                  <span className="font-medium capitalize">{user.name}</span>
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg ${currentColors.buttonBg} ${currentColors.hoverText} transition-colors`}
                >
                  <FiLogOut size={16} />
                  <span className="hidden sm:inline">Logout</span>
                </motion.button>
              </>
            ) : (
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg ${currentColors.buttonBg} ${currentColors.buttonText} transition-colors`}
                >
                  <span>Login</span>
                </motion.button>
              </Link>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${currentColors.buttonBg} ${currentColors.buttonText} transition-colors`}
            >
              {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
