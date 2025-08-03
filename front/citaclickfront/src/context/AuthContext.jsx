import { createContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null,
  });

  const [timeLeft, setTimeLeft] = useState(() => {
    const savedTime = localStorage.getItem("time_left");
    return savedTime ? parseInt(savedTime, 10) : 300;
  });

  const countdownIntervalRef = useRef(null);
  const lastActivityRef = useRef(Date.now());
  const logoutPendingRef = useRef(false);

  const api = axios.create({
    baseURL: "http://localhost:8000",
    headers: { "Content-Type": "application/json" },
  });

  const login = (userData) => {
    setAuth({ isAuthenticated: true, user: userData });
    localStorage.setItem("access_token", userData.access);
    localStorage.setItem("refresh_token", userData.refresh);
    localStorage.setItem("time_left", "300");
    setTimeLeft(300);
    navigate("/");
  };

  const logout = () => {
    setAuth({ isAuthenticated: false, user: null });
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("time_left");
    clearInterval(countdownIntervalRef.current);
    navigate("/login");
  };

  const refreshAccessToken = async () => {
    try {
      const refresh = localStorage.getItem("refresh_token");
      if (!refresh) {
        logoutPendingRef.current = true;
        return null;
      }

      const { data } = await api.post("/api/token/refresh/", { refresh });

      if (data.access) {
        localStorage.setItem("access_token", data.access);
        setAuth((prev) => ({
          ...prev,
          user: { ...prev.user, access: data.access },
        }));
        return data.access;
      } else {
        logoutPendingRef.current = true;
        return null;
      }
    } catch {
      logoutPendingRef.current = true;
      return null;
    }
  };

  const startCountdown = (initialSeconds) => {
    clearInterval(countdownIntervalRef.current);
    setTimeLeft(initialSeconds);

    countdownIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        localStorage.setItem("time_left", newTime);

        if (newTime <= 0) {
          clearInterval(countdownIntervalRef.current);
          logoutPendingRef.current = true;
          return 0;
        }

        if (newTime === 10) {
          const activityInLastFiveMinutes =
            Date.now() - lastActivityRef.current < 5 * 60 * 1000;

          if (activityInLastFiveMinutes) {
            refreshAccessToken().then((ok) => {
              if (ok) {
                startCountdown(300);
              }
            });
          }
        }

        return newTime;
      });
    }, 1000);
  };

  useEffect(() => {
    const updateActivity = () => {
      lastActivityRef.current = Date.now();
    };

    window.addEventListener("click", updateActivity);
    window.addEventListener("keydown", updateActivity);
    window.addEventListener("mousemove", updateActivity);
    window.addEventListener("touchstart", updateActivity);

    return () => {
      window.removeEventListener("click", updateActivity);
      window.removeEventListener("keydown", updateActivity);
      window.removeEventListener("mousemove", updateActivity);
      window.removeEventListener("touchstart", updateActivity);
    };
  }, []);

  useEffect(() => {
    const access = localStorage.getItem("access_token");
    const refresh = localStorage.getItem("refresh_token");
    const savedTime = parseInt(localStorage.getItem("time_left"), 10) || 300;

    if (access && refresh) {
      setAuth({
        isAuthenticated: true,
        user: { access, refresh },
      });
      setTimeLeft(savedTime);
    }
  }, []);

  useEffect(() => {
    if (auth.isAuthenticated) {
      const savedTime = parseInt(localStorage.getItem("time_left"), 10) || 300;
      startCountdown(savedTime);
    }
  }, [auth.isAuthenticated]);

  useEffect(() => {
    if (logoutPendingRef.current) {
      logoutPendingRef.current = false;
      setTimeout(() => {
        logout();
      }, 0);
    }
  });

  // Formatear tiempo en mm:ss
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout, refreshAccessToken }}>
      {children}

      {auth.isAuthenticated && (
        <div
          style={{
            position: "fixed",
            bottom: "10px",
            right: "10px",
            background: "rgba(0,0,0,0.7)",
            color: "white",
            padding: "5px 10px",
            borderRadius: "5px",
            fontSize: "12px",
            zIndex: 9999,
          }}
        >
          ⏳ Sesión: {formatTime(timeLeft)}
        </div>
      )}
    </AuthContext.Provider>
  );
};
