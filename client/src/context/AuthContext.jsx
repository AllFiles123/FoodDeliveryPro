import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import profileService from "../services/profileService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (!token || !savedUser) {
        return null;
      }

      return JSON.parse(savedUser);
    } catch (error) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      return null;
    }
  });

  /*
   * ============================================================
   * REFRESH USER FROM BACKEND
   * ============================================================
   *
   * localStorage only gives us the last cached user.
   * On every app reload, fetch the latest profile from the
   * backend/PostgreSQL so changed name/phone stays updated.
   */
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    let cancelled = false;

    const refreshUser = async () => {
      try {
        const response = await profileService.getProfile();

        if (
          !cancelled &&
          response?.success &&
          response?.user
        ) {
          const freshUser = response.user;

          setUser(freshUser);

          localStorage.setItem(
            "user",
            JSON.stringify(freshUser)
          );
        }
      } catch (error) {
        console.error(
          "❌ Failed to refresh profile:",
          error?.response?.data?.message ||
          error?.message ||
          error
        );

        /*
         * Do not immediately logout here.
         * The cached user can still keep the current UI alive.
         */
      }
    };

    refreshUser();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = (userData, token) => {
    if (token) {
      localStorage.setItem(
        "token",
        token
      );
    }

    if (userData) {
      localStorage.setItem(
        "user",
        JSON.stringify(userData)
      );

      setUser(userData);
    }
  };

  const logout = () => {
    setUser(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("cart");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
