import { useState } from "react";
import { HiMinus, HiPlus } from "react-icons/hi";

const Inventory = () => {
  const [activeTab, setActiveTab] = useState("5 Tar");
  const [quantities, setQuantities] = useState({});

  const tabs = ["5 Tar", "3 Tar", "Yarn"];

  const inventoryData = {
    "5 Tar": [
      { color: "#ff0000", name: "Red", stock: 2 },
      { color: "#f716ec", name: "Rani", stock: 7 },
      { color: "#4169e1", name: "R Blue", stock: 16 },
      { color: "#008000", name: "Green", stock: -9 },
      { color: "#ffa500", name: "Orange", stock: 19 },
      { color: "#800080", name: "Jambli", stock: 9 },
      { color: "#ff00ff", name: "Majenta", stock: -2 },
      { color: "#40e0d0", name: "Firozi", stock: 0 },
      { color: "#006400", name: "Rama", stock: -7 },
      { color: "#ffd700", name: "Golden", stock: 13 },
      { color: "#90ee90", name: "Perot", stock: 4 },
      { color: "#dc143c", name: "Gajari", stock: 1 },
      { color: "#000080", name: "N Blue", stock: -3 },
      { color: "#d2b48c", name: "Chiku", stock: 2 },
      { color: "#98ff98", name: "C Green", stock: 13 },
      { color: "#8b4513", name: "Oninen", stock: 2 },
      { color: "#32cd32", name: "L Green", stock: 8 },
      { color: "#98fb98", name: "L Perot", stock: 3 },
      { color: "#000000", name: "Black", stock: 9 },
      { color: "#800000", name: "Mahrron", stock: -5 },
    ],
    "3 Tar": [
      { color: "#ff0000", name: "Red", stock: 18 },
      { color: "#f716ec", name: "Rani", stock: 20 },
      { color: "#4169e1", name: "R Blue", stock: 25 },
      { color: "#008000", name: "Green", stock: 4 },
      { color: "#ffa500", name: "Orange", stock: 18 },
      { color: "#800080", name: "Jambli", stock: 6 },
      // Add more items as needed
    ],
    Yarn: [
      { color: "#ff0000", name: "Red", stock: 7 },
      { color: "#f716ec", name: "Rani", stock: 12 },
      { color: "#4169e1", name: "R Blue", stock: 31 },
      { color: "#008000", name: "Green", stock: 7 },
      { color: "#ffa500", name: "Orange", stock: 43 },
      { color: "#800080", name: "Jambli", stock: 18 },
      // Add more items as needed
    ],
  };

  const handleQuantityChange = (name, value) => {
    setQuantities((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleIncrement = (name) => {
    const currentValue = parseInt(quantities[name] || "0");
    handleQuantityChange(name, currentValue + 1);
  };

  const handleDecrement = (name) => {
    const currentValue = parseInt(quantities[name] || "0");
    if (currentValue > 0) {
      handleQuantityChange(name, currentValue - 1);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800 underline">
        Inventory
      </h1>

      {/* Tabs */}
      <div className="flex space-x-4 border-b">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`py-2 px-4 ${
              activeTab === tab
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Colour Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Colour Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {inventoryData[activeTab].map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.stock}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDecrement(item.name)}
                      className="p-1 rounded-md hover:bg-gray-100"
                    >
                      <HiMinus className="w-5 h-5 text-gray-600" />
                    </button>
                    <input
                      type="number"
                      value={quantities[item.name] || 0}
                      onChange={(e) =>
                        handleQuantityChange(
                          item.name,
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-16 px-2 py-1 text-center border rounded-md"
                    />
                    <button
                      onClick={() => handleIncrement(item.name)}
                      className="p-1 rounded-md hover:bg-gray-100"
                    >
                      <HiPlus className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;
