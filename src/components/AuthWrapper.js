"use client";

import React, { useState, useEffect } from "react";
import LoginPage from "@/components/LoginPage";
import RCVoiceApp from "@/components/RCVoiceApp";

const AuthWrapper = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 檢查登入狀態
    const checkAuth = () => {
      const userData = localStorage.getItem("userData");
      setIsAuthenticated(!!userData);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLoginSuccess = (userData) => {
    localStorage.setItem("userData", JSON.stringify(userData));
    setIsAuthenticated(true);
  };

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated)
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;

  const handleLogout = () => {
    localStorage.removeItem("userData");
    setIsAuthenticated(false);
  };

  return <RCVoiceApp onLogout={handleLogout} />;
};

export default AuthWrapper;
