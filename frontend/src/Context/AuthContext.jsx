import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userdata, setUserdata] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserData = localStorage.getItem("userdata");

    if (storedToken && storedUserData) {
      setToken(storedToken);
      setUserdata(JSON.parse(storedUserData));
    }
    setLoading(false);
  }, []);

  const login = (token, userData) => {
    setToken(token);
    setUserdata(userData);
    localStorage.setItem("token", token);
    localStorage.setItem("userdata", JSON.stringify(userData));
    console.log("User logged in:", userData); // Debugging
  };

  const logout = () => {
    setToken(null);
    setUserdata(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userdata");
  };

  return (
    <AuthContext.Provider value={{ token, userdata, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
