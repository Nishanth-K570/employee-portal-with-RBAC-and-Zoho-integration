import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";
import Alert from "../components/Alert";
import api from "../api";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApps = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/zoho/my-apps");
        setApps(data.apps || []);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, []);

  const getAppIcon = (app) => {
    const icons = {
      "Zoho People": "👥",
      "Zoho CRM": "📊",
      "Zoho Desk": "🎫",
      "Zoho Books": "📚",
    };
    return icons[app] || "📱";
  };

  const handleAppClick = (app) => {
    alert(
      `Opening ${app} via backend secure proxy...\n\nIn production, this would redirect to the Zoho service with your session.`,
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Access your authorized Zoho applications below
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert type="error" message={error} onClose={() => setError("")} />
        )}

        {/* Loading State */}
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* Apps Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Your Applications
              </h2>

              {apps.length === 0 ? (
                <div className="card text-center py-12">
                  <svg
                    className="w-16 h-16 mx-auto text-gray-300 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-gray-600">
                    No Zoho applications assigned to your role yet.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {apps.map((app) => (
                    <button
                      key={app.app}
                      onClick={() => handleAppClick(app.app)}
                      className="group card hover:shadow-lg transition-shadow duration-300 transform hover:scale-105 text-left"
                    >
                      <div className="text-4xl mb-3">{getAppIcon(app.app)}</div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {app.app}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Role: {app.role}
                      </p>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-xs font-medium text-blue-600">
                          Click to open →
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Admin Panel Link */}
            {user?.roles?.includes("Admin") && (
              <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Admin Access
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Manage users, assign roles, and view system audit logs
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/admin")}
                    className="btn-primary"
                  >
                    Go to Admin Panel
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* User Info Card */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Account Information
            </h3>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="text-gray-900">{user?.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="text-gray-900">{user?.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Roles</dt>
                <dd className="flex flex-wrap gap-2 mt-1">
                  {user?.roles?.map((role) => (
                    <span key={role} className="badge-blue">
                      {role}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              System Information
            </h3>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Portal Version
                </dt>
                <dd className="text-gray-900">1.0.0</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Last Login
                </dt>
                <dd className="text-gray-900">Just now</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Authentication
                </dt>
                <dd className="text-gray-900">JWT Secure Token</dd>
              </div>
            </dl>
          </div>
        </div>
      </main>
    </div>
  );
}
