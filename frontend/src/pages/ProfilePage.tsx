import { useState, useEffect } from "react";

type Pending = {
  name: string;
  _id: string;
};
type FriendsList = {
  name: string;
  _id: string;
};

const ProfilePage = () => {
  const [pendingRequests, setPendingRequests] = useState<Pending[]>([]);

  const [user, setUser] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    about: "A tech enthusiast who loves coding and photography.",
    hobbies: ["Coding", "Photography", "Traveling"],
  });

  const [friends, setFriends] = useState<FriendsList[]>([]);

  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/v1/friends/requests",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`, // Add Authorization header
            },
          }
        );
        const friendsResponse = await fetch(
          "http://localhost:3000/api/v1/friends",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        const friendsData = await friendsResponse.json();

        if (!response.ok || !friendsResponse.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        setPendingRequests(data.pendingRequests);
        setFriends(friendsData.friends);
      } catch (err: any) {
        console.error("Failed to fetch user data:", err.message);
      }
    };
    fetchPending();
  }, []);

  const handleConfirmRequest = (id: string) => {
    // Logic to confirm request
    // {
    //   "requesterId": "674a5a577a2cdc5e3ab888c3",
    //   "action": "confirm"
    // }
    const confirmedFriend = pendingRequests.find(
      (request) => request._id === id
    );
    console.log("confirmed Friend", confirmedFriend);
    if (confirmedFriend) {
      setFriends([...friends, confirmedFriend]);
      setPendingRequests(
        pendingRequests.filter((request) => request._id !== id)
      );
      async function confirmFriend() {
        let response = await fetch(
          "http://localhost:3000/api/v1/friends/respond",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({
              requesterId: id,
              action: "confirm",
            }),
          }
        );
        let data = await response.json();
        console.log(data);
      }
      confirmFriend();
    }
  };

  const handleIgnoreRequest = (id: string) => {
    // Logic to ignore request
    setPendingRequests(pendingRequests.filter((request) => request._id !== id));
    async function denyFriend() {
      let response = await fetch(
        "http://localhost:3000/api/v1/friends/respond",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            requesterId: id,
            action: "ignore",
          }),
        }
      );
      let data = await response.json();
      console.log(data);
    }
    denyFriend();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        {/* User Info */}
        <section className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
          <p className="text-gray-600">{user.email}</p>
          <p className="mt-2 text-gray-700">{user.about}</p>
          <h2 className="mt-4 text-lg font-semibold text-gray-800">Hobbies</h2>
          <ul className="list-disc list-inside text-gray-700">
            {user.hobbies.map((hobby, index) => (
              <li key={index}>{hobby}</li>
            ))}
          </ul>
        </section>

        {/* Pending Friend Requests */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Pending Friend Requests
          </h2>
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
                      onClick={() => handleConfirmRequest(request._id)}
                      className="px-3 py-1 bg-green-500 text-white rounded-md mr-2 hover:bg-green-600"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => handleIgnoreRequest(request._id)}
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

        {/* Friends List */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800">Friends</h2>
          {friends.length > 0 ? (
            <ul className="mt-2 grid grid-cols-2 gap-4">
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
            <p className="text-gray-600 mt-2">You have no friends yet.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;
