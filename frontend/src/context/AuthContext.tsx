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

      setUserData(data.token, data.user);
    } catch (error: any) {
      console.log(error.response.data);
      alert(error.response.data.detail);
      return;
    }
  }

  function setUserData(token: string, user: User) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", user.username);

    setUser({
      username: user.username,
    });
  }

  async function logout() {
    try {
      await axiosInstance.get("logout");
    } catch (error) {
      console.error("Failed logging out from server");
    }
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  // checks if there is already a user object stored
  // and sets the authenticated user based on it
  useEffect(() => {
    (async () => {
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
