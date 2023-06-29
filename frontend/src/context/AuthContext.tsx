import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { axiosInstance } from "../api";

interface ContextProps {
  user: User | null;
  isAuthenticated: boolean;
  authenticate: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

interface User {
  username: string;
}

interface AuthProviderProps {
  children?: ReactNode;
}

export const AuthContext = createContext<ContextProps>({} as ContextProps);

export function AuthProvider(props: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const isAuthenticated = !!user;

  /**
   *
   * @param username string
   * @param password string
   * @returns authentication context providing user authentication states and methods
   */
  async function authenticate(username: string, password: string) {
    try {
      const { data } = await axiosInstance.post("auth", {
        username,
        password,
      });

      setUserData(data.token, data.exp, data.user);
      window.location.href = window.location.href.replace("/login", "/");
    } catch (error: any) {
      alert(error.response?.data.detail);
      return;
    }
  }

  function setUserData(token: string, exp: string, user: User) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", user.username);
    localStorage.setItem("exp", exp);

    setUser({
      username: user.username,
    });
  }

  async function logout() {
    try {
      await axiosInstance.get("logout");
    } catch (error) {
      console.error("Ocorreu um erro no login");
      alert("Ocorreu um erro no login");
    }
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("exp");
  }

  // checks if there is already a user object stored
  // and sets the authenticated user based on it
  useEffect(() => {
    (async () => {
      const exp = localStorage.getItem("exp");

      if (exp) {
        const currentDate = new Date();
        const expiration = new Date(Number(exp) * 1000);

        if (currentDate > expiration) return logout();
      }

      const user = localStorage.getItem("user");
      if (!user) {
        return;
      }

      setUser({ username: user });
    })();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        authenticate,
        logout,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
