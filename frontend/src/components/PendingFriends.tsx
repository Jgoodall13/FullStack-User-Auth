import { useEffect, useState } from "react";

type Pending = {
  name: string;
  _id: string;
};

export default function PendingFriends() {
  const [pendingRequests, setPendingRequests] = useState<Pending[]>([]);
  const [error, setError] = useState<string | null>(null);
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchPending = async () => {
      if (!authToken) {
        setError("Authorization token is missing.");
        return;
      }

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
        setError(err.message);
        console.error("Failed to fetch pending requests:", err.message);
      }
    };

    fetchPending();
  }, [authToken]);

  const handleFriendAction = async (
    id: string,
    action: "confirm" | "ignore"
  ) => {
    if (!authToken) {
      setError("Authorization token is missing.");
      return;
    }

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
        setPendingRequests(pendingRequests.filter((req) => req._id !== id));
      } else if (action === "ignore") {
        setPendingRequests(pendingRequests.filter((req) => req._id !== id));
      }
    } catch (err: any) {
      setError(err.message);
      console.error(`Failed to ${action} request:`, err.message);
    }
  };

  return (
    <div>
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800">
          Pending Friend Requests
        </h2>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {pendingRequests.length > 0 ? (
          <ul className="mt-2 space-y-2">
            {pendingRequests.map((request) => (
              <li
                key={request._id}
                className="flex justify-between items-center p-2 border border-gray-300 rounded-md"
              >
                <span>{request.name}</span>
                <div>
                  <button
                    onClick={() => handleFriendAction(request._id, "confirm")}
                    className="px-3 py-1 bg-green-500 text-white rounded-md mr-2 hover:bg-green-600"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => handleFriendAction(request._id, "ignore")}
                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Ignore
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 mt-2">No pending friend requests.</p>
        )}
      </section>
    </div>
  );
}
