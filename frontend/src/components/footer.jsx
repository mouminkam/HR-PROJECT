import { useTheme } from "../Context/ThemeContext";
import { motion } from "framer-motion";

export const Footer = () => {
  const { isDark } = useTheme();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`mt-20 border-t ${
        isDark ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo Section */}
          <div className="flex items-center mb-4 md:mb-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-md ${
                isDark
                  ? "bg-gradient-to-r from-orange-400 to-amber-400"
                  : "bg-gradient-to-r from-orange-500 to-amber-500"
              }`}
            >
              <span className="text-white font-bold text-xl">O</span>
            </motion.div>
            <span
              className={`text-2xl font-bold ml-2 ${
                isDark
                  ? "bg-gradient-to-r from-orange-400 to-amber-400"
                  : "bg-gradient-to-r from-orange-500 to-amber-500"
              } bg-clip-text text-transparent`}
            >
              OnboardPro
            </span>
          </div>

          {/* Copyright Section */}
          <div
            className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            © {new Date().getFullYear()} OnboardPro. All rights reserved.
          </div>

          {/* Contact Info */}
          <div
            className={`text-sm ${
              isDark ? "text-gray-400" : "text-gray-600"
            } mt-4 md:mt-0`}
          >
            <a
              href="mailto:info@onboardpro.com"
              className="hover:text-amber-500 transition-colors"
            >
              mo2min.2001@gmail.com
            </a>
            <br />
            <a
              href="mailto:info@onboardpro.com"
              className="hover:text-amber-500 transition-colors"
            >
              abdmeda9@gmail.com
            </a>
            <br />
            <a
              href="mailto:info@onboardpro.com"
              className="hover:text-amber-500 transition-colors"
            >
              ismaelbanzer@gmail.com
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};
