import React, { createContext, useState, useContext, useEffect } from "react";
import useSWR from "swr";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { login as apiLogin, User } from "api";
import { useNotification } from "context";
import { Spinner } from "components";

export interface AuthProviderValue {
  login: (username: string, password: string) => void;
  loading: boolean;
  logout: () => void;
  isAuthenticated: boolean;
  user: User;
}

const AuthContext = createContext<AuthProviderValue>(undefined);

export function AuthProvider({ children }) {
  const { data: user } = useSWR<User>("/rest/user/me");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { show } = useNotification();
  const isAuthenticated = !!user;

  const login = async (username: string, password: string) => {
    try {
      setLoading(true);
      const { data } = await apiLogin(username, password);
      const { jwt, expires } = data;

      if (jwt) {
        Cookies.set("token", jwt, { expires });
        router.push("/");
      }

      setLoading(false);
    } catch (error) {
      show({
        type: "error",
        title: "Error",
        message: "Ha ocurrido un error al intentar iniciar sesion",
      });
      setLoading(false);
    }
  };

  const logout = () => {
    Cookies.remove("token");
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, loading, logout, user }}
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

export function ProtectRoute(Component) {
  return () => {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isAuthenticated && !loading) {
        router.replace("/login");
      }
    }, [loading, isAuthenticated]);

    if (loading) {
      return <Spinner />;
    }

    return <Component {...arguments} />;
  };
}
