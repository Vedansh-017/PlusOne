import axios from 'axios';
import React, { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  /** Fetch user data */
  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/data`, {
        withCredentials: true,
      });

      if (data.success) setUserData(data.userData);
      else toast.error(data.message || "Failed to fetch user data");
    } catch (error) {
      toast.error(error.message || "Failed to fetch user data");
    }
  };

  /** Register user */
  const registerUser = async ({ name, email, password }) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/register`, { name, email, password });
      return data;
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Server error" };
    }
  };

  /** Login user (no OTP) */
  const loginUser = async ({ email, password }) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/login`, { email, password });

      if (data.success) {
        setIsLoggedIn(true);
        setUserData(data.user);
      }

      return data;
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Server error" };
    }
  };

  /** Verify OTP */
  const verifyOtp = async ({ email, otp }) => {
    try {
      const res = await axios.post(`${backendUrl}/api/auth/verify-otp`, {
        email: email.trim().toLowerCase(),
        otp: otp.toString().trim(),
      });

      if (res.data.token && res.data.user) {
        setIsLoggedIn(true);
        setUserData(res.data.user);
      }

      return res.data;
    } catch (error) {
      console.error("Verify OTP error:", error.response?.data || error.message);
      return { success: false, message: error.response?.data?.message || "Server error" };
    }
  };

  /** Context value */
  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
    registerUser,
    loginUser,
    verifyOtp, // <-- Add this so components can call it
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
