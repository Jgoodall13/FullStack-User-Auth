import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type User = {
  name: string;
  email: string;
  about: string;
  hobbies: string[];
};

export default function UserInfo() {
  const authToken = localStorage.getItem("authToken");
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User[] | null>(null);

  const fetchUser = async () => {
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
  }, [authToken]); // Explicit dependency for clarity

  if (loading) {
    return <p className="text-blue-500">Loading user information...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!user) {
    return <p className="text-gray-500">User data is unavailable.</p>;
  }

  return (
    <section className="mb-6">
      <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
      <p className="text-gray-600">{user.email}</p>
      <p className="mt-2 text-gray-700">{user.about}</p>
      <h2 className="mt-4 text-lg font-semibold text-gray-800">Hobbies</h2>
      <ul className="list-disc list-inside text-gray-700">
        {user.hobbies.length > 0 ? (
          user.hobbies.map((hobby) => <li key={hobby}>{hobby}</li>)
        ) : (
          <li>No hobbies listed</li>
        )}
      </ul>
    </section>
  );
}
