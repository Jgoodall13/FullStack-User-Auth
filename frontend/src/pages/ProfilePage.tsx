import { useState, useEffect } from "react";
import Friends from "../components/Friends";
import PendingFriends from "../components/PendingFriends";
import UserInfo from "../components/UserInfo";

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        {/* User Info */}
        <UserInfo />

        {/* Pending Friend Requests */}
        <PendingFriends />

        {/* Friends List */}
        <Friends />
      </div>
    </div>
  );
};

export default ProfilePage;
