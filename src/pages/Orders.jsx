import { useState } from "react";
import { motion } from "framer-motion";
import { HiPrinter } from "react-icons/hi";
import PropTypes from "prop-types";

const OrderView = ({ order, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-blue-600">{order.partyName}</h2>
        <p className="text-gray-600">{order.contactPerson}</p>
      </div>

      <div className="flex justify-between mb-8">
        <div>
          <p className="text-gray-600">Date:- {order.date}</p>
        </div>
        <div>
          <p className="text-blue-600">Order ID :- # {order.id}</p>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl border-b-2 border-dashed pb-2 mb-4">5 Tar</h3>
        <div className="space-y-2">
          <div className="font-medium">Celtionic :-</div>
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between">
              <span>{item.name}</span>
              <span>
                {item.quantity} -{">"} {item.quantity}
              </span>
            </div>
          ))}
          <div className="flex justify-between font-bold border-t pt-2">
            <span>TOTAL</span>
            <span>
              {order.total} -{">"} {order.total}
            </span>
          </div>
        </div>
      </div>

      <div className="border-t-2 border-double pt-4">
        <div className="flex justify-between font-bold text-lg">
          <span>GRAND TOTAL</span>
          <span>
            {order.total} -{">"} {order.total}
          </span>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          <HiPrinter className="w-5 h-5" />
          Print
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back
        </button>
      </div>
    </motion.div>
  );
};

OrderView.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.number.isRequired,
    partyName: PropTypes.string.isRequired,
    contactPerson: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
      })
    ).isRequired,
    total: PropTypes.number.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

const Orders = () => {
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [selectedParty, setSelectedParty] = useState("All Parties");
  const [showPartyDropdown, setShowPartyDropdown] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const parties = [
    "All Parties",
    "AASHAPURI LACE",
    "AKASH LACE",
    "AUMKAR ETERPRISE",
    "BALAJI LACE",
  ];

  const orders = [
    { id: 760, partyName: "NANA MASTER", date: "2024-12-07", type: "Complete" },
    {
      id: 759,
      partyName: "MAHASAKTI ENTERPRISE",
      date: "2024-12-07",
      type: "Complete",
    },
    { id: 758, partyName: "NANA MASTER", date: "2024-12-07", type: "Complete" },
    {
      id: 757,
      partyName: "RADHE LACE HOUSE",
      date: "2024-12-07",
      type: "Complete",
    },
    {
      id: 756,
      partyName: "CHARLI CREATION",
      date: "2024-12-07",
      type: "Complete",
    },
  ];

  const handleViewOrder = (order) => {
    setSelectedOrder({
      ...order,
      contactPerson: "NANA BHAI",
      items: [{ name: "Red", quantity: 4 }],
      total: 4,
    });
  };

  if (selectedOrder) {
    return (
      <OrderView order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Manage Order</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          CSV Export
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date:
          </label>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) =>
              setDateRange({ ...dateRange, start: e.target.value })
            }
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="dd/mm/yyyy"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date:
          </label>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) =>
              setDateRange({ ...dateRange, end: e.target.value })
            }
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="dd/mm/yyyy"
          />
        </div>
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Parties:
          </label>
          <button
            onClick={() => setShowPartyDropdown(!showPartyDropdown)}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 bg-white text-left"
          >
            {selectedParty}
          </button>
          {showPartyDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
              {parties.map((party) => (
                <button
                  key={party}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                  onClick={() => {
                    setSelectedParty(party);
                    setShowPartyDropdown(false);
                  }}
                >
                  {party}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Party Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.partyName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleViewOrder(order)}
                    className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
                  >
                    View
                  </button>
                  <button className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default Orders;
