import { useState } from "react";
import { motion } from "framer-motion";
import { HiChevronDown } from "react-icons/hi";

const Report = () => {
  const [stockFilter, setStockFilter] = useState("All Stock");
  const [showDropdown, setShowDropdown] = useState(false);

  const filters = ["All Stock", "Minimum Stock", "Maximum Stock"];

  const reportData = [
    { color: "#ff0000", name: "Red", fiveTar: 2, threeTar: 18, yarn: 7 },
    { color: "#f716ec", name: "Rani", fiveTar: 7, threeTar: 20, yarn: 12 },
    { color: "#4169e1", name: "R Blue", fiveTar: 16, threeTar: 25, yarn: 31 },
    { color: "#008000", name: "Green", fiveTar: -9, threeTar: 4, yarn: 7 },
    { color: "#ffa500", name: "Orange", fiveTar: 19, threeTar: 18, yarn: 43 },
    { color: "#800080", name: "Jambli", fiveTar: 9, threeTar: 6, yarn: 18 },
    { color: "#ff00ff", name: "Majenta", fiveTar: -2, threeTar: -4, yarn: 12 },
    { color: "#40e0d0", name: "Firozi", fiveTar: 0, threeTar: 3, yarn: 5 },
    { color: "#006400", name: "Rama", fiveTar: -7, threeTar: -7, yarn: -23 },
    { color: "#90ee90", name: "Perot", fiveTar: 4, threeTar: 7, yarn: 5 },
    { color: "#dc143c", name: "Gajari", fiveTar: 1, threeTar: 0, yarn: 2 },
    { color: "#d2b48c", name: "Chiku", fiveTar: 2, threeTar: 0, yarn: -38 },
    { color: "#98ff98", name: "C Green", fiveTar: 13, threeTar: -4, yarn: 15 },
    { color: "#8b4513", name: "Oninen", fiveTar: 2, threeTar: 3, yarn: -1 },
    { color: "#32cd32", name: "L Green", fiveTar: 8, threeTar: 4, yarn: 13 },
    { color: "#98fb98", name: "L Perot", fiveTar: 3, threeTar: -2, yarn: 19 },
    { color: "#000000", name: "Black", fiveTar: 9, threeTar: -1, yarn: 22 },
    { color: "#800000", name: "Mahrron", fiveTar: -5, threeTar: 4, yarn: 23 },
  ];

  const getStockClass = (value) => {
    if (value < 0) return "bg-red-100 text-red-800";
    if (value === 0) return "bg-gray-100 text-gray-800";
    return "bg-white text-gray-800";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">
          Inventory Report
        </h1>
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center justify-between w-48 px-4 py-2 bg-white border rounded-md shadow-sm hover:bg-gray-50"
          >
            <span>{stockFilter}</span>
            <HiChevronDown
              className={`w-5 h-5 transition-transform ${
                showDropdown ? "transform rotate-180" : ""
              }`}
            />
          </button>
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute z-10 w-48 mt-1 bg-white border rounded-md shadow-lg"
            >
              {filters.map((filter) => (
                <button
                  key={filter}
                  className={`block w-full px-4 py-2 text-left hover:bg-gray-50 ${
                    filter === stockFilter ? "bg-blue-50 text-blue-600" : ""
                  }`}
                  onClick={() => {
                    setStockFilter(filter);
                    setShowDropdown(false);
                  }}
                >
                  {filter}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </div>

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
                5 Tar
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                3 Tar
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Yarn
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reportData.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.name}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${getStockClass(
                    item.fiveTar
                  )}`}
                >
                  {item.fiveTar}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${getStockClass(
                    item.threeTar
                  )}`}
                >
                  {item.threeTar}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${getStockClass(
                    item.yarn
                  )}`}
                >
                  {item.yarn}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default Report;
