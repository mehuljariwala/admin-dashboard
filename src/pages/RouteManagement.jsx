import { useState, useEffect } from "react";
import { getRoutes, addRoute, updateRoute, deleteRoute } from "../lib/supabase";
import { FaEdit, FaTrash } from "react-icons/fa";
import Shimmer from "../components/Shimmer";
import AddRouteModal from "../components/AddRouteModal";

export default function RouteManagement() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = async () => {
    try {
      setLoading(true);
      const data = await getRoutes();
      setRoutes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingRoute) {
        await updateRoute(editingRoute.id, formData);
      } else {
        await addRoute(formData);
      }
      loadRoutes();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (route) => {
    setEditingRoute(route);
    setShowAddModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this route?")) {
      try {
        await deleteRoute(id);
        loadRoutes();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingRoute(null);
  };

  if (loading)
    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Route Management</h1>
          <button
            disabled
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 opacity-50 cursor-not-allowed"
          >
            Add Route
          </button>
        </div>
        <Shimmer rows={5} />
      </div>
    );

  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Route Management</h1>
        <button
          onClick={() => {
            setEditingRoute(null);
            setShowAddModal(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Route
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
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
            {routes.map((route) => (
              <tr key={route.id}>
                <td className="px-6 py-4 whitespace-nowrap">{route.name}</td>
                <td className="px-6 py-4">{route.description}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      route.status === "Enable"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {route.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => handleEdit(route)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    <FaEdit className="inline" />
                  </button>
                  <button
                    onClick={() => handleDelete(route.id)}
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
        <AddRouteModal
          isEdit={!!editingRoute}
          route={editingRoute}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
