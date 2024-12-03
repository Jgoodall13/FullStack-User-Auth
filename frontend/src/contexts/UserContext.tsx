import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";

type User = {
  name: string;
  email: string;
  about: string;
  hobbies: string[];
};

type UserContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchUser = async () => {
    setLoading(true);
    setError(null);
    const authToken = localStorage.getItem("authToken");

    try {
      if (!authToken) {
        throw new Error("Authorization token is missing");
      }

      const response = await fetch("http://localhost:3000/api/v1/users/info", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate("/login");
        }
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setUser({
        name: data.name,
        email: data.email,
        about: data.about || "No information provided",
        hobbies: data.hobbies || [],
      });
    } catch (err: any) {
      console.error("Failed to fetch user:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []); // Fetch user on mount

  return (
    <UserContext.Provider value={{ user, loading, error, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
