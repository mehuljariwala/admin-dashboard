import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import { getColors } from "../../../lib/supabase";

const ColorCard = ({ color, value, onChange }) => {
  const headerStyle = {
    backgroundColor: color.color_code,
    borderTopLeftRadius: "0.5rem",
    borderTopRightRadius: "0.5rem",
    color: isLightColor(color.color_code) ? "#1e40af" : "#ffffff",
  };

  return (
    <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200">
      <div className="p-3 text-center" style={headerStyle}>
        <div className="font-medium">{color.name}</div>
        <div>{color.code}</div>
      </div>
      <div className="bg-white p-2 flex items-center justify-between">
        <button
          onClick={() => onChange((value || 0) - 1)}
          className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full"
          disabled={!value}
        >
          -
        </button>
        <input
          type="number"
          value={value || 0}
          onChange={(e) => onChange(parseInt(e.target.value) || 0)}
          className="w-12 text-center border rounded"
          min="0"
        />
        <button
          onClick={() => onChange((value || 0) + 1)}
          className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full"
        >
          +
        </button>
      </div>
    </div>
  );
};

ColorCard.propTypes = {
  color: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    color_code: PropTypes.string.isRequired,
  }).isRequired,
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired,
};

const SummaryTable = ({ title, colors, items }) => (
  <div className="mb-4">
    <h3 className="font-medium mb-2">{title} :-</h3>
    <table className="w-full bg-white rounded-lg overflow-hidden">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-4 py-2 text-left">#</th>
          <th className="px-4 py-2 text-left">Color</th>
          <th className="px-4 py-2 text-center">Req.</th>
          <th className="px-4 py-2 text-center">Delivery</th>
          <th className="px-4 py-2 text-center">Add</th>
        </tr>
      </thead>
      <tbody>
        {colors?.map((color, idx) => (
          <tr key={color.id} className="border-t">
            <td className="px-4 py-2">{idx + 1}</td>
            <td className="px-4 py-2 flex items-center">
              <span
                className="w-4 h-4 rounded-full mr-2"
                style={{ backgroundColor: color.color_code }}
              ></span>
              {color.name.toLowerCase()}
            </td>
            <td className="px-4 py-2 text-center">{items[color.id] || 0}</td>
            <td className="px-4 py-2 text-center">{items[color.id] || 0}</td>
            <td className="px-4 py-2 text-center">{items[color.id] || 0}</td>
          </tr>
        ))}
        <tr className="border-t font-medium bg-gray-50">
          <td colSpan="2" className="px-4 py-2">
            Total
          </td>
          <td className="px-4 py-2 text-center">
            {colors?.reduce((sum, color) => sum + (items[color.id] || 0), 0)}
          </td>
          <td className="px-4 py-2 text-center">
            {colors?.reduce((sum, color) => sum + (items[color.id] || 0), 0)}
          </td>
          <td className="px-4 py-2 text-center">
            {colors?.reduce((sum, color) => sum + (items[color.id] || 0), 0)}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

SummaryTable.propTypes = {
  title: PropTypes.string.isRequired,
  colors: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      color_code: PropTypes.string.isRequired,
    })
  ),
  items: PropTypes.object.isRequired,
};

// Helper function to determine if a color is light
const isLightColor = (hexColor) => {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 155;
};

const OrderForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const party = location.state?.party;

  // Redirect if no party is selected
  useEffect(() => {
    if (!party) {
      navigate("/orders/new");
    }
  }, [party, navigate]);

  const [formData, setFormData] = useState({
    party_name: party?.name || "",
    party_address: party?.address || "",
    date: new Date().toISOString().split("T")[0],
    delivery_date: new Date().toISOString().split("T")[0],
    items: {},
    status: "Pending",
  });

  const [colors, setColors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("5 TAR");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const colorsData = await getColors();

      // Organize colors by category
      const organizedColors = colorsData.reduce((acc, color) => {
        const category = color.category?.name || "Uncategorized";
        if (!acc[category]) acc[category] = [];
        acc[category].push(color);
        return acc;
      }, {});

      setColors(organizedColors);
      setError(null);
    } catch (err) {
      console.error("Error loading form data:", err);
      setError("Failed to load form data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuantityChange = (colorId, value) => {
    setFormData((prev) => ({
      ...prev,
      items: {
        ...prev.items,
        [colorId]: Math.max(0, value),
      },
    }));
  };

  const handleClear = () => {
    setFormData((prev) => ({
      ...prev,
      items: {},
    }));
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  const categories = ["Cetionic", "Litchy", "Polyester", "Multy"];
  const tabs = ["5 TAR", "3 TAR", "YARN", "Multy"];

  return (
    <div className="p-4 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg p-4 mb-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Party Name</span>
            <input
              type="text"
              className="border rounded px-3 py-1 text-blue-600 bg-white"
              value={formData.party_name}
              readOnly
            />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Address</span>
            <input
              type="text"
              className="border rounded px-3 py-1"
              value={formData.party_address}
              readOnly
            />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Order ID</span>
            <span className="text-sm">#</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Date</span>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="border rounded px-3 py-1"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Main Content */}
        <div className="flex-1">
          {/* Category Tabs */}
          <div className="flex space-x-4 mb-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 font-medium ${
                  activeTab === tab
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Color Categories */}
          {categories.map((category) => (
            <div key={category} className="mb-6">
              <h3 className="text-lg font-medium mb-3">{category} :-</h3>
              <div className="grid grid-cols-6 gap-4">
                {colors[activeTab]?.map((color) => (
                  <ColorCard
                    key={color.id}
                    color={color}
                    value={formData.items[color.id]}
                    onChange={(value) => handleQuantityChange(color.id, value)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Summary Tables */}
        <div className="w-80">
          {tabs.map((category) => (
            <SummaryTable
              key={category}
              title={category}
              colors={colors[category]}
              items={formData.items}
            />
          ))}

          {/* Action Buttons */}
          <div className="flex space-x-4 mt-6">
            <button className="flex-1 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600">
              Hold
            </button>
            <button
              onClick={handleClear}
              className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Clear
            </button>
            <button className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Bill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;
