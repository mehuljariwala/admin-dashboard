import { useState } from "react";
import PropTypes from "prop-types";

const ColorCard = ({ name, stock, color, quantity, onQuantityChange }) => (
  <div
    className="bg-white rounded-lg shadow cursor-pointer overflow-hidden"
    onClick={() => onQuantityChange(name, (quantity || 0) + 1)}
  >
    {/* Color Header */}
    <div className="h-8 w-full" style={{ backgroundColor: color }} />

    {/* Content */}
    <div className="p-3 text-center">
      <div className="text-blue-600 font-medium">{name}</div>
      <div className="text-gray-600">{stock}</div>
    </div>

    {/* Input */}
    <div className="border-t flex">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onQuantityChange(name, Math.max(0, (quantity || 0) - 1));
        }}
        className="w-12 py-2 text-xl font-medium hover:bg-gray-100"
      >
        -
      </button>
      <input
        type="text"
        value={quantity || 0}
        onChange={(e) => {
          e.stopPropagation();
          onQuantityChange(name, parseInt(e.target.value) || 0);
        }}
        onClick={(e) => e.stopPropagation()}
        className="flex-1 text-center border-x py-2"
      />
      <button
        onClick={(e) => {
          e.stopPropagation();
          onQuantityChange(name, (quantity || 0) + 1);
        }}
        className="w-12 py-2 text-xl font-medium hover:bg-gray-100"
      >
        +
      </button>
    </div>
  </div>
);

ColorCard.propTypes = {
  name: PropTypes.string.isRequired,
  stock: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  quantity: PropTypes.number,
  onQuantityChange: PropTypes.func.isRequired,
};

