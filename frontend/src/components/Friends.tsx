import { useEffect, useState } from "react";
import { useProfile } from "../contexts/ProfileContext";

export default function Friends() {
  const { profile, fetchProfile } = useProfile();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const friends = profile?.friends || [];

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
