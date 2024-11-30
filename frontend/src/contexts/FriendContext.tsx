import { createContext, useState, ReactNode, useCallback } from "react";

type FriendContextType = {
  fetchFriends: () => Promise<void>;
  friends: FriendsList[];
  pendingRequests: Pending[];
  fetchPending: () => Promise<void>;
  handleFriendAction: (
    id: string,
    action: "confirm" | "ignore"
  ) => Promise<void>;
};

type Pending = {
  name: string;
  _id: string;
};

export type FriendsList = {
  name: string;
  _id: string;
};

const FriendContext = createContext<FriendContextType | undefined>(undefined);

export const FriendProvider = ({ children }: { children: ReactNode }) => {
  const [friends, setFriends] = useState<FriendsList[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Pending[]>([]);
  const authToken = localStorage.getItem("authToken");

  const fetchFriends = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:3000/api/v1/friends", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch friends");
      }

      const data = await response.json();
      setFriends(data.friends);
    } catch (err: any) {
      console.error("Fetch friends failed:", err.message);
      throw err;
    }
  }, []);

  const fetchPending = useCallback(async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/friends/requests",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setPendingRequests(data.pendingRequests);
    } catch (err: any) {
      console.error("Failed to fetch pending requests:", err.message);
      throw err;
    }
  }, []);

  const handleFriendAction = async (
    id: string,
    action: "confirm" | "ignore"
  ) => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/friends/respond",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            requesterId: id,
            action,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data);

      // Update UI based on action
      if (action === "confirm") {
        console.log("confirming with data:", data);
        setPendingRequests(pendingRequests.filter((req) => req._id !== id));
        setFriends([...friends, { name: data.name, _id: data._id }]);
      } else if (action === "ignore") {
        setPendingRequests(pendingRequests.filter((req) => req._id !== id));
      }
    } catch (err: any) {
      console.error(`Failed to ${action} request:`, err.message);
      throw err;
    }
  };

  return (
    <FriendContext.Provider
      value={{
        fetchFriends,
        fetchPending,
        friends,
        pendingRequests,
        handleFriendAction,
      }}
    >
      {children}
    </FriendContext.Provider>
  );
};

export { FriendContext };
