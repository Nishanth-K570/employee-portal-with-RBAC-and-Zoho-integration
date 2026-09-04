import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl font-bold text-blue-600">Portal</span>
            </div>
          </div>

          {user && (
            <div className="flex items-center space-x-6">
              <div className="text-sm text-gray-600">
                <p className="font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <div className="flex items-center space-x-2">
                {user.roles &&
                  user.roles.map((role) => (
                    <span key={role} className="badge-blue text-xs">
                      {role}
                    </span>
                  ))}
              </div>
              <button onClick={handleLogout} className="btn-secondary text-sm">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
