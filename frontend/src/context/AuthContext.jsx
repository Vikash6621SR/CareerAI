import { createContext, useContext, useEffect, useState } from "react";

import api from "../services/api";

import {
  loginUser,
  registerUser,
  logoutUser,
  getStoredUser,
  getToken,
} from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredUser());

  const [loading, setLoading] = useState(true);

  /*
   * Restore existing login session
   */
  useEffect(() => {
    const restoreSession = async () => {
      const token = getToken();

      /*
       * No token means user is not logged in.
       */
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        /*
         * Verify the JWT with the Spring Boot backend.
         */
        const response = await api.get("/users/me");

        const currentUser = response.data;

        /*
         * Store the latest user information.
         */
        localStorage.setItem("careerAI_user", JSON.stringify(currentUser));

        setUser(currentUser);
      } catch (error) {
        console.error("Unable to restore CareerAI session:", error);

        /*
         * Invalid/expired token.
         */
        localStorage.removeItem("careerAI_token");
        localStorage.removeItem("careerAI_user");

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();

    /*
     * Listen for JWT expiration event
     * from api.js.
     */
    const handleSessionExpired = () => {
      localStorage.removeItem("careerAI_token");
      localStorage.removeItem("careerAI_user");

      setUser(null);
    };

    window.addEventListener("careerAI:session-expired", handleSessionExpired);

    return () => {
      window.removeEventListener(
        "careerAI:session-expired",
        handleSessionExpired,
      );
    };
  }, []);

  /*
   * LOGIN
   */
  const login = async (credentials) => {
    const response = await loginUser(credentials);

    const loggedInUser =
      response?.user || response?.data?.user || getStoredUser();

    if (!loggedInUser) {
      throw new Error("Login succeeded but user information was not returned.");
    }

    setUser(loggedInUser);

    return response;
  };

  /*
   * REGISTER
   */
  const register = async (data) => {
    return await registerUser(data);
  };

  /*
   * LOGOUT
   */
  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      localStorage.removeItem("careerAI_token");
      localStorage.removeItem("careerAI_user");

      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/*
 * useAuth hook
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
};

export default AuthContext;
