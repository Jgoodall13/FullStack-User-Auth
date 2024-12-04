import React from "react";
import { ProfileProvider } from "./ProfileContext";
import { UserProvider } from "./UserContext";
import { FriendProvider } from "./FriendContext";

const AppProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <UserProvider>
      <FriendProvider>
        <ProfileProvider> {children}</ProfileProvider>
      </FriendProvider>
    </UserProvider>
  );
};

export default AppProviders;
