import { useEffect, useState } from "react";
import { useFriend } from "../contexts/FriendContext";
import { useProfile } from "../contexts/ProfileContext";

export default function PendingFriends() {
  const { fetchPending, pendingRequests, handleFriendAction } = useFriend();
  const { profile, fetchProfile } = useProfile();

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFriends = async () => {
      try {
        await fetchPending();
      } catch (err: any) {
        setError("Failed to fetch friends");
      }
    };
    loadFriends();
    fetchProfile();
  }, []);

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
