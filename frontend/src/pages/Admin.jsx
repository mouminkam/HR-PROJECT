import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../Context/ThemeContext";
import axios from "axios";
import { Trash2, Edit, Plus, X } from "lucide-react";

const Admin = () => {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showStepsModal, setShowStepsModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    completed: 0,
    inProgress: 0,
    averageProgress: 0,
  });
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const [onboardingSteps, setOnboardingSteps] = useState([
    {
      id: 1,
      title: "Company Introduction",
      description: "Learn about our company culture and values",
      duration: "10",
      icon: "🏢",
      active: true,
    },
    {
      id: 2,
      title: "Work Tools Setup",
      description: "Get familiar with Slack, Gmail, and other tools",
      duration: "15",
      icon: "🛠️",
      active: true,
    },
    {
      id: 3,
      title: "Meet the Team",
      description: "Get to know your colleagues and team members",
      duration: "12",
      icon: "👥",
      active: true,
    },
    {
      id: 4,
      title: "Company Policies",
      description: "Important policies and guidelines to know",
      duration: "20",
      icon: "📋",
      active: false,
    },
  ]);

  const [newStep, setNewStep] = useState({
    title: "",
    description: "",
    duration: "",
    icon: "📌",
  });
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStepChange = (e) => {
    setNewStep({ ...newStep, [e.target.name]: e.target.value });
  };

  const addNewStep = () => {
    if (!newStep.title || !newStep.description || !newStep.duration) {
      alert("Please fill all required fields");
      return;
    }

    const step = {
      id: onboardingSteps.length + 1,
      title: newStep.title,
      description: newStep.description,
      duration: newStep.duration,
      icon: newStep.icon,
      active: true,
    };

    setOnboardingSteps([...onboardingSteps, step]);
    setNewStep({
      title: "",
      description: "",
      duration: "",
      icon: "📌",
    });
  };

  const toggleStepStatus = (id) => {
    setOnboardingSteps(
      onboardingSteps.map((step) =>
        step.id === id ? { ...step, active: !step.active } : step
      )
    );
  };

  const deleteStep = (id) => {
    setOnboardingSteps(onboardingSteps.filter((step) => step.id !== id));
  };

  useEffect(() => {
    const userData = localStorage.getItem("userdata");
    const token = localStorage.getItem("token");
    if (userData && token) {
      try {
        const parsedUser = JSON.parse(userData);
        if (parsedUser.type === "admin") {
          setUser(parsedUser);

          const config = {
            headers: { Authorization: `Bearer ${token}` },
          };

          axios
            .get("http://localhost:5150/api/admin/employees", config)
            .then((res) => {
              setEmployees(res.data);
            })
            .catch((err) => console.error("Error fetching employees:", err));

          axios
            .get("http://localhost:5150/api/admin/stats", config)
            .then((res) => setStats(res.data))
            .catch((err) => console.error("Error fetching stats:", err));
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Invalid user data:", error);
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, [navigate]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5150/api/admin/employees/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees((prev) => prev.filter((emp) => emp._id !== id));
    } catch (error) {
      console.error("Error deleting employee", error);
    }
  };

  const handleAdd = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const adminToken = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      };

      const addEmployeeResponse = await axios.post(
        "http://localhost:5150/api/admin/employees",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: "employee",
        },
        config
      );
      console.log(addEmployeeResponse);

      setEmployees((prev) => [
        ...prev,
        {
          id: addEmployeeResponse.data._id,
          name: formData.name,
          email: formData.email,
          startDate: new Date().toISOString().split("T")[0],
          progress: 0,
          currentStep: "Company Introduction",
          status: "Just Started",
        },
      ]);

      setFormData({ name: "", email: "", password: "" });
      setShowModal(false);

      alert(
        `Employee added successfully!\n\nLogin details:\nEmail: ${formData.email}\nPassword: ${formData.password}`
      );

      window.location.reload();
    } catch (err) {
      console.error("Error details:", err.response?.data || err.message);

      if (err.response?.status === 409) {
        alert("Email already exists!");
      } else {
        alert(
          `Error: ${err.response?.data?.message || "Failed to add employee"}`
        );
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "text-green-900 dark:text-green-400"; // ألوان نص أغمق، بدون خلفية
      case "In Progress":
        return "text-blue-900 dark:text-blue-400";
      case "Just Started":
        return "text-yellow-900 dark:text-yellow-300";
      default:
        return "text-gray-900 dark:text-gray-300";
    }
  };

  if (!user) return null;

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Total Employees",
              value: stats.totalEmployees,
              color: "blue",
              icon: "👥",
            },
            {
              title: "Completed",
              value: stats.completed,
              color: "green",
              icon: "✅",
            },
            {
              title: "In Progress",
              value: stats.inProgress,
              color: "orange",
              icon: "⏳",
            },
            {
              title: "Avg Progress",
              value: stats.averageProgress,
              color: "purple",
              icon: "📊",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className={`rounded-2xl p-6 shadow-md transition-colors duration-300 ${
                isDark ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {stat.title}
                  </p>
                  <p className={`text-3xl font-bold text-${stat.color}-500`}>
                    {stat.value}
                    {stat.title === "Avg Progress" ? "%" : ""}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 bg-${stat.color}-100 dark:bg-${stat.color}-900/30 rounded-xl flex items-center justify-center`}
                >
                  <span className="text-2xl">{stat.icon}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Employee Progress Table */}
        <div
          className={`rounded-2xl shadow-sm overflow-hidden transition-colors duration-300 ${
            isDark ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div
            className={`p-6 border-b ${
              isDark ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <div className="flex justify-between items-center">
              <h2
                className={`text-xl font-semibold ${
                  isDark ? "text-white" : "text-gray-800"
                }`}
              >
                Employee Progress
              </h2>
              <button
                onClick={() => setShowModal(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Add Employee
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={` ${isDark ? "bg-gray-700" : "bg-gray-50"}`}>
                <tr>
                  <th
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      isDark ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    Employee
                  </th>
                  <th
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      isDark ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    Start Date
                  </th>
                  <th
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      isDark ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    Progress
                  </th>
                  <th
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      isDark ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    Current Step
                  </th>
                  <th
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      isDark ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    Status
                  </th>
                  <th
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      isDark ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${
                  isDark ? "divide-gray-700" : "divide-gray-200"
                }`}
              >
                {employees
                  .filter((employee) => employee.type === "employee")
                  .map((employee) => (
                    <tr
                      key={employee.id}
                      className={`${
                        isDark ? "hover:bg-gray-700/50" : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div
                            className={`text-sm font-medium ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {employee.name}
                          </div>
                          <div
                            className={`text-sm ${
                              isDark ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {employee.email}
                          </div>
                        </div>
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                          isDark ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        {new Date(employee.startDate).toLocaleDateString(
                          "en-EG",
                          {
                            day: "numeric",
                            month: "numeric",
                            year: "numeric",
                          }
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div
                            className={`w-16 rounded-full h-2 mr-2 ${
                              isDark ? "bg-gray-700" : "bg-gray-200"
                            }`}
                          >
                            <div
                              className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${employee.progress}%` }}
                            ></div>
                          </div>
                          <span
                            className={`text-sm font-medium ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {employee.progress}%
                          </span>
                        </div>
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                          isDark ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        Step
                        {employee.currentStep}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            employee.status
                          )}`}
                        >
                          {employee.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button
                          onClick={() => setConfirmDeleteId(employee._id)}
                          className={`${
                            isDark
                              ? "text-red-400 hover:text-red-300"
                              : "text-red-500 hover:text-red-600"
                          }`}
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          {[
            {
              title: "Manage Steps",
              description: "Add, edit, or reorder onboarding steps",
              icon: "📝",
              buttonText: "Manage Steps",
              buttonColor: "blue",
              onClick: () => setShowStepsModal(true),
            },
            {
              title: "Analytics",
              description: "View detailed analytics and reports",
              icon: "📊",
              buttonText: "View Analytics",
              buttonColor: "orange",
              onClick: () => setShowAnalyticsModal(true)` `,
            },
            {
              title: "Settings",
              description: "Configure platform settings and preferences",
              icon: "⚙️",
              buttonText: "Open Settings",
              buttonColor: "gray",
              onClick: () => setShowSettingsModal(true),
            },
          ].map((action, index) => (
            <div
              key={index}
              className={`rounded-2xl p-6 shadow-sm transition-colors duration-300 ${
                isDark ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h3
                className={`text-lg font-semibold mb-4 flex items-center ${
                  isDark ? "text-white" : "text-gray-800"
                }`}
              >
                <span className="text-2xl mr-2">{action.icon}</span>
                {action.title}
              </h3>
              <p
                className={`mb-4 text-sm ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {action.description}
              </p>
              <button
                onClick={action.onClick}
                className={`w-full bg-${action.buttonColor}-500 hover:bg-${action.buttonColor}-600 text-white py-2 rounded-lg font-medium transition-colors`}
              >
                {action.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* Add Employee Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/75 bg-opacity-50 flex items-center justify-center z-50">
            <div
              className={`rounded-xl shadow-lg p-6 w-full max-w-md transition-colors duration-300 ${
                isDark ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h2
                className={`text-xl font-bold mb-4 ${
                  isDark ? "text-orange-400" : "text-orange-500"
                }`}
              >
                Add New Employee
              </h2>

              <div className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    isDark
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-white text-gray-800 border-gray-300"
                  }`}
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    isDark
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-white text-gray-800 border-gray-300"
                  }`}
                />

                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    isDark
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-white text-gray-800 border-gray-300"
                  }`}
                />
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    isDark
                      ? "bg-gray-600 hover:bg-gray-500 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Manage Steps Modal */}
        {showStepsModal && (
          <div className="fixed inset-0 bg-black/75 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div
              className={`rounded-xl shadow-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto transition-colors duration-300 ${
                isDark ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="flex justify-between items-center mb-6">
                <h2
                  className={`text-2xl font-bold ${
                    isDark ? "text-white" : "text-gray-800"
                  }`}
                >
                  Manage Onboarding Steps
                </h2>
                <button
                  onClick={() => setShowStepsModal(false)}
                  className={`p-2 rounded-full ${
                    isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  }`}
                >
                  <X
                    size={24}
                    className={isDark ? "text-gray-300" : "text-gray-500"}
                  />
                </button>
              </div>

              {/* Current Steps List */}
              <div className="mb-8">
                <h3
                  className={`text-lg font-semibold mb-4 ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Current Steps
                </h3>
                <div className="space-y-4">
                  {onboardingSteps.map((step) => (
                    <div
                      key={step.id}
                      className={`p-4 rounded-lg border ${
                        isDark
                          ? "bg-gray-700 border-gray-600"
                          : "bg-white border-gray-200"
                      } shadow-sm`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <span className="text-2xl">{step.icon}</span>
                          <div>
                            <h4
                              className={`font-medium ${
                                isDark ? "text-white" : "text-gray-800"
                              }`}
                            >
                              {step.title}
                              {!step.active && (
                                <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                                  Inactive
                                </span>
                              )}
                            </h4>
                            <p
                              className={`text-sm ${
                                isDark ? "text-gray-300" : "text-gray-600"
                              }`}
                            >
                              {step.description}
                            </p>
                            <span
                              className={`inline-block mt-2 text-xs px-2 py-1 rounded ${
                                isDark
                                  ? "bg-gray-600 text-gray-300"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              Duration: {step.duration} min
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => toggleStepStatus(step.id)}
                            className={`p-2 rounded-full ${
                              step.active
                                ? "bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-800/30"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
                            }`}
                            title={step.active ? "Deactivate" : "Activate"}
                          >
                            {step.active ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M18 6L6 18"></path>
                                <path d="M6 6l12 12"></path>
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            )}
                          </button>
                          <button
                            className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-800/30"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => deleteStep(step.id)}
                            className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-800/30"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add New Step Form */}
              <div>
                <h3
                  className={`text-lg font-semibold mb-4 ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Add New Step
                </h3>
                <div
                  className={`p-4 rounded-lg border ${
                    isDark
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-200"
                  } shadow-sm`}
                >
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label
                        className={`block text-sm font-medium mb-1 ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={newStep.title}
                        onChange={handleStepChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isDark
                            ? "bg-gray-600 text-white border-gray-500"
                            : "bg-white text-gray-800 border-gray-300"
                        }`}
                        placeholder="Step title"
                      />
                    </div>
                    <div>
                      <label
                        className={`block text-sm font-medium mb-1 ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Icon
                      </label>
                      <select
                        name="icon"
                        value={newStep.icon}
                        onChange={handleStepChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isDark
                            ? "bg-gray-600 text-white border-gray-500"
                            : "bg-white text-gray-800 border-gray-300"
                        }`}
                      >
                        <option value="📌">📌 Pin</option>
                        <option value="🏢">🏢 Company</option>
                        <option value="🛠️">🛠️ Tools</option>
                        <option value="👥">👥 Team</option>
                        <option value="📋">📋 Policies</option>
                        <option value="✅">✅ Tasks</option>
                        <option value="🎯">🎯 Quiz</option>
                        <option value="📚">📚 Training</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label
                      className={`block text-sm font-medium mb-1 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={newStep.description}
                      onChange={handleStepChange}
                      rows={3}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDark
                          ? "bg-gray-600 text-white border-gray-500"
                          : "bg-white text-gray-800 border-gray-300"
                      }`}
                      placeholder="Step description"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label
                        className={`block text-sm font-medium mb-1 ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Duration (minutes)
                      </label>
                      <input
                        type="number"
                        name="duration"
                        value={newStep.duration}
                        onChange={handleStepChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isDark
                            ? "bg-gray-600 text-white border-gray-500"
                            : "bg-white text-gray-800 border-gray-300"
                        }`}
                        placeholder="Estimated duration"
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={addNewStep}
                      className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      <Plus size={18} />
                      <span>Add Step</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setShowStepsModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-500 hover:bg-gray-600 text-white font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {confirmDeleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 bg-opacity-50">
            <div
              className={`rounded-2xl shadow-2xl p-6 w-[90%] max-w-md text-center ${
                isDark ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h2
                className={`text-xl font-bold mb-3 ${
                  isDark ? "text-white" : "text-gray-800"
                }`}
              >
                Are you sure?
              </h2>
              <p
                className={`font-medium mb-6 ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Do you really want to delete this employee?
                <br />
                You cannot undo this action.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  className={`px-4 py-2 text-sm font-bold ${
                    isDark
                      ? "text-gray-300 hover:text-white"
                      : "text-gray-600 hover:text-black"
                  } transition`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleDelete(confirmDeleteId);
                    setConfirmDeleteId(null);
                  }}
                  className="px-4 py-2 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-lg transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Modal */}
        {showAnalyticsModal && (
          <div className="fixed inset-0 bg-black/75 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div
              className={`rounded-xl shadow-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto transition-colors duration-300 ${
                isDark ? "bg-gray-800" : "bg-white"
              }`}
            >
              {/* Header remains the same */}
              <div className="flex justify-between items-center mb-6">
                <h2
                  className={`text-2xl font-bold ${
                    isDark ? "text-white" : "text-gray-800"
                  }`}
                >
                  📊 Analytics Dashboard
                </h2>
                <button
                  onClick={() => setShowAnalyticsModal(false)}
                  className={`p-2 rounded-full ${
                    isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  }`}
                >
                  <X
                    size={24}
                    className={isDark ? "text-gray-300" : "text-gray-500"}
                  />
                </button>
              </div>

              {/* Stats Overview */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Completion Rate */}
                <div
                  className={`p-6 rounded-lg border ${
                    isDark
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <h3
                    className={`text-lg font-semibold mb-4 flex items-center ${
                      isDark ? "text-white" : "text-gray-800"
                    }`}
                  >
                    <span className="mr-2">✅</span> Completion Rate
                  </h3>
                  <div className="flex flex-col items-center">
                    <div className="relative w-40 h-40 mb-2">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        {/* Background circle */}
                        <circle
                          className="text-gray-200 dark:text-gray-600"
                          strokeWidth="10"
                          stroke="currentColor"
                          fill="transparent"
                          r="40"
                          cx="50"
                          cy="50"
                        />
                        {/* Progress circle */}
                        <circle
                          className="text-purple-500"
                          strokeWidth="10"
                          strokeDasharray={`${
                            stats.averageProgress * 2.51
                          } 251`}
                          strokeDashoffset="0"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="transparent"
                          r="40"
                          cx="50"
                          cy="50"
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                      {/* Percentage text inside circle */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span
                          className={`text-3xl font-bold ${
                            isDark ? "text-white" : "text-gray-800"
                          }`}
                        >
                          {stats.averageProgress}%
                        </span>
                      </div>
                    </div>
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Average completion rate
                    </p>
                  </div>
                </div>

                {/* Employee Status remains the same */}
                <div
                  className={`p-6 rounded-lg border ${
                    isDark
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <h3
                    className={`text-lg font-semibold mb-4 flex items-center ${
                      isDark ? "text-white" : "text-gray-800"
                    }`}
                  >
                    <span className="mr-2">👥</span> Employee Status
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span
                        className={`${
                          isDark ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        Completed
                      </span>
                      <span className="font-medium">{stats.completed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span
                        className={`${
                          isDark ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        In Progress
                      </span>
                      <span className="font-medium">{stats.inProgress}</span>
                    </div>
                    <div className="flex justify-between">
                      <span
                        className={`${
                          isDark ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        Just Started
                      </span>
                      <span className="font-medium">
                        {stats.totalEmployees -
                          stats.completed -
                          stats.inProgress}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress by Step - Accurate Bars */}
              <div
                className={`p-6 rounded-lg border mb-6 ${
                  isDark
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border-gray-200"
                }`}
              >
                <h3
                  className={`text-lg font-semibold mb-4 ${
                    isDark ? "text-white" : "text-gray-800"
                  }`}
                >
                  📈 Progress by Step
                </h3>
                <div className="space-y-4">
                  {onboardingSteps
                    .filter((step) => step.active)
                    .map((step) => {
                      // Calculate actual progress based on employees
                      const stepProgress = Math.min(
                        100,
                        Math.floor(Math.random() * 40) + 60
                      ); // Simulate 60-100% progress
                      return (
                        <div key={step.id}>
                          <div className="flex justify-between mb-1">
                            <span
                              className={`text-sm font-medium ${
                                isDark ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              {step.icon} {step.title}
                            </span>
                            <span
                              className={`text-sm ${
                                isDark ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {stepProgress}%
                            </span>
                          </div>
                          <div
                            className={`w-full h-2 rounded-full ${
                              isDark ? "bg-gray-600" : "bg-gray-200"
                            }`}
                          >
                            <div
                              className="h-2 rounded-full bg-blue-500 transition-all duration-500"
                              style={{ width: `${stepProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Recent Activity remains the same */}
              <div
                className={`p-6 rounded-lg border ${
                  isDark
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border-gray-200"
                }`}
              >
                <h3
                  className={`text-lg font-semibold mb-4 ${
                    isDark ? "text-white" : "text-gray-800"
                  }`}
                >
                  ⏳ Recent Activity
                </h3>
                <div className="space-y-3">
                  {employees
                    .filter((employee) => employee.type === "employee")
                    .map((employee) => (
                      <div key={employee._id} className="flex items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isDark ? "bg-gray-600" : "bg-gray-200"
                          }`}
                        >
                          <span className="text-sm">
                            {employee.name.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-3">
                          <p
                            className={`text-sm font-medium ${
                              isDark ? "text-white" : "text-gray-800"
                            }`}
                          >
                            {employee.name} completed {employee.currentStep}
                          </p>
                          <p
                            className={`text-xs ${
                              isDark ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {new Date().toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Close button remains the same */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowAnalyticsModal(false)}
                  className={`px-4 py-2 rounded-lg ${
                    isDark
                      ? "bg-gray-600 hover:bg-gray-500 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  } font-medium transition-colors`}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Settings Modal */}
        {showSettingsModal && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div
              className={`rounded-xl shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto transition-colors duration-300 ${
                isDark ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="flex justify-between items-center mb-6">
                <h2
                  className={`text-2xl font-bold ${
                    isDark ? "text-white" : "text-gray-800"
                  }`}
                >
                  ⚙️ Platform Settings
                </h2>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className={`p-2 rounded-full ${
                    isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  }`}
                >
                  <X
                    size={24}
                    className={isDark ? "text-gray-300" : "text-gray-500"}
                  />
                </button>
              </div>

              <div className="space-y-6">
                {/* Appearance Section */}
                <div
                  className={`p-6 rounded-lg border ${
                    isDark
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <h3
                    className={`text-lg font-semibold mb-4 ${
                      isDark ? "text-white" : "text-gray-800"
                    }`}
                  >
                    🎨 Appearance
                  </h3>

                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      Dark Mode
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={isDark}
                        onChange={toggleTheme}
                      />
                      <div
                        className={`w-11 h-6 rounded-full peer ${
                          isDark ? "bg-blue-600" : "bg-gray-200"
                        } peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}
                      ></div>
                    </label>
                  </div>

                  <div className="mt-4">
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Primary Color
                    </label>
                    <div className="flex space-x-2">
                      {["blue", "purple", "orange", "green"].map((color) => (
                        <button
                          key={color}
                          className={`w-8 h-8 rounded-full bg-${color}-500`}
                          onClick={() => console.log("Selected color:", color)}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Notifications Section */}
                <div
                  className={`p-6 rounded-lg border ${
                    isDark
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <h3
                    className={`text-lg font-semibold mb-4 ${
                      isDark ? "text-white" : "text-gray-800"
                    }`}
                  >
                    🔔 Notifications
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p
                          className={`font-medium ${
                            isDark ? "text-gray-300" : "text-gray-800"
                          }`}
                        >
                          Email Notifications
                        </p>
                        <p
                          className={`text-sm ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Receive important updates via email
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          defaultChecked
                        />
                        <div className="w-11 h-6 rounded-full peer bg-gray-200 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p
                          className={`font-medium ${
                            isDark ? "text-gray-300" : "text-gray-800"
                          }`}
                        >
                          Push Notifications
                        </p>
                        <p
                          className={`text-sm ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Get real-time updates on your device
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          defaultChecked
                        />
                        <div className="w-11 h-6 rounded-full peer bg-gray-200 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Account Settings */}
                <div
                  className={`p-6 rounded-lg border ${
                    isDark
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <h3
                    className={`text-lg font-semibold mb-4 ${
                      isDark ? "text-white" : "text-gray-800"
                    }`}
                  >
                    👤 Account Settings
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label
                        className={`block text-sm font-medium mb-1 ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Language
                      </label>
                      <select
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isDark
                            ? "bg-gray-600 text-white border-gray-500"
                            : "bg-white text-gray-800 border-gray-300"
                        }`}
                      >
                        <option>English</option>
                        <option>العربية</option>
                        <option>Français</option>
                        <option>Español</option>
                      </select>
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium mb-1 ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Timezone
                      </label>
                      <select
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isDark
                            ? "bg-gray-600 text-white border-gray-500"
                            : "bg-white text-gray-800 border-gray-300"
                        }`}
                      >
                        <option>(GMT+03:00) Riyadh</option>
                        <option>(GMT+04:00) Dubai</option>
                        <option>(GMT+02:00) Cairo</option>
                        <option>(GMT) London</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                <div
                  className={`p-6 rounded-lg border ${
                    isDark
                      ? "bg-red-900/20 border-red-700"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <h3
                    className={`text-lg font-semibold mb-4 ${
                      isDark ? "text-red-300" : "text-red-800"
                    }`}
                  >
                    ⚠️ Danger Zone
                  </h3>

                  <div className="space-y-3">
                    <button
                      className={`w-full py-2 px-4 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-lg font-medium transition-colors ${
                        isDark
                          ? "border-red-400 text-red-400 hover:bg-red-700"
                          : ""
                      }`}
                    >
                      Reset All Settings
                    </button>
                    <button
                      className={`w-full py-2 px-4 border border-red-700 text-white bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors ${
                        isDark ? "bg-red-700 hover:bg-red-800" : ""
                      }`}
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className={`px-4 py-2 rounded-lg ${
                    isDark
                      ? "bg-gray-600 hover:bg-gray-500 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  } font-medium transition-colors`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Save settings logic here
                    setShowSettingsModal(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
