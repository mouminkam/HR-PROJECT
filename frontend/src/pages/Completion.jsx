"use client";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../Context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

const Completion = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showConfetti, setShowConfetti] = useState(true);
  const { width, height } = useWindowSize();

  useEffect(() => {
    const userData = localStorage.getItem("userdata");
    if (!userData) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(userData));

    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleRestart = () => {
    localStorage.removeItem("onboardingProgress");
    navigate("/dashboard");
  };

  if (!user) return null;

  return (
    <div className={`min-h-screen relative overflow-hidden ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && (
          <Confetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={300}
            gravity={0.2}
            initialVelocityY={15}
            colors={['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFBE0B', '#FB5607']}
          />
        )}
      </AnimatePresence>

      {/* Floating Emoji Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl"
            initial={{
              x: Math.random() * width,
              y: -50,
              opacity: 0,
              rotate: Math.random() * 360
            }}
            animate={{
              y: height + 50,
              opacity: [0, 1, 1, 0],
              rotate: Math.random() * 360
            }}
            transition={{
              duration: 5 + Math.random() * 10,
              delay: Math.random() * 5,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {["🎉", "🎊", "✨", "🌟", "🎈", "🏆", "👏", "🥳"][Math.floor(Math.random() * 8)]}
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] px-6 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="max-w-2xl w-full mx-auto text-center"
        >
          {/* Success Icon */}
          <motion.div 
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg border-4 ${isDark ? "bg-gray-800 border-green-800/50" : "bg-white border-green-200"}`}
          >
            <span className="text-6xl">🎉</span>
          </motion.div>

          {/* Congratulations Message */}
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent"
          >
            Congratulations!
          </motion.h1>

          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`text-2xl md:text-3xl font-semibold mb-4 ${isDark ? "text-gray-200" : "text-gray-800"}`}
          >
            Welcome to the team, <span className="text-orange-500">{user.name}</span>! 🚀
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className={`text-xl mb-8 leading-relaxed max-w-2xl mx-auto ${isDark ? "text-gray-300" : "text-gray-600"}`}
          >
            You've successfully completed your onboarding journey! You're now fully equipped with all the knowledge and
            tools you need to excel in your new role.
          </motion.p>

          {/* Achievement Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className={`rounded-2xl p-8 mb-8 shadow-lg border ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}
          >
            <h3 className={`text-xl font-semibold mb-6 ${isDark ? "text-gray-200" : "text-gray-800"}`}>Your Achievement</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { value: "6", label: "Steps Completed", color: "from-orange-500 to-orange-600" },
                { value: "100%", label: "Progress", color: "from-blue-500 to-blue-600" },
                { value: "70", label: "Minutes Invested", color: "from-green-500 to-green-600" }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="text-center"
                >
                  <div className={`text-4xl font-bold mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value}
                  </div>
                  <div className={`font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Next Steps */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className={`rounded-2xl p-8 mb-8 shadow-lg border ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}
          >
            <h3 className={`text-xl font-semibold mb-4 ${isDark ? "text-gray-200" : "text-gray-800"}`}>What's Next?</h3>
            <div className="space-y-4 text-left">
              {[
                "Check your email for your first week schedule",
                "Join the team Slack workspace",
                "Schedule your first 1-on-1 with your manager",
                "Complete your workspace setup"
              ].map((step, index) => (
                <motion.div 
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <span className="text-green-500 text-xl">✓</span>
                  <span className={isDark ? "text-gray-300" : "text-gray-700"}>{step}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/dashboard"
                className="block bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                View Dashboard
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
             
            </motion.div>
          </motion.div>

          {/* Motivational Quote */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            className={`p-6 rounded-2xl border ${isDark ? "bg-gray-800 border-orange-800" : "bg-white border-orange-200"}`}
          >
            <p className={`text-lg italic mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              "Every expert was once a beginner. Every pro was once an amateur. Every icon was once an unknown."
            </p>
            <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>- Robin Sharma</p>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className={`relative z-10 p-6 text-center ${isDark ? "text-gray-400" : "text-gray-500"}`}
      >
        <p>&copy; {new Date().getFullYear()} OnboardPro. Congratulations on completing your journey!</p>
      </motion.footer>
    </div>
  );
};

export default Completion;