import { createContext, useContext, useState, ReactNode } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem("authToken"); // Check token existence
  });

  const login = async (email: string, password: string) => {
    try {
      console.log(JSON.stringify({ email, password }));
      const response = await fetch("http://localhost:3000/api/v1/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid email or password");
      }

      const data = await response.json();
      const token = data.accessToken;

      // Save token to localStorage and update state
      localStorage.setItem("authToken", token);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("mongoId", data.mongoId);

      setIsAuthenticated(true);
    } catch (err: any) {
      console.error("Login failed:", err.message);
      throw err; // Re-throw error to allow UI handling
    }
  };

  const logout = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const refreshToken = localStorage.getItem("refreshToken");

      // Remove tokens from local storage
      localStorage.removeItem("authToken");
      localStorage.removeItem("mongoId");
      localStorage.removeItem("refreshToken");

      // Update authentication state
      setIsAuthenticated(false);

      // Perform logout request
      if (authToken && refreshToken) {
        await fetch("http://localhost:3000/api/v1/users/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ refreshToken }),
        });
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
