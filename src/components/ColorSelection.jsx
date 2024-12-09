import { useState } from "react";
import PropTypes from "prop-types";

const ColorCard = ({ color, value, onChange }) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="flex items-center">
        <div className="flex-1 text-blue-600 p-2">
          {color.name}
          <div className="text-gray-600 text-sm">{color.code}</div>
        </div>
      </div>
      <div className="bg-gray-50 p-2 flex items-center justify-between">
        <button
          onClick={() => onChange(Math.max(0, (value || 0) - 1))}
          className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full"
          disabled={!value}
        >
          -
        </button>
        <input
          type="number"
          value={value || 0}
          onChange={(e) => onChange(Math.max(0, parseInt(e.target.value) || 0))}
          className="w-12 text-center border rounded"
          min="0"
        />
        <button
          onClick={() => onChange((value || 0) + 1)}
          className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full"
        >
          +
        </button>
      </div>
    </div>
  );
};

ColorCard.propTypes = {
  color: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    code: PropTypes.string,
  }).isRequired,
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired,
};

const SummaryTable = ({ title, items }) => {
  const total = Object.values(items).reduce((sum, value) => sum + value, 0);

  return (
    <div className="bg-white rounded-lg p-4 mb-4">
      <h3 className="font-medium mb-2">{title} :-</h3>
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-2 py-1 text-left">#</th>
            <th className="px-2 py-1 text-left">Color</th>
            <th className="px-2 py-1 text-center">Req.</th>
            <th className="px-2 py-1 text-center">Delivery</th>
            <th className="px-2 py-1 text-center">Add</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(items).map(([colorId, value], index) => (
            <tr key={colorId} className="border-t">
              <td className="px-2 py-1">{index + 1}</td>
              <td className="px-2 py-1">{colorId}</td>
              <td className="px-2 py-1 text-center">{value}</td>
              <td className="px-2 py-1 text-center">{value}</td>
              <td className="px-2 py-1 text-center">{value}</td>
            </tr>
          ))}
          <tr className="border-t font-medium">
            <td colSpan="2" className="px-2 py-1">
              Total
            </td>
            <td className="px-2 py-1 text-center">{total}</td>
            <td className="px-2 py-1 text-center">{total}</td>
            <td className="px-2 py-1 text-center">{total}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

SummaryTable.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.object.isRequired,
};

const ColorSelection = ({ party }) => {
  const [activeTab, setActiveTab] = useState("5 TAR");
  const [items, setItems] = useState({});

  const categories = {
    "5 TAR": {
      Cetionic: [
        { id: "red", name: "Red", code: "2" },
        { id: "rani", name: "Rani", code: "11" },
        { id: "rblue", name: "R Blue", code: "14" },
        { id: "green", name: "Green", code: "-5" },
        { id: "orange", name: "Orange", code: "17" },
        { id: "jambli", name: "Jambli", code: "9" },
      ],
      Litchy: [],
      Polyester: [
        { id: "black", name: "Black", code: "19" },
        { id: "mahron", name: "Mahron", code: "4" },
        { id: "gray", name: "Gray", code: "-4" },
      ],
      Multy: [],
    },
    "3 TAR": {},
    YARN: {},
  };

  const handleQuantityChange = (colorId, value) => {
    setItems((prev) => ({
      ...prev,
      [colorId]: value,
    }));
  };

  const handleClear = () => {
    setItems({});
  };

  return (
    <div className="p-4 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg p-4 mb-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Party Name</span>
            <span className="text-blue-600">{party.name}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Address</span>
            <span>{party.address}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Order ID</span>
            <span className="text-sm">#</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Date</span>
            <input
              type="date"
              className="border rounded px-3 py-1"
              value={new Date().toISOString().split("T")[0]}
              readOnly
            />
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Main Content */}
        <div className="flex-1">
          {/* Category Tabs */}
          <div className="flex space-x-4 mb-4">
            {Object.keys(categories).map((tab) => (
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
          {Object.entries(categories[activeTab]).map(([category, colors]) => (
            <div key={category} className="mb-6">
              <h3 className="text-lg font-medium mb-3">{category} :-</h3>
              <div className="grid grid-cols-6 gap-4">
                {colors.map((color) => (
                  <ColorCard
                    key={color.id}
                    color={color}
                    value={items[color.id]}
                    onChange={(value) => handleQuantityChange(color.id, value)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Summary Tables */}
        <div className="w-80">
          {Object.keys(categories).map((category) => (
            <SummaryTable key={category} title={category} items={items} />
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

ColorSelection.propTypes = {
  party: PropTypes.shape({
    name: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
  }).isRequired,
};

export default ColorSelection;
