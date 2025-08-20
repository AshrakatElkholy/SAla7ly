import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ToastAndroid, Platform, Alert } from "react-native";

const API_BASE = "https://f27ad2cde96b.ngrok-free.app"; // Replace with your ngrok URL

// Create context with default values
export const UserContext = createContext({
  userInfo: null,
  setUserInfo: () => {},
  token: null,
  setToken: () => {},
  userId: null,
  setUserId: () => {},
  userRole: null,
  setUserRole: () => {},
  getUserId: () => {},
  getUserRole: () => {},
  getUserInfo: () => {},
  refreshToken: () => {},
  logout: () => {},
});

export default function UserContextProvider({ children }) {
  const [userInfo, setUserInfo] = useState(null);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);

  // Helper function to show toast/alert
  const showMessage = (message) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.LONG);
    } else {
      Alert.alert('تنبيه', message);
    }
  };

  // Helper function to decode JWT safely
  const decodeJWT = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  };

  // ======= Helper functions =======
  const getUserId = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("access_token");
      if (storedToken) {
        const decoded = decodeJWT(storedToken);
        return decoded?.id || decoded?.sub || null;
      }
      return null;
    } catch (error) {
      console.error('Error getting user ID:', error);
      return null;
    }
  };

  const getUserRole = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("access_token");
      if (storedToken) {
        const decoded = decodeJWT(storedToken);
        return decoded?.role || null;
      }
      return null;
    } catch (error) {
      console.error('Error getting user role:', error);
      return null;
    }
  };

  // ======= Get user profile =======
  const getUserInfo = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("access_token");
      if (!storedToken) {
        console.log('No token found');
        return null;
      }

      const res = await axios.get(`${API_BASE}/user/getMyProfile`, {
        headers: { 
          Authorization: `Bearer ${storedToken}`,
          "ngrok-skip-browser-warning": "true"
        },
      });

      if (res.data) {
        setUserInfo(res.data);
        await AsyncStorage.setItem("userInfo", JSON.stringify(res.data));
        return res.data;
      }
    } catch (err) {
      console.log("Error fetching user info:", err?.response?.data?.message || err.message);
      
      if (err?.response?.data?.message === "jwt expired" || 
          err?.response?.status === 401) {
        console.log('Token expired, trying to refresh...');
        const newToken = await refreshToken();
        if (newToken) {
          // Retry getting user info with new token
          return await getUserInfo();
        }
      } else if (err?.response?.data?.message) {
        showMessage(err.response.data.message);
      } else {
        showMessage("خطأ في الاتصال");
      }
    }
    return null;
  };

  // ======= Refresh token =======
  const refreshToken = async () => {
    try {
      const refresh_token = await AsyncStorage.getItem("refresh_token");
      if (!refresh_token) {
        console.log('No refresh token found');
        return null;
      }

      const res = await axios.post(
        `${API_BASE}/auth/refreshToken`,
        {},
        {
          headers: { 
            Authorization: `bearer ${refresh_token}`,
            "ngrok-skip-browser-warning": "true"
          },
        }
      );

      if (res.data?.access_token) {
        await AsyncStorage.setItem("access_token", res.data.access_token);
        setToken(res.data.access_token);
        
        // Update user ID and role from new token
        const decoded = decodeJWT(res.data.access_token);
        if (decoded) {
          setUserId(decoded.id || decoded.sub);
          setUserRole(decoded.role);
        }
        
        return res.data.access_token;
      }
    } catch (err) {
      console.log("Error refreshing token:", err?.response?.data?.message || err.message);
      
      // If refresh fails, clear all stored data
      await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'userInfo']);
      setToken(null);
      setUserInfo(null);
      setUserId(null);
      setUserRole(null);
    }
    return null;
  };

  // ======= Logout function =======
  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'userInfo']);
      setToken(null);
      setUserInfo(null);
      setUserId(null);
      setUserRole(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // ======= Initial load =======
  useEffect(() => {
    const init = async () => {
      try {
        console.log('Initializing UserContext...');
        
        const storedToken = await AsyncStorage.getItem("access_token");
        const storedUser = await AsyncStorage.getItem("userInfo");
        
        // Set initial state
        setToken(storedToken || null);
        
        if (storedUser) {
          try {
            setUserInfo(JSON.parse(storedUser));
          } catch (parseError) {
            console.error('Error parsing stored user info:', parseError);
            await AsyncStorage.removeItem('userInfo');
          }
        }

        // Get user ID and role from token
        if (storedToken) {
          const id = await getUserId();
          const role = await getUserRole();
          setUserId(id);
          setUserRole(role);
          
          // Try to get fresh user info
          await getUserInfo();
        } else {
          // Try to refresh token if no access token but might have refresh token
          await refreshToken();
        }
        
        console.log('UserContext initialized successfully');
      } catch (error) {
        console.error('Error initializing UserContext:', error);
      }
    };

    init();
  }, []);

  const contextValue = {
    userInfo,
    setUserInfo,
    token,
    setToken,
    getUserId,
    userId,
    setUserId,
    getUserRole,
    userRole,
    setUserRole,
    getUserInfo,
    refreshToken,
    logout,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
}