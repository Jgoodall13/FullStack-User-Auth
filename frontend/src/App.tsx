import { BrowserRouter } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  const { isAuthenticated } = useAuth();

  console.log("Rendering App with isAuthenticated:", isAuthenticated);

  return (
    <BrowserRouter>
      <AppRoutes isAuthenticated={isAuthenticated} />
    </BrowserRouter>
  );
};

export default App;
