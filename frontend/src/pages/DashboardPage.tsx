import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

const DashboardPage = () => {
  const { logout } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-4xl font-semibold text-gray-800">
        Welcome to the Dashboard
      </h1>
      <p className="mt-2 text-lg text-gray-600">
        Manage your account and settings here.
      </p>
      <Link to="/profile" className="text-blue-600 hover:underline">
        Go to Profile
      </Link>
      <button
        onClick={logout}
        className="mt-6 px-6 py-3 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-300"
      >
        Logout
      </button>
    </div>
  );
};

export default DashboardPage;
