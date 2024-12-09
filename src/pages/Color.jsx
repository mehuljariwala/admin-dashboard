import { useState, useEffect } from "react";
import { HiSearch, HiDotsVertical } from "react-icons/hi";
import AddColorModal from "../components/AddColorModal";
import {
  getColors,
  addColor,
  updateColor,
  updateColorStock,
  deleteColor,
} from "../lib/supabase";

const Color = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showActions, setShowActions] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingColor, setEditingColor] = useState(null);
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadColors();
  }, []);

  const loadColors = async () => {
    try {
      setLoading(true);
      const data = await getColors();
      setColors(data);
      setError(null);
    } catch (err) {
      console.error("Error loading colors:", err);
      setError("Failed to load colors. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const filteredColors = colors.filter(
    (color) =>
      color.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      color.category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStockClass = (stock) => {
    if (stock > 10) return "text-green-600 bg-green-100";
    if (stock > 0) return "text-yellow-600 bg-yellow-100";
    if (stock === 0) return "text-gray-600 bg-gray-100";
    return "text-red-600 bg-red-100";
  };

  const handleAddColor = () => {
    setEditingColor(null);
    setShowModal(true);
  };

  const handleEditColor = (color) => {
    setEditingColor(color);
    setShowModal(true);
    setShowActions(null);
  };

  const handleUpdateStock = async (color) => {
    const newStock = prompt(`Enter new stock for ${color.name}:`, color.stock);
    if (newStock !== null) {
      const stockValue = parseInt(newStock, 10);
      if (!isNaN(stockValue)) {
        try {
          const updatedColor = await updateColorStock(color.id, stockValue);
          setColors(colors.map((c) => (c.id === color.id ? updatedColor : c)));
        } catch (err) {
          console.error("Error updating stock:", err);
          alert("Failed to update stock. Please try again later.");
        }
      }
    }
    setShowActions(null);
  };

  const handleDeleteColor = async (id) => {
    if (window.confirm("Are you sure you want to delete this color?")) {
      try {
        await deleteColor(id);
        setColors(colors.filter((color) => color.id !== id));
      } catch (err) {
        console.error("Error deleting color:", err);
        alert("Failed to delete color. Please try again later.");
      }
    }
    setShowActions(null);
  };

  const handleSaveColor = async (colorData) => {
    try {
      if (editingColor) {
        const updatedColor = await updateColor(editingColor.id, colorData);
        setColors(
          colors.map((color) =>
            color.id === editingColor.id ? updatedColor : color
          )
        );
      } else {
        const newColor = await addColor(colorData);
        setColors([newColor, ...colors]);
      }
      setShowModal(false);
    } catch (err) {
      console.error("Error saving color:", err);
      alert("Failed to save color. Please try again later.");
    }
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
          Manage Colors
        </h1>
        <div className="flex flex-col md:flex-row w-full md:w-auto gap-3">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search colors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <HiSearch
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
          <button
            onClick={handleAddColor}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Color
          </button>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-4">
        {filteredColors.map((color) => (
          <div key={color.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full border"
                    style={{ backgroundColor: color.name.toLowerCase() }}
                  />
                  <h3 className="font-medium text-gray-900">{color.name}</h3>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Category: {color.category.name}
                </p>
                <span
                  className={`mt-2 inline-block px-3 py-1 text-sm font-semibold rounded-full ${getStockClass(
                    color.stock
                  )}`}
                >
                  Stock: {color.stock}
                </span>
              </div>
              <div className="relative">
                <button
                  onClick={() =>
                    setShowActions(showActions === color.id ? null : color.id)
                  }
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <HiDotsVertical className="w-5 h-5 text-gray-500" />
                </button>
                {showActions === color.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                    <button
                      onClick={() => handleEditColor(color)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleUpdateStock(color)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Update Stock
                    </button>
                    <button
                      onClick={() => handleDeleteColor(color.id)}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Color
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredColors.map((color) => (
              <tr key={color.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div
                      className="w-6 h-6 rounded-full border mr-2"
                      style={{ backgroundColor: color.name.toLowerCase() }}
                    />
                    <span className="text-sm text-gray-900">{color.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {color.category.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStockClass(
                      color.stock
                    )}`}
                  >
                    {color.stock}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                      color.status === "Enable"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {color.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleEditColor(color)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleUpdateStock(color)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Stock
                  </button>
                  <button
                    onClick={() => handleDeleteColor(color.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Color Modal */}
      {showModal && (
        <AddColorModal
          isEdit={!!editingColor}
          color={editingColor}
          onClose={() => setShowModal(false)}
          onSave={handleSaveColor}
        />
      )}
    </div>
  );
};

export default Color;
