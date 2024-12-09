import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { HiX } from "react-icons/hi";
import { getColors, addOrder } from "../lib/supabase";

const ColorButton = ({ name, stock, color, quantity, onQuantityChange }) => (
  <div className="flex flex-col border rounded-lg overflow-hidden shadow-sm">
    <div
      className="p-3 sm:p-2 text-center relative"
      style={{ backgroundColor: color }}
    >
      <span className="font-medium text-base sm:text-sm">{name}</span>
      <span className="absolute right-2 top-2 text-sm sm:text-xs">{stock}</span>
    </div>
    <div className="flex items-center justify-between p-3 sm:p-2 bg-white">
      <button
        onClick={() => onQuantityChange(Math.max(0, quantity - 1))}
        className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 active:bg-gray-300 touch-manipulation"
      >
        -
      </button>
      <input
        type="number"
        value={quantity}
        onChange={(e) => onQuantityChange(parseInt(e.target.value) || 0)}
        className="w-16 sm:w-12 h-10 sm:h-8 text-center border rounded mx-1 text-base sm:text-sm"
        min="0"
      />
      <button
        onClick={() => onQuantityChange(quantity + 1)}
        className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 active:bg-gray-300 touch-manipulation"
      >
        +
      </button>
    </div>
  </div>
);

ColorButton.propTypes = {
  name: PropTypes.string.isRequired,
  stock: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  quantity: PropTypes.number.isRequired,
  onQuantityChange: PropTypes.func.isRequired,
};

const ColorSummaryTable = ({ title, colors, quantities }) => (
  <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
    <h3 className="font-medium mb-2 text-base sm:text-sm sticky left-0">
      {title}:-
    </h3>
    <div className="min-w-[600px]">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left text-sm">#</th>
            <th className="p-2 text-left text-sm">Color</th>
            <th className="p-2 text-center text-sm">Req.</th>
            <th className="p-2 text-center text-sm">Delivery</th>
            <th className="p-2 text-center text-sm">Add</th>
          </tr>
        </thead>
        <tbody>
          {colors.map((color, index) => (
            <tr key={color.id} className="border-b">
              <td className="p-2 text-sm">{index + 1}</td>
              <td className="p-2">
                <div className="flex items-center">
                  <div
                    className="w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: color.hex_code }}
                  />
                  <span className="text-sm">{color.name.toLowerCase()}</span>
                </div>
              </td>
              <td className="p-2 text-center text-sm">
                {quantities[color.id] || 0}
              </td>
              <td className="p-2 text-center text-sm">
                {quantities[color.id] || 0}
              </td>
              <td className="p-2 text-center text-sm">-</td>
            </tr>
          ))}
          <tr className="font-medium bg-gray-100">
            <td colSpan="2" className="p-2 text-sm">
              Total
            </td>
            <td className="p-2 text-center text-sm">
              {Object.values(quantities).reduce((a, b) => a + b, 0)}
            </td>
            <td className="p-2 text-center text-sm">
              {Object.values(quantities).reduce((a, b) => a + b, 0)}
            </td>
            <td className="p-2 text-center text-sm">0</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

ColorSummaryTable.propTypes = {
  title: PropTypes.string.isRequired,
  colors: PropTypes.array.isRequired,
  quantities: PropTypes.object.isRequired,
};

const OrderForm = ({ party, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    items: {},
  });

  const [colors, setColors] = useState({
    Cetionic: [],
    Itchy: [],
    Polyester: [],
    Multy: [],
  });

  console.log(colors);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("Cetionic");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const colorsData = await getColors();

      console.log(colorsData);

      // Organize colors by category
      const organizedColors = colorsData.reduce(
        (acc, color) => {
          const category = color.category.name || "Cetionic";
          if (!acc[category]) acc[category] = [];
          acc[category].push({
            ...color,
            hex_code: getColorHexCode(color.name.toLowerCase()),
          });
          return acc;
        },
        {
          Cetionic: [],
          Itchy: [],
          Polyester: [],
          Multy: [],
        }
      );

      setColors(organizedColors);
      setError(null);
    } catch (err) {
      console.error("Error loading colors:", err);
      setError("Failed to load colors. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const getColorHexCode = (name) => {
    const colorMap = {
      red: "#ff0000",
      blue: "#0000ff",
      green: "#00ff00",
      orange: "#ffa500",
      black: "#000000",
      white: "#ffffff",
      gray: "#808080",
      pink: "#ffc0cb",
      purple: "#800080",
      yellow: "#ffff00",
      brown: "#a52a2a",
      // Add more color mappings as needed
    };
    return colorMap[name] || "#cccccc";
  };

  const handleQuantityChange = (colorId, value) => {
    setFormData((prev) => ({
      ...prev,
      items: {
        ...prev.items,
        [colorId]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    try {
      const orderItems = Object.entries(formData.items)
        .filter(([, quantity]) => quantity > 0)
        .map(([colorId, quantity]) => ({
          color_id: parseInt(colorId),
          quantity: parseInt(quantity),
        }));

      if (orderItems.length === 0) {
        alert("Please add at least one item to the order");
        return;
      }

      const orderData = {
        party_id: party.id,
        date: formData.date,
        items: orderItems,
      };

      await addOrder(orderData);
      onSave();
    } catch (err) {
      console.error("Error saving order:", err);
      alert("Failed to save order. Please try again.");
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center text-red-600 p-4">{error}</div>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center overflow-auto">
      <div className="bg-white rounded-lg w-full max-w-7xl my-4 mx-2">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Party Name:</span>
              <span className="font-medium">{party.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Address:</span>
              <span>{party.address}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Order ID:</span>
              <span>#</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Date:</span>
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, date: e.target.value }))
                }
                className="border rounded px-2 py-1"
              />
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full ml-auto sm:ml-0"
          >
            <HiX className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Left side - Color selection */}
          <div className="flex-1 p-4 lg:border-r">
            {/* Category tabs */}
            <div className="flex flex-wrap gap-2 mb-4">
              {Object.keys(colors).map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded text-sm ${
                    activeCategory === category
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Color grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {colors[activeCategory].map((color) => (
                <ColorButton
                  key={color.id}
                  name={color.name}
                  stock={color.stock || 0}
                  color={color.hex_code}
                  quantity={formData.items[color.id] || 0}
                  onQuantityChange={(value) =>
                    handleQuantityChange(color.id, value)
                  }
                />
              ))}
            </div>
          </div>

          {/* Right side - Summary tables */}
          <div className="w-full lg:w-96 p-4 space-y-4">
            {Object.entries(colors).map(([category, categoryColors]) => (
              <ColorSummaryTable
                key={category}
                title={category}
                colors={categoryColors}
                quantities={formData.items}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4 flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0">
          <div className="flex space-x-4">
            <button className="flex-1 sm:flex-none px-6 py-3 sm:py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 active:bg-cyan-700 text-base sm:text-sm">
              Hold
            </button>
            <button
              onClick={() => setFormData((prev) => ({ ...prev, items: {} }))}
              className="flex-1 sm:flex-none px-6 py-3 sm:py-2 bg-red-500 text-white rounded hover:bg-red-600 active:bg-red-700 text-base sm:text-sm"
            >
              Clear
            </button>
          </div>
          <button
            onClick={handleSubmit}
            className="w-full sm:w-auto px-6 py-3 sm:py-2 bg-blue-500 text-white rounded hover:bg-blue-600 active:bg-blue-700 text-base sm:text-sm"
          >
            Bill
          </button>
        </div>
      </div>
    </div>
  );
};

OrderForm.propTypes = {
  party: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default OrderForm;
