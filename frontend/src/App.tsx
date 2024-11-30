import { BrowserRouter } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import Layout from "./components/Layout";

const App = () => {
  const { isAuthenticated } = useAuth();

  console.log("Rendering App with isAuthenticated:", isAuthenticated);

  return (
    <BrowserRouter>
      <Layout>
        <AppRoutes isAuthenticated={isAuthenticated} />
      </Layout>
    </BrowserRouter>
  );
};

export default App;
