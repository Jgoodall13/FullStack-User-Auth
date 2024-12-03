import { BrowserRouter } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import Layout from "./components/Layout";
import { FriendProvider } from "./contexts/FriendContext";
import { ProfileProvider } from "./contexts/ProfileContext";
import { UserProvider } from "./contexts/UserContext";
import "./App.css";

const App = () => {
  const { isAuthenticated } = useAuth();
  console.log("Rendering App with isAuthenticated:", isAuthenticated);

  return (
    <BrowserRouter>
      <Layout>
        <UserProvider>
          <ProfileProvider>
            <FriendProvider>
              <AppRoutes isAuthenticated={isAuthenticated} />
            </FriendProvider>
          </ProfileProvider>
        </UserProvider>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
