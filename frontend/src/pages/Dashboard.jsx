"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useTheme } from "../Context/ThemeContext"
import { motion, AnimatePresence } from "framer-motion"
import { FiArrowRight, FiCheck, FiLock, FiUser, FiCalendar, FiStar, FiMessageSquare, FiX, FiSend } from "react-icons/fi"

const Dashboard = () => {
  const { isDark } = useTheme()
  const [progressData, setProgressData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [chatOpen, setChatOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your onboarding assistant. How can I help you today?",
      sender: "bot",
      time: "Just now"
    }
  ])

  // Onboarding steps data
  const onboardingSteps = [
    {
      id: 1,
      title: "Company Introduction",
      description: "Learn about our company culture and values",
      icon: "🏢",
      duration: "10 min",
      color: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      id: 2,
      title: "Work Tools Setup",
      description: "Get familiar with Slack, Gmail, and other tools",
      icon: "🛠️",
      duration: "15 min",
      color: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      id: 3,
      title: "Meet the Team",
      description: "Get to know your colleagues and team members",
      icon: "👥",
      duration: "12 min",
      color: "bg-green-100 dark:bg-green-900/30",
    },
    {
      id: 4,
      title: "Company Policies",
      description: "Important policies and guidelines to know",
      icon: "📋",
      duration: "20 min",
      color: "bg-yellow-100 dark:bg-yellow-900/30",
    },
    {
      id: 5,
      title: "First Week Tasks",
      description: "Your checklist for the first week",
      icon: "✅",
      duration: "8 min",
      color: "bg-pink-100 dark:bg-pink-900/30",
    },
    {
      id: 6,
      title: "Final Quiz",
      description: "Test your knowledge with a quick quiz",
      icon: "🎯",
      duration: "5 min",
      color: "bg-indigo-100 dark:bg-indigo-900/30",
    },
  ]

  const storedUser = localStorage.getItem("userdata")
  const userdata = storedUser ? JSON.parse(storedUser) : null
  const userId = userdata?.id
  const token = localStorage.getItem("token")

  useEffect(() => {
    if (!userId || !token) return
    setLoading(true)
    fetch(`http://localhost:5150/api/employee/${userdata.id}/progress`, {
      headers: {
        Authorization: `Authorization ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const error = await res.text()
          throw new Error(error || "Failed to fetch progress data")
        }
        return res.json()
      })
      .then((data) => {
        setProgressData(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setProgressData(null)
        setLoading(false)
      })
  }, [userId, token])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!message.trim()) return
    
    // Add user message
    const newUserMessage = {
      id: chatMessages.length + 1,
      text: message,
      sender: "user",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    
    setChatMessages([...chatMessages, newUserMessage])
    setMessage("")
    
    // Simulate bot response after a delay
    setTimeout(() => {
      const responses = [
        "I can help with that! Have you checked the 'Company Introduction' section?",
        "Great question! The typical onboarding takes about 1-2 weeks to complete.",
        "You can find all the HR documents in the 'Company Policies' section.",
        "For technical setup issues, please contact IT support at support@company.com",
        "Your manager will schedule a 1:1 meeting during your first week."
      ]
      
      const botResponse = {
        id: chatMessages.length + 2,
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: "bot",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })      }
      
      setChatMessages(prev => [...prev, botResponse])
    }, 1000 + Math.random() * 2000)
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* Welcome Header Section */}
      <div
        className={`${isDark ? "bg-gray-800" : "bg-white"} shadow-sm border-b ${isDark ? "border-gray-700" : "border-gray-200"} transition-colors duration-300`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-20 h-20 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center shadow-lg"
              >
                <FiUser className="text-white text-3xl" />
              </motion.div>
            </div>
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"} transition-colors duration-300`}>
              Welcome to Your Onboarding Journey
            </h1>
            <p className={`text-xl ${isDark ? "text-gray-300" : "text-gray-600"} max-w-3xl mx-auto transition-colors duration-300`}>
              {userdata?.name ? `Hello ${userdata.name}!` : "Hello!"} We're excited to have you join our team. Complete
              these steps to get fully onboarded and ready to make an impact.
            </p>
            <div className="flex justify-center items-center mt-6 space-x-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full ${isDark ? "bg-gray-700" : "bg-gray-100"} transition-colors duration-300`}
              >
                <FiCalendar className={`${isDark ? "text-gray-300" : "text-gray-600"}`} />
                <span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-600"} transition-colors duration-300`}>
                  Day 1 of Onboarding
                </span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full ${isDark ? "bg-orange-900/30" : "bg-orange-100"} transition-colors duration-300`}
              >
                <FiStar className="text-orange-500" />
                <span className={`text-sm font-medium ${isDark ? "text-orange-300" : "text-orange-700"} transition-colors duration-300`}>
                  New Employee
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence>
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col justify-center items-center h-64"
            >
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mb-6"
              />
              <p className={`text-lg ${isDark ? "text-gray-300" : "text-gray-600"} transition-colors duration-300`}>
                Loading your onboarding progress...
              </p>
            </motion.div>
          ) : !progressData ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-center py-12"
            >
              <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">⚠️</span>
              </div>
              <h2 className={`text-2xl font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"} transition-colors duration-300`}>
                Oops! Something went wrong
              </h2>
              <p className={`text-lg ${isDark ? "text-gray-300" : "text-gray-700"} mb-2 transition-colors duration-300`}>
                Unable to load your onboarding progress.
              </p>
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"} transition-colors duration-300`}>
                Please refresh the page or contact support if the issue persists.
              </p>
            </motion.div>
          ) : (
            <>
              {/* Progress Overview Section */}
              <ProgressSection progress={progressData.progress} isDark={isDark} />

              {/* Statistics Cards */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="grid md:grid-cols-3 gap-6 mb-12"
              >
                <StatCard
                  value={progressData.completedSteps.length}
                  label="Steps Completed"
                  color="text-orange-500"
                  isDark={isDark}
                />
                <StatCard
                  value={6 - progressData.completedSteps.length}
                  label="Steps Remaining"
                  color="text-blue-500"
                  isDark={isDark}
                />
                <StatCard 
                  value={"70 min"} 
                  label="Total Time" 
                  color="text-green-500" 
                  isDark={isDark} 
                />
              </motion.div>

              {/* Onboarding Steps Section */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mb-8"
              >
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {onboardingSteps.map((step, index) => {
                    const completed = progressData.completedSteps.includes(step.id)
                    const previousCompleted = step.id === 1 || progressData.completedSteps.includes(step.id - 1)
                    return (
                      <StepCard
                        key={step.id}
                        step={{ ...step, completed, previousCompleted }}
                        index={index}
                        isDark={isDark}
                      />
                    )
                  })}
                </div>
              </motion.div>

              {/* Completion Celebration */}
              {progressData.progress === 100 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  className={`rounded-2xl p-8 text-center shadow-lg ${
                    isDark
                      ? "bg-gradient-to-r from-green-900/40 to-blue-900/40"
                      : "bg-gradient-to-r from-green-50 to-blue-50"
                  } border ${isDark ? "border-green-800" : "border-green-200"} transition-colors duration-300`}
                >
                  <motion.div 
                    animate={{ 
                      rotate: [0, 10, -10, 10, -10, 0],
                      y: [0, -10, 0, -10, 0]
                    }}
                    transition={{ duration: 1.5, repeat: 1 }}
                    className="text-6xl mb-4"
                  >
                    🎉
                  </motion.div>
                  <h3 className={`text-3xl font-bold mb-4 ${isDark ? "text-green-400" : "text-green-800"} transition-colors duration-300`}>
                    Congratulations! You're All Set!
                  </h3>
                  <p className={`text-lg ${isDark ? "text-green-300" : "text-green-700"} mb-6 transition-colors duration-300`}>
                    You've successfully completed your onboarding journey. Welcome to the team! You're now ready to
                    start making an impact.
                  </p>
                  <div className="flex justify-center space-x-4">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className={`px-6 py-3 rounded-full ${isDark ? "bg-green-800" : "bg-green-100"} transition-colors duration-300`}
                    >
                      <span className={`text-sm font-medium ${isDark ? "text-green-300" : "text-green-800"} transition-colors duration-300`}>
                        🏆 Onboarding Complete
                      </span>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
      </main>

      {/* Chatbot Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        {chatOpen ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className={`w-80 h-96 rounded-xl shadow-xl flex flex-col ${isDark ? "bg-gray-800" : "bg-white"} border ${isDark ? "border-gray-700" : "border-gray-200"} transition-colors duration-300`}
          >
            <div className={`p-4 border-b ${isDark ? "border-gray-700" : "border-gray-200"} flex justify-between items-center transition-colors duration-300`}>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                  <FiMessageSquare className="text-white text-sm" />
                </div>
                <h3 className={`font-semibold ${isDark ? "text-white" : "text-gray-800"} transition-colors duration-300`}>
                  Onboarding Assistant
                </h3>
              </div>
              <button 
                onClick={() => setChatOpen(false)}
                className={`p-1 rounded-full ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"} transition-colors duration-300`}
              >
                <FiX className={isDark ? "text-gray-300" : "text-gray-600"} />
              </button>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                {chatMessages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, x: msg.sender === "bot" ? -10 : 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex ${msg.sender === "bot" ? "justify-start" : "justify-end"}`}
                  >
                    <div 
                      className={`max-w-xs p-3 rounded-lg ${msg.sender === "bot" 
                        ? isDark 
                          ? "bg-gray-700 text-gray-100" 
                          : "bg-gray-100 text-gray-800"
                        : isDark
                          ? "bg-orange-600 text-white"
                          : "bg-orange-500 text-white"
                      } transition-colors duration-300`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <p className={`text-xs mt-1 ${msg.sender === "bot" 
                        ? isDark ? "text-gray-400" : "text-gray-500"
                        : "text-orange-100"
                      } transition-colors duration-300`}>
                        {msg.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
         <form onSubmit={handleSendMessage} className={`p-4 border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}>


              <div className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask about onboarding..."
                  className={`flex-1 px-4 py-2 rounded-full text-sm ${isDark ? "bg-gray-700 text-white placeholder-gray-400" : "bg-gray-100 text-gray-800 placeholder-gray-500"} transition-colors duration-300 focus:outline-none focus:ring-2 ${isDark ? "focus:ring-orange-500" : "focus:ring-orange-400"}`}
                />
                <button
                  type="submit"
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? "bg-orange-600 hover:bg-orange-700" : "bg-orange-500 hover:bg-orange-600"} text-white transition-colors duration-300`}
                >
                  <FiSend className="text-sm" />
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setChatOpen(true)}
            className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center ${isDark ? "bg-orange-600" : "bg-orange-500"} text-white transition-colors duration-300`}
          >
            <FiMessageSquare className="text-xl" />
          </motion.button>
        )}
      </div>
    </div>
  )
}

const StatCard = ({ value, label, color, isDark }) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    className={`rounded-2xl p-6 text-center shadow-md border ${
      isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
    } transition-colors duration-300`}
  >
    <div className={`text-3xl font-bold ${color} mb-2`}>{value}</div>
    <div className={`font-medium ${isDark ? "text-gray-300" : "text-gray-600"} transition-colors duration-300`}>{label}</div>
  </motion.div>
)

const ProgressSection = ({ progress, isDark }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
    className={`rounded-2xl p-8 mb-12 shadow-lg border ${
      isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
    } transition-colors duration-300`}
  >
    <div className="flex flex-col lg:flex-row items-center justify-between mb-8">
      <div className="text-center lg:text-left mb-6 lg:mb-0">
        <div className="flex justify-center lg:justify-start items-center mb-4">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-3"></div>
          <span className={`text-sm font-medium ${isDark ? "text-green-400" : "text-green-600"} transition-colors duration-300`}>
            Onboarding in Progress
          </span>
        </div>
        <h2 className={`text-2xl sm:text-3xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"} transition-colors duration-300`}>
          Your Progress Journey
        </h2>
        <p className={`text-lg ${isDark ? "text-gray-300" : "text-gray-600"} transition-colors duration-300`}>
          You're doing amazing! Keep up the momentum to complete your onboarding.
        </p>
      </div>
      <div className="text-center">
        <div className="text-5xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent mb-2">
          {progress}%
        </div>
        <div className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-500"} mb-1 transition-colors duration-300`}>Complete</div>
        <div className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"} transition-colors duration-300`}>
          {progress === 100 ? "🎉 All done!" : "Keep going!"}
        </div>
      </div>
    </div>

    <div className={`w-full ${isDark ? "bg-gray-700" : "bg-gray-200"} rounded-full h-4 mb-4 overflow-hidden transition-colors duration-300`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1.5, delay: 0.5, type: "spring" }}
        className="bg-gradient-to-r from-orange-500 to-amber-500 h-4 rounded-full relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 opacity-30 animate-pulse"></div>
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          {progress > 15 && <div className="w-2 h-2 bg-white rounded-full shadow-sm"></div>}
        </div>
      </motion.div>
    </div>

    <div className={`flex justify-between text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-500"} transition-colors duration-300`}>
      <span>🚀 Started</span>
      <span className="text-orange-500 font-bold">{progress}% Complete</span>
      <span>🎯 Finished</span>
    </div>
  </motion.div>
)

const StepCard = ({ step, index, isDark }) => {
  const isLocked = !step.completed && step.id > 1 && !step.previousCompleted
  const isNext = !step.completed && step.previousCompleted

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.1 }}
      whileHover={{ y: isLocked ? 0 : -5 }}
      className={`rounded-2xl p-6  hover: border relative ${
        isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
      } ${isLocked ? "opacity-60" : ""} ${
        isNext ? "ring-2 ring-orange-500 ring-opacity-50 shadow-orange-100" : ""
      } transition-colors duration-300`}
    >
      {/* Next Step Indicator */}
      {isNext && (
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center shadow-lg"
        >
          <span className="text-white text-sm font-bold">!</span>
        </motion.div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className={`w-14 h-14 ${step.color} rounded-xl flex items-center justify-center shadow-inner relative transition-colors duration-300`}>
          <span className="text-2xl">{step.icon}</span>
          {step.completed && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center shadow-md"
            >
              <FiCheck className="text-white text-sm" />
            </motion.div>
          )}
        </div>
        <div className="flex flex-col items-end space-y-2">
          <span
            className={`text-xs font-medium px-3 py-1 rounded-full ${
              isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"
            } transition-colors duration-300`}
          >
            {step.duration}
          </span>
          {isLocked && (
            <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center shadow-md">
              <FiLock className="text-white text-xs" />
            </div>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h3 className={`text-lg font-semibold mb-2 ${isDark ? "text-white" : "text-gray-800"} transition-colors duration-300`}>{step.title}</h3>
        <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"} leading-relaxed transition-colors duration-300`}>{step.description}</p>
      </div>

      {isLocked ? (
        <div className="w-full shadow  text-center py-3 rounded-xl font-medium bg-gray-400 text-white cursor-not-allowed flex items-center justify-center shadow-md shadow-orange space-x-2">
          <FiLock className="text-sm" />
          <span>Complete Previous Step</span>
        </div>
      ) : (
        <Link
          to={`/step/${step.id}`}
          className={`group flex items-center justify-center w-full py-3 rounded-xl font-medium transition-all duration-300 ${
            step.completed
              ? `${isDark ? "bg-gray-700 hover:bg-gray-600 text-gray-300" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`
              : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
          }`}
        >
          <span className="mr-2">{step.completed ? "Review Step" : "Start Step"}</span>
          <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      )}
    </motion.div>
  )
}

export default Dashboard