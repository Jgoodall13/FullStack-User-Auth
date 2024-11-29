import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800">404</h1>
        <p className="mt-4 text-lg text-gray-600">
          Oops! The page you're looking for doesn't exist.
        </p>
        <button
          onClick={() =>
            isAuthenticated ? navigate("/dashboard") : navigate("/login")
          }
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
        >
          Go to Safety
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
