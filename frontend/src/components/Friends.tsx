import { useState, useEffect } from "react";

type FriendsList = {
  name: string;
  _id: string;
};

export default function Friends() {
  const [friends, setFriends] = useState<FriendsList[]>([]);
  const [error, setError] = useState<string | null>(null);
  const authToken = localStorage.getItem("authToken");

  const fetchFriends = async () => {
    try {
      if (!authToken) {
        throw new Error("Authorization token is missing");
      }

      const response = await fetch("http://localhost:3000/api/v1/friends", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setFriends(data.friends);
    } catch (err: any) {
      console.error("Failed to fetch friends:", err.message);
      setError(err.message); // Set error to display on the UI
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <section>
          <h2 className="text-lg font-semibold text-gray-800">Friends</h2>

          {error && (
            <p className="text-red-500 mt-2">
              Failed to fetch friends: {error}
            </p>
          )}

          {friends.length > 0 ? (
            <ul className="mt-4 grid grid-cols-2 gap-4">
              {friends.map((friend) => (
                <li
                  key={friend._id}
                  className="p-2 border border-gray-300 rounded-md text-center bg-gray-50"
                >
                  {friend.name}
                </li>
              ))}
            </ul>
          ) : (
            !error && (
              <p className="text-gray-600 mt-2">You have no friends yet.</p>
            )
          )}
        </section>
      </div>
    </div>
  );
}
