import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext({
  updateUserData: () => {},
  userData: null, // Start as null for unauthenticated users
  isAuthenticated: false,
  authenticate: (userData) => {},
  logout: () => {},
});

function AuthContentProvider({ children }) {
  const [userData, setUserData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Authenticate and save user data in AsyncStorage
  async function authenticate(userData) {
    try {
      if (!userData || !userData.userId) {
        throw new Error("Invalid user data. 'userId' is required.");
      }

      console.log("Authenticating user with data:", userData); // Debug
      setIsAuthenticated(true);
      setUserData(userData);
      await AsyncStorage.setItem("userData", JSON.stringify(userData)); // Persist user data
      console.log("User authenticated and data saved:", userData); // Debug
    } catch (error) {
      console.error("Error during authentication:", error.message);
    }
  }

  // Logout and clear user data
  async function logout() {
    try {
      setIsAuthenticated(false);
      setUserData(null);
      await AsyncStorage.removeItem("userData"); // Remove persisted user data
      console.log("User logged out");
    } catch (error) {
      console.error("Error clearing user data:", error.message);
    }
  }

  // Update user data locally and in AsyncStorage
  async function updateUserData(newData) {
    try {
      setUserData((prevData) => {
        if (!prevData) {
          console.warn("No previous user data to update."); // Debug
          return newData;
        }
        const updatedData = { ...prevData, ...newData };
        AsyncStorage.setItem("userData", JSON.stringify(updatedData)); // Persist updated data
        console.log("User data updated:", updatedData); // Debug
        return updatedData;
      });
    } catch (error) {
      console.error("Error updating user data:", error.message);
    }
  }

  // Load user data from AsyncStorage on app start
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem("userData");
        if (storedUserData) {
          const parsedUserData = JSON.parse(storedUserData);
          if (parsedUserData.userId) {
            setUserData(parsedUserData);
            setIsAuthenticated(true);
            console.log("Loaded user data from storage:", parsedUserData); // Debug
          } else {
            console.warn("Stored user data is missing 'userId'. Clearing storage."); // Debug
            await AsyncStorage.removeItem("userData");
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error.message);
      }
    };

    loadUserData();
  }, []);

  const value = {
    userData,
    isAuthenticated,
    authenticate,
    logout,
    updateUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContentProvider;
