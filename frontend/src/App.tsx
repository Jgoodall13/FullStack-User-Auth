import { BrowserRouter } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import Layout from "./components/Layout";
import { FriendProvider } from "./contexts/FriendContext";

const App = () => {
  const { isAuthenticated } = useAuth();
  console.log("Rendering App with isAuthenticated:", isAuthenticated);

  return (
    <BrowserRouter>
      <Layout>
        <FriendProvider>
          <AppRoutes isAuthenticated={isAuthenticated} />
        </FriendProvider>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