const OrderForm = ({ party, onClose }) => {
  const [selectedTab, setSelectedTab] = useState("5 TAR");
  const [quantities, setQuantities] = useState({});
  const [deliveryQuantities, setDeliveryQuantities] = useState({});

  const tabs = ["5 TAR", "3 TAR", "YARN"];

  const colors = {
    Cetionic: {
      Red: { stock: 2, color: "#ff0000" },
      Rani: { stock: 13, color: "#f716ec" },
      "R Blue": { stock: 15, color: "#4169e1" },
      Green: { stock: -7, color: "#008000" },
      Orange: { stock: 19, color: "#ffa500" },
      Jambli: { stock: 8, color: "#800080" },
      Majenta: { stock: 3, color: "#ff00ff" },
      Firozi: { stock: 5, color: "#40e0d0" },
      Rama: { stock: 4, color: "#006400" },
      Golden: { stock: 12, color: "#ffd700" },
      Perot: { stock: 3, color: "#90ee90" },
      Gajari: { stock: 3, color: "#dc143c" },
      "N Blue": { stock: 2, color: "#000080" },
      Chiku: { stock: 16, color: "#d2b48c" },
      "C Green": { stock: 12, color: "#98ff98" },
      Oninen: { stock: 5, color: "#8b4513" },
      "L Green": { stock: 8, color: "#32cd32" },
      "L Perot": { stock: 2, color: "#98fb98" },
    },
    Litchy: {
      White: { stock: 2, color: "#ffffff" },
      LEMON: { stock: 0, color: "#fff44f" },
      "L MAHENDI": { stock: 15, color: "#228b22" },
    },
    Polyester: {
      Black: { stock: 14, color: "#000000" },
      Mahron: { stock: 3, color: "#800000" },
      Gray: { stock: -3, color: "#808080" },
      "B Cream": { stock: -3, color: "#ffe4c4" },
      "D Pink": { stock: -1, color: "#ff1493" },
      Wine: { stock: -1, color: "#722f37" },
    },
    Multy: {
      "D Multy": { stock: 0, color: "#ff00ff" },
      "L Multy": { stock: 0, color: "#ff69b4" },
      "AK Multy": { stock: 0, color: "#ff1493" },
    },
  };

  const handleQuantityChange = (colorName, value, type = "order") => {
    const setValue = (prev) => ({
      ...prev,
      [colorName]: Math.max(0, value),
    });

    if (type === "order") {
      setQuantities(setValue);
      // Auto-set delivery quantity to match order quantity
      setDeliveryQuantities((prev) => ({
        ...prev,
        [colorName]: Math.max(0, value),
      }));
    } else {
      setDeliveryQuantities(setValue);
    }
  };

  const getActiveColors = () => {
    return Object.entries(quantities)
      .filter(([, quantity]) => quantity > 0)
      .map(([name]) => ({
        name,
        orderQty: quantities[name],
        deliveryQty: deliveryQuantities[name] || quantities[name],
      }));
  };

  const getTotalQuantities = () => {
    const activeColors = getActiveColors();
    return {
      orderTotal: activeColors.reduce((sum, color) => sum + color.orderQty, 0),
      deliveryTotal: activeColors.reduce(
        (sum, color) => sum + color.deliveryQty,
        0
      ),
    };
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex justify-between items-center gap-4">
          {/* Left Side - Party Info */}
          <div className="flex gap-4">
            <div>
              <label className="text-sm text-gray-600">Party Name</label>
              <div className="font-medium">{party.name}</div>
            </div>
            <div>
              <label className="text-sm text-gray-600">Address</label>
              <div className="font-medium">{party.address}</div>
            </div>
          </div>

          {/* Right Side - Order Info & Actions */}
          <div className="flex items-center gap-4">
            <div>
              <label className="text-sm text-gray-600">Order ID</label>
              <div className="font-medium">#</div>
            </div>
            <div>
              <label className="text-sm text-gray-600">Date</label>
              <div className="font-medium">
                {new Date().toLocaleDateString()}
              </div>
            </div>
            <div className="flex gap-2 ml-4">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200">
                Hold
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Bill
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-6 py-2 focus:outline-none ${
                selectedTab === tab
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex">
        {/* Left Side - Color Selection */}
        <div className="w-2/3 p-4 border-r">
          {Object.entries(colors).map(([category, categoryColors]) => (
            <div key={category} className="mb-8">
              <h3 className="font-medium mb-4">{category} :-</h3>
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(categoryColors).map(
                  ([name, { stock, color }]) => (
                    <ColorCard
                      key={name}
                      name={name}
                      stock={stock}
                      color={color}
                      quantity={quantities[name]}
                      onQuantityChange={handleQuantityChange}
                    />
                  )
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Right Side - Selected Colors */}
        <div className="w-1/3 p-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium mb-4">{selectedTab} :-</h3>
            <table className="w-full">
              <thead>
                <tr className="text-sm text-gray-600">
                  <th className="text-left py-2">#</th>
                  <th className="text-left py-2">Color</th>
                  <th className="text-center py-2">Req.</th>
                  <th className="text-center py-2">Delivery</th>
                  <th className="text-center py-2">Add</th>
                </tr>
              </thead>
              <tbody>
                {getActiveColors().map((color, index) => (
                  <tr key={color.name} className="border-t">
                    <td className="py-2">{index + 1}</td>
                    <td className="py-2">{color.name}</td>
                    <td className="text-center py-2">{color.orderQty}</td>
                    <td className="text-center py-2">
                      <input
                        type="number"
                        value={color.deliveryQty}
                        onChange={(e) =>
                          handleQuantityChange(
                            color.name,
                            parseInt(e.target.value) || 0,
                            "delivery"
                          )
                        }
                        className="w-16 text-center border rounded-md p-1"
                      />
                    </td>
                    <td className="text-center py-2">
                      {color.deliveryQty - color.orderQty}
                    </td>
                  </tr>
                ))}
                <tr className="border-t font-medium">
                  <td colSpan="2" className="py-2">
                    Total
                  </td>
                  <td className="text-center py-2">
                    {getTotalQuantities().orderTotal}
                  </td>
                  <td className="text-center py-2">
                    {getTotalQuantities().deliveryTotal}
                  </td>
                  <td className="text-center py-2">
                    {getTotalQuantities().deliveryTotal -
                      getTotalQuantities().orderTotal}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

OrderForm.propTypes = {
  party: PropTypes.shape({
    name: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default OrderForm;
