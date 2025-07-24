"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTheme } from "../Context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCheck,
  FiChevronRight,
  FiSun,
  FiMoon,
  FiArrowLeft,
  FiPlay,
} from "react-icons/fi";

const Step = () => {
  const { stepId } = useParams();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [currentStep, setCurrentStep] = useState(null);
  const [answers, setAnswers] = useState({});
  const [isCompleting, setIsCompleting] = useState(false);
  const [isStepCompleted, setIsStepCompleted] = useState(false);
  const [toolsSetup, setToolsSetup] = useState([]);
  const [tasksCompleted, setTasksCompleted] = useState([]);

  const stepContent = {
    1: {
      id: 1,
      title: "Company Introduction",
      icon: "🏢",
      type: "video",
      content: {
        video: "/placeholder.svg?height=400&width=600",
        text: "Welcome to our amazing company! We're thrilled to have you join our team. Our company was founded in 2010 with a mission to revolutionize the way people work and collaborate.",
        highlights: [
          "Founded in 2010 with a clear vision",
          "Over 500 employees worldwide",
          "Offices in 12 countries",
          "Award-winning workplace culture",
        ],
      },
    },
    2: {
      id: 2,
      title: "Work Tools Setup",
      icon: "🛠️",
      type: "tools",
      content: {
        tools: [
          {
            name: "Slack",
            description: "Team communication and collaboration",
            icon: "💬",
            setup: "Download the app and join our workspace",
          },
          {
            name: "Gmail",
            description: "Email communication",
            icon: "📧",
            setup: "Access your company email account",
          },
          {
            name: "Zoom",
            description: "Video conferencing",
            icon: "📹",
            setup: "Install Zoom for team meetings",
          },
          {
            name: "Notion",
            description: "Documentation and notes",
            icon: "📝",
            setup: "Access our company workspace",
          },
        ],
      },
    },
    3: {
      id: 3,
      title: "Meet the Team",
      icon: "👥",
      type: "team",
      content: {
        team: [
          {
            name: "Sarah Johnson",
            role: "Team Lead",
            bio: "Sarah has been with us for 5 years and leads our product development team.",
            avatar: "https://randomuser.me/api/portraits/women/44.jpg",
          },
          {
            name: "Mike Chen",
            role: "Senior Developer",
            bio: "Mike is our go-to person for technical challenges and mentoring.",
            avatar: "https://randomuser.me/api/portraits/men/36.jpg",
          },
          {
            name: "Emily Davis",
            role: "Designer",
            bio: "Emily creates beautiful and user-friendly designs for our products.",
            avatar: "https://randomuser.me/api/portraits/women/68.jpg",
          },
          {
            name: "Alex Rodriguez",
            role: "Project Manager",
            bio: "Alex keeps our projects on track and ensures smooth delivery.",
            avatar: "https://randomuser.me/api/portraits/men/22.jpg",
          },
        ],
      },
    },
    4: {
      id: 4,
      title: "Company Policies",
      icon: "📋",
      type: "policies",
      content: {
        policies: [
          {
            title: "Work Hours",
            content:
              "Our standard work hours are 9 AM to 5 PM, Monday through Friday. We offer flexible working arrangements.",
          },
          {
            title: "Remote Work",
            content:
              "Employees can work remotely up to 3 days per week with manager approval.",
          },
          {
            title: "Time Off",
            content:
              "All employees receive 20 days of paid vacation per year, plus public holidays.",
          },
          {
            title: "Code of Conduct",
            content:
              "We maintain a respectful, inclusive workplace where everyone can thrive.",
          },
        ],
      },
    },
    5: {
      id: 5,
      title: "First Week Tasks",
      icon: "✅",
      type: "checklist",
      content: {
        tasks: [
          "Complete IT setup and security training",
          "Schedule 1-on-1 meetings with team members",
          "Review project documentation",
          "Set up development environment",
          "Attend team standup meetings",
          "Complete benefits enrollment",
          "Take company culture survey",
        ],
      },
    },
    6: {
      id: 6,
      title: "Final Quiz",
      icon: "🎯",
      type: "quiz",
      content: {
        questions: [
          {
            question: "What year was the company founded?",
            options: ["2008", "2010", "2012", "2015"],
            correct: 1,
          },
          {
            question: "How many days of vacation do employees receive?",
            options: ["15 days", "20 days", "25 days", "30 days"],
            correct: 1,
          },
          {
            question:
              "What is the maximum number of remote work days per week?",
            options: ["2 days", "3 days", "4 days", "5 days"],
            correct: 1,
          },
        ],
      },
    },
  };

  useEffect(() => {
    setCurrentStep(stepContent[stepId]);

    if (stepContent[stepId]?.type === "tools") {
      setToolsSetup(
        Array(stepContent[stepId].content.tools.length).fill(false)
      );
    }
    if (stepContent[stepId]?.type === "checklist") {
      setTasksCompleted(
        Array(stepContent[stepId].content.tasks.length).fill(false)
      );
    }

    if (stepId === "1") {
      setIsStepCompleted(true);
    } else {
      setIsStepCompleted(false);
    }
  }, [stepId]);

  useEffect(() => {
    if (!currentStep) return;

    switch (currentStep.type) {
      case "video":
        break;
      case "tools":
        setIsStepCompleted(toolsSetup.every(Boolean));
        break;
      case "checklist":
        setIsStepCompleted(tasksCompleted.every(Boolean));
        break;
      case "quiz":
        const allAnswered = currentStep.content.questions.every(
          (_, index) => answers[index] !== undefined
        );
        setIsStepCompleted(allAnswered);
        break;
      default:
        setIsStepCompleted(true);
    }
  }, [currentStep, toolsSetup, tasksCompleted, answers]);

  const storedUser = localStorage.getItem("userdata");
  const userdata = storedUser ? JSON.parse(storedUser) : null;
  const userId = userdata?.id;
  const token = localStorage.getItem("token");

  const handleComplete = async () => {
    setIsCompleting(true);

    try {
      const response = await axios.post(
        `http://localhost:5150/api/employee/${userId}/complete-step`,
        {
          stepId: Number(stepId),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { completedSteps } = response.data;

      if (completedSteps.length === 6) {
        navigate("/completion");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error completing step:", error);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleQuizAnswer = (questionIndex, answerIndex) => {
    setAnswers({
      ...answers,
      [questionIndex]: answerIndex,
    });
  };

  const renderContent = () => {
    if (!currentStep) return null;

    switch (currentStep.type) {
      case "video":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            <div
              className={`bg-gradient-to-br ${
                isDark
                  ? "from-gray-800 to-gray-900"
                  : "from-gray-50 to-gray-100"
              } rounded-3xl p-8 text-center shadow-inner`}
            >
              <div className="relative overflow-hidden rounded-xl mb-6 max-w-2xl mx-auto">
                <video
                  src={currentStep.content.video || "/placeholder.svg"}
                  alt="Company Introduction Video"
                  className="w-full h-auto rounded-xl"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <button className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full font-medium transition-all duration-300 transform hover:scale-110 shadow-lg">
                    <FiPlay className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
            <div className="prose dark:prose-invert max-w-none">
              <p
                className={`text-lg leading-relaxed mb-6 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {currentStep.content.text}
              </p>
              <h3
                className={`text-xl font-semibold mb-4 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Key Highlights:
              </h3>
              <ul className="space-y-3">
                {currentStep.content.highlights.map((highlight, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start space-x-3"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="text-orange-500 mt-1">
                      <FiCheck className="w-5 h-5" />
                    </span>
                    <span
                      className={isDark ? "text-gray-300" : "text-gray-700"}
                    >
                      {highlight}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        );

      case "tools":
        return (
          <motion.div
            className="grid md:grid-cols-2 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {currentStep.content.tools.map((tool, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border ${
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-100"
                }`}
              >
                <div className="flex items-start space-x-4 mb-4">
                  <div
                    className={`w-12 h-12 ${
                      isDark ? "bg-orange-900/20" : "bg-orange-50"
                    } rounded-xl flex items-center justify-center text-2xl`}
                  >
                    {tool.icon}
                  </div>
                  <div>
                    <h3
                      className={`text-xl font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {tool.name}
                    </h3>
                    <p
                      className={
                        isDark
                          ? "text-gray-300 text-sm"
                          : "text-gray-600 text-sm"
                      }
                    >
                      {tool.description}
                    </p>
                  </div>
                </div>
                <p
                  className={
                    isDark ? "text-gray-300 mb-4" : "text-gray-700 mb-4"
                  }
                >
                  {tool.setup}
                </p>
                <button
                  onClick={() => {
                    const newSetup = [...toolsSetup];
                    newSetup[index] = !newSetup[index];
                    setToolsSetup(newSetup);
                  }}
                  className={`w-full py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                    toolsSetup[index]
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "bg-orange-500 hover:bg-orange-600 text-white"
                  }`}
                >
                  {toolsSetup[index] ? "✓ Completed" : "Set Up " + tool.name}
                  <FiChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        );

      case "team":
        return (
          <motion.div
            className="grid md:grid-cols-2 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {currentStep.content.team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border ${
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-100"
                }`}
              >
                <div className="flex items-start space-x-4 mb-4">
                  <div className="relative">
                    <img
                      src={member.avatar || "/placeholder.svg"}
                      alt={member.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-orange-100 dark:border-orange-900/30"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-orange-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                  </div>
                  <div>
                    <h3
                      className={`text-xl font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {member.name}
                    </h3>
                    <p className="text-orange-500 font-medium">{member.role}</p>
                  </div>
                </div>
                <p className={isDark ? "text-gray-300" : "text-gray-700"}>
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </motion.div>
        );

      case "policies":
        return (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {currentStep.content.policies.map((policy, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border ${
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-100"
                }`}
              >
                <h3
                  className={`text-xl font-semibold mb-3 flex items-center ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  <span className="text-orange-500 mr-3">📋</span>
                  {policy.title}
                </h3>
                <p
                  className={`leading-relaxed ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {policy.content}
                </p>
              </motion.div>
            ))}
          </motion.div>
        );

      case "checklist":
        return (
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {currentStep.content.tasks.map((task, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-xl p-4 flex items-center space-x-4 shadow-sm hover:shadow-md transition-shadow duration-300 border ${
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-100"
                }`}
              >
                <input
                  type="checkbox"
                  checked={tasksCompleted[index]}
                  onChange={() => {
                    const newTasks = [...tasksCompleted];
                    newTasks[index] = !newTasks[index];
                    setTasksCompleted(newTasks);
                  }}
                  className={`w-5 h-5 text-orange-500 rounded focus:ring-orange-500 ${
                    isDark ? "border-gray-600" : "border-gray-300"
                  }`}
                />
                <span
                  className={`flex-1 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {task}
                </span>
              </motion.div>
            ))}
          </motion.div>
        );

      case "quiz":
        return (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {currentStep.content.questions.map((question, qIndex) => (
              <motion.div
                key={qIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: qIndex * 0.1 }}
                className={`rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border ${
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-100"
                }`}
              >
                <h3
                  className={`text-xl font-semibold mb-4 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Question {qIndex + 1}: {question.question}
                </h3>
                <div className="space-y-3">
                  {question.options.map((option, oIndex) => (
                    <motion.label
                      key={oIndex}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg transition-colors duration-200 ${
                        answers[qIndex] === oIndex
                          ? isDark
                            ? "bg-orange-900/30 border border-orange-800"
                            : "bg-orange-100 border border-orange-200"
                          : isDark
                          ? "bg-gray-700 hover:bg-gray-600 border border-transparent"
                          : "bg-gray-50 hover:bg-gray-100 border border-transparent"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${qIndex}`}
                        value={oIndex}
                        checked={answers[qIndex] === oIndex}
                        onChange={() => handleQuizAnswer(qIndex, oIndex)}
                        className={`text-orange-500 focus:ring-orange-500 ${
                          isDark ? "border-gray-600" : "border-gray-300"
                        }`}
                      />
                      <span
                        className={isDark ? "text-gray-300" : "text-gray-700"}
                      >
                        {option}
                      </span>
                    </motion.label>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        );

      default:
        return <div>Content not found</div>;
    }
  };

  if (!currentStep) return null;

  return (
    <div className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
      <main className="max-w-4xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner ${
              isDark
                ? "bg-gradient-to-br from-orange-900/20 to-orange-900/10"
                : "bg-gradient-to-br from-orange-100 to-orange-50"
            }`}
          >
            <span className="text-4xl">{currentStep.icon}</span>
          </motion.div>
          <h1
            className={`text-3xl font-bold mb-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {currentStep.title}
          </h1>
          <p className={isDark ? "text-gray-300" : "text-gray-600"}>
            Step {stepId} of 6 • Take your time to complete this section
          </p>

          <div
            className={`mt-6 w-full rounded-full h-2.5 max-w-md mx-auto ${
              isDark ? "bg-gray-700" : "bg-gray-200"
            }`}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(stepId / 6) * 100}%` }}
              transition={{ duration: 0.8, type: "spring" }}
              className="bg-orange-500 h-2.5 rounded-full"
            />
          </div>
        </motion.div>

        <motion.div
          key={stepId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`rounded-3xl p-8 mb-8 shadow-lg border ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
          }`}
        >
          <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
        </motion.div>

        <div className="flex justify-between items-center">
          <Link
            to="/dashboard"
            className={`px-6 py-3 rounded-xl font-medium transition-colors flex items-center space-x-2 ${
              isDark
                ? "border-gray-600 hover:bg-gray-700 text-gray-300"
                : "border-gray-300 hover:bg-gray-50 text-gray-700"
            } border`}
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>

          <div className="flex items-center gap-4">
            {!isStepCompleted && stepId !== "1" && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-sm ${
                  isDark ? "text-orange-300" : "text-orange-600"
                }`}
              >
                Complete all requirements
              </motion.span>
            )}

            <motion.button
              onClick={handleComplete}
              disabled={!isStepCompleted || isCompleting}
              whileHover={
                !isCompleting && isStepCompleted ? { scale: 1.03 } : {}
              }
              whileTap={!isCompleting && isStepCompleted ? { scale: 0.97 } : {}}
              className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg ${
                !isStepCompleted
                  ? isDark
                    ? "bg-gray-700 cursor-not-allowed text-gray-400"
                    : "bg-gray-300 cursor-not-allowed text-gray-500"
                  : isCompleting
                  ? isDark
                    ? "bg-orange-600 cursor-not-allowed"
                    : "bg-orange-400 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600 text-white"
              } flex items-center space-x-2`}
            >
              {isCompleting ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>
                    {stepId === "1" ? "Complete Step" : "Mark as Completed"}
                  </span>
                  <FiChevronRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Step;
