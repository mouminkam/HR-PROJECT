"use client";
import { Link } from "react-router-dom";
import { useTheme } from "../Context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { FiArrowRight, FiCheck } from "react-icons/fi";

const Home = () => {
  const { isDark } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <div className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center mb-20"
        >
     

          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              Streamline Your
            </span>{" "}
            <br />
            <span className={isDark ? "text-white" : "text-gray-900"}>
              Onboarding Journey
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className={`text-xl md:text-2xl max-w-3xl mx-auto mb-10 ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Our interactive platform guides you through every step of your
            onboarding with clarity and efficiency.
          </motion.p>

          <motion.div variants={itemVariants} className="flex gap-4">
            <Link
              to="/login"
              className="group relative overflow-hidden bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center"
            >
              <span>Get Started</span>
              <FiArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </motion.div>



        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2
              className={`text-3xl font-bold mb-4 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Why Choose Our Platform
            </h2>
            <p
              className={`text-lg ${
                isDark ? "text-gray-300" : "text-gray-600"
              } max-w-2xl mx-auto`}
            >
              Designed to make your onboarding experience seamless and enjoyable
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "🎯",
                title: "Guided Process",
                description:
                  "Interactive onboarding that walks you through each essential step",
                color: "bg-blue-100 dark:bg-blue-900/30",
              },
              {
                icon: "📊",
                title: "Progress Tracking",
                description:
                  "Clear visual indicators show your completion status at a glance",
                color: "bg-purple-100 dark:bg-purple-900/30",
              },
              {
                icon: "🚀",
                title: "Self-Paced Learning",
                description:
                  "Complete at your own pace with no unnecessary pressure",
                color: "bg-green-100 dark:bg-green-900/30",
              },
            ].map((feature, index) => (
              <FeatureCard
                key={index}
                feature={feature}
                index={index}
                isDark={isDark}
              />
            ))}
          </div>
        </motion.div>

      
      </main>

  
    </div>
  );
};

// Reused components from dashboard for consistency
const StatCard = ({ value, label, color, isDark }) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    className={`rounded-2xl p-6 text-center shadow-md ${
      isDark ? "bg-gray-800" : "bg-white"
    }`}
  >
    <div className={`text-3xl font-bold ${color} mb-2`}>{value}</div>
    <div className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
      {label}
    </div>
  </motion.div>
);

const FeatureCard = ({ feature, index, isDark }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 + index * 0.1 }}
    whileHover={{ y: -5 }}
    className={`rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border ${
      isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
    }`}
  >
    <div className="flex items-start justify-between mb-4">
      <div
        className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center shadow-inner`}
      >
        <span className="text-2xl">{feature.icon}</span>
      </div>
    </div>

    <h3
      className={`text-xl font-semibold mb-3 ${
        isDark ? "text-white" : "text-gray-800"
      }`}
    >
      {feature.title}
    </h3>
    <p
      className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"} mb-6`}
    >
      {feature.description}
    </p>

    <div className="w-full bg-gradient-to-r from-orange-500 to-amber-500 h-1 rounded-full opacity-20"></div>
  </motion.div>
);

export default Home;