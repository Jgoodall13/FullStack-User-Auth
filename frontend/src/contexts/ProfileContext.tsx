import React, { createContext, useContext, useState, ReactNode } from "react";

type ProfileContextType = {
  editHobbies: (newHobbies: string[]) => Promise<void>;
  hobbies: string[];
  fetchProfile: () => Promise<void>;
  profile: any[];
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [hobbies, setHobbies] = useState<string[]>([]); // Initial hobbies
  const [profile, setProfile] = useState<any[]>([]); // Initial profile
  let accessToken = localStorage.getItem("accessToken");

  const isTokenExpired = (token: string): boolean => {
    const payload = JSON.parse(atob(token.split(".")[1])); // Decode the payload
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    return payload.exp < now;
  };

  const fetchProfile = async () => {
    try {
      const accessToken = localStorage.getItem("authToken");

      if (!accessToken || isTokenExpired(accessToken)) {
        console.error("Access token is missing or expired");
        localStorage.removeItem("authToken");
        window.location.href = "/login"; // Redirect to login
        return;
      }

      const response = await fetch("http://localhost:3000/api/v1/users/info", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to fetch profile from server");
      }

      const data = await response.json();
      console.log("Profile fetched:", data);
      setProfile(data);
      setHobbies(data.hobbies);
    } catch (err: any) {
      console.error("Failed to fetch profile:", err.message);
      throw err;
    }
  };

  const editHobbies = async (hobbies: string[]) => {
    console.log("Editing hobbies to:", hobbies);
    const accessToken = localStorage.getItem("authToken");

    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/users/hobbies",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ hobbies }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to edit hobbies");
      }

      const data = await response.json();
      console.log("Hobbies edited:", data);

      console.log("Hobbies edited successfully");
    } catch (err: any) {
      console.error("Failed to edit hobbies:", err.message);
      throw err;
    }
  };

  return (
    <ProfileContext.Provider
      value={{ editHobbies, hobbies, fetchProfile, profile }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};
