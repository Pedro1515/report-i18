import React, { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { apiInstance } from "utils/axios";

export interface AuthProviderValue {
  isAuthenticated: boolean;
  user: any;
  login: (username: string, password: string) => void;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthProviderValue>(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    async function loadUserFromCookies() {
      const token = Cookies.get("token");
      if (token) {
        console.log("Got a token in the cookies, let's see if it is valid");
        apiInstance.defaults.headers.Authorization = `Bearer ${token}`;
        const { data: user } = await apiInstance.get("users/me");
        if (user) setUser(user);
      }
      setLoading(false);
    }
    loadUserFromCookies();
  }, []);

  const login = async (username: string, password: string) => {
    const { data } = await apiInstance.post("auth/login", undefined, {
      auth: {
        username,
        password,
      },
    });

    const { token } = data;

    if (token) {
      console.log("Got token");
      Cookies.set("token", token, { expires: 60 });
      apiInstance.defaults.headers.Authorization = `Bearer ${token}`;
      const { data: user } = await apiInstance.get("users/me");
      setUser(user);
      console.log("Got user", user);
    }

    return data;
  };

  const logout = () => {
    Cookies.remove("token");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: !!user, user, login, loading, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }

  return context;
}
