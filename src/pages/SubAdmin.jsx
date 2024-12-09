import { useState, useEffect } from "react";
import {
  getSubAdmins,
  addSubAdmin,
  updateSubAdmin,
  deleteSubAdmin,
  updateSubAdminPermissions,
} from "../lib/supabase";
import { FaEdit, FaTrash, FaKey } from "react-icons/fa";
import Shimmer from "../components/Shimmer";

export default function SubAdmin() {
  const [subAdmins, setSubAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    full_name: "",
    email: "",
    status: "Enable",
  });
  const [permissions, setPermissions] = useState({
    orders: false,
    inventory: false,
    routes: false,
    parties: false,
  });

  useEffect(() => {
    loadSubAdmins();
  }, []);

  const loadSubAdmins = async () => {
    try {
      setLoading(true);
      const data = await getSubAdmins();
      setSubAdmins(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAdmin) {
        const { password, ...updateData } = formData;
        if (password) {
          updateData.password = password;
        }
        await updateSubAdmin(editingAdmin.id, updateData);
      } else {
        await addSubAdmin(formData);
      }
      setShowAddModal(false);
      setEditingAdmin(null);
      setFormData({
        username: "",
        password: "",
        full_name: "",
        email: "",
        status: "Enable",
      });
      loadSubAdmins();
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePermissionsSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateSubAdminPermissions(editingAdmin.id, permissions);
      setShowPermissionsModal(false);
      setEditingAdmin(null);
      setPermissions({
        orders: false,
        inventory: false,
        routes: false,
        parties: false,
      });
      loadSubAdmins();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (admin) => {
    setEditingAdmin(admin);
    setFormData({
      username: admin.username,
      password: "",
      full_name: admin.full_name,
      email: admin.email || "",
      status: admin.status,
    });
    setShowAddModal(true);
  };

  const handlePermissions = (admin) => {
    setEditingAdmin(admin);
    setPermissions(admin.permissions);
    setShowPermissionsModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this sub-admin?")) {
      try {
        await deleteSubAdmin(id);
        loadSubAdmins();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading)
    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Sub Admin Management</h1>
          <button
            disabled
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 opacity-50 cursor-not-allowed"
          >
            Add Sub Admin
          </button>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <Shimmer rows={5} />
        </div>
      </div>
    );

  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Sub Admin Management</h1>
        <button
          onClick={() => {
            setEditingAdmin(null);
            setFormData({
              username: "",
              password: "",
              full_name: "",
              email: "",
              status: "Enable",
            });
            setShowAddModal(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Sub Admin
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Full Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {subAdmins.map((admin) => (
              <tr key={admin.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {admin.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {admin.full_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{admin.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      admin.status === "Enable"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {admin.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => handleEdit(admin)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    <FaEdit className="inline" />
                  </button>
                  <button
                    onClick={() => handlePermissions(admin)}
                    className="text-yellow-600 hover:text-yellow-900 mr-3"
                  >
                    <FaKey className="inline" />
                  </button>
                  <button
                    onClick={() => handleDelete(admin.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <FaTrash className="inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {editingAdmin ? "Edit Sub Admin" : "Add Sub Admin"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Password {editingAdmin && "(Leave blank to keep unchanged)"}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  {...(!editingAdmin && { required: true })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="Enable">Enable</option>
                  <option value="Disable">Disable</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  {editingAdmin ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPermissionsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Manage Permissions</h2>
            <form onSubmit={handlePermissionsSubmit}>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="orders"
                    checked={permissions.orders}
                    onChange={(e) =>
                      setPermissions({
                        ...permissions,
                        orders: e.target.checked,
                      })
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="orders"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Orders Management
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="inventory"
                    checked={permissions.inventory}
                    onChange={(e) =>
                      setPermissions({
                        ...permissions,
                        inventory: e.target.checked,
                      })
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="inventory"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Inventory Management
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="routes"
                    checked={permissions.routes}
                    onChange={(e) =>
                      setPermissions({
                        ...permissions,
                        routes: e.target.checked,
                      })
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="routes"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Routes Management
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="parties"
                    checked={permissions.parties}
                    onChange={(e) =>
                      setPermissions({
                        ...permissions,
                        parties: e.target.checked,
                      })
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="parties"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Parties Management
                  </label>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPermissionsModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Save Permissions
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
