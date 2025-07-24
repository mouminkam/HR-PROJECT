import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./Context/ThemeContext";
import { AuthProvider } from "./Context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Step from "./pages/Step";
import Admin from "./pages/Admin";
import Completion from "./pages/Completion";
import Header from "./components/Header";
import { Footer } from "./components/footer";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen transition-colors duration-300">
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/step/:stepId" element={<Step />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/completion" element={<Completion />} />
            </Routes>
            <Footer/>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
