import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";
import Alert from "../components/Alert";
import api from "../api";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("users");
  const [newUserForm, setNewUserForm] = useState({
    name: "",
    email: "",
    password: "",
    roleIds: [],
  });
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersRes, rolesRes, logsRes] = await Promise.all([
          api.get("/admin/users"),
          api.get("/admin/roles"),
          api.get("/admin/audit-logs"),
        ]);
        setUsers(usersRes.data);
        setRoles(rolesRes.data);
        setLogs(logsRes.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUpdateRoles = async (userId, roleIds) => {
    try {
      await api.patch(`/admin/users/${userId}/roles`, { roleIds });
      setSuccess("User roles updated successfully!");
      // Refresh users
      const { data } = await api.get("/admin/users");
      setUsers(data);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update roles");
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (
      !newUserForm.name ||
      !newUserForm.email ||
      !newUserForm.password ||
      newUserForm.roleIds.length === 0
    ) {
      setError("All fields are required");
      return;
    }

    try {
      await api.post("/admin/users", newUserForm);
      setSuccess("User created successfully!");
      setShowNewUserForm(false);
      setNewUserForm({ name: "", email: "", password: "", roleIds: [] });
      // Refresh users
      const { data } = await api.get("/admin/users");
      setUsers(data);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create user");
    }
  };

  const toggleRoleSelection = (roleId) => {
    setNewUserForm((prev) => ({
      ...prev,
      roleIds: prev.roleIds.includes(roleId)
        ? prev.roleIds.filter((id) => id !== roleId)
        : [...prev.roleIds, roleId],
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-600">
            Manage users, roles, and view system audit logs
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <Alert type="error" message={error} onClose={() => setError("")} />
        )}
        {success && (
          <Alert
            type="success"
            message={success}
            onClose={() => setSuccess("")}
          />
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex space-x-8">
            {["users", "roles", "logs"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === tab
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Users Tab */}
        {activeTab === "users" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Users Management
              </h2>
              <button
                onClick={() => setShowNewUserForm(!showNewUserForm)}
                className="btn-primary"
              >
                {showNewUserForm ? "Cancel" : "+ Add New User"}
              </button>
            </div>

            {/* New User Form */}
            {showNewUserForm && (
              <div className="card mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Create New User
                </h3>
                <form onSubmit={handleCreateUser} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={newUserForm.name}
                        onChange={(e) =>
                          setNewUserForm({
                            ...newUserForm,
                            name: e.target.value,
                          })
                        }
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={newUserForm.email}
                        onChange={(e) =>
                          setNewUserForm({
                            ...newUserForm,
                            email: e.target.value,
                          })
                        }
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        value={newUserForm.password}
                        onChange={(e) =>
                          setNewUserForm({
                            ...newUserForm,
                            password: e.target.value,
                          })
                        }
                        className="input-field"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assign Roles
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {roles.map((role) => (
                        <label key={role.id} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={newUserForm.roleIds.includes(role.id)}
                            onChange={() => toggleRoleSelection(role.id)}
                            className="rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {role.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button type="submit" className="btn-primary">
                    Create User
                  </button>
                </form>
              </div>
            )}

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Roles
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {user.email}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {user.Roles?.map((role) => (
                            <span key={role.id} className="badge-blue">
                              {role.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          onChange={(e) =>
                            handleUpdateRoles(user.id, [e.target.value])
                          }
                          defaultValue=""
                          className="input-field text-sm"
                        >
                          <option value="" disabled>
                            Change role...
                          </option>
                          {roles.map((role) => (
                            <option key={role.id} value={role.id}>
                              {role.name}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Roles Tab */}
        {activeTab === "roles" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Roles & Permissions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roles.map((role) => (
                <div key={role.id} className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {role.name}
                  </h3>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">
                      Permissions:
                    </p>
                    <ul className="space-y-2">
                      {role.Permissions?.map((perm) => (
                        <li
                          key={perm.id}
                          className="text-sm text-gray-600 flex items-start"
                        >
                          <span className="mr-2 text-blue-600">✓</span>
                          <span>{perm.description || perm.key}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Logs Tab */}
        {activeTab === "logs" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Audit Logs
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      IP Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="badge badge-blue">{log.action}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                          {JSON.stringify(log.details || {}).substring(0, 100)}
                        </code>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {log.ipAddress || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(log.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
