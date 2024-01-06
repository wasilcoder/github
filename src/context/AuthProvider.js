// AuthContext.js
import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState();

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          setAuthUser(user);
        } else {
          setAuthUser(null);
        }
      } catch (error) {
        console.log(error);
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ authUser }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
