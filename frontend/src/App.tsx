import { BrowserRouter } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import Layout from "./components/Layout";
import AppProviders from "./contexts/AppProvider";
import "./App.css";

const App = () => {
  const { isAuthenticated } = useAuth();
  console.log("Rendering App with isAuthenticated:", isAuthenticated);

  return (
    <BrowserRouter>
      <AppProviders>
        <Layout>
          <AppRoutes isAuthenticated={isAuthenticated} />
        </Layout>
      </AppProviders>
    </BrowserRouter>
  );
};

export default App;
