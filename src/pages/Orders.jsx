import { useState, useEffect } from "react";
import {
  HiSearch,
  HiDotsVertical,
  HiClock,
  HiCheck,
  HiX,
  HiFilter,
} from "react-icons/hi";
import OrderSummaryModal from "../components/OrderSummaryModal";
import { getOrders, updateOrderStatus, deleteOrder } from "../lib/supabase";

const Orders = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showActions, setShowActions] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedParty, setSelectedParty] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const statuses = ["All", "Pending", "Processing", "Completed", "Cancelled"];
  const parties = ["All", "GURUDEV LACE", "DEVANSH LACE", "BALAJI LACE"];

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrders();
      // Transform the data to match the component's expected structure
      const transformedOrders = data.map((order) => ({
        id: order.id,
        party: order.party.name,
        date: order.date,
        items: order.order_items.map((item) => ({
          name: item.color.name,
          quantity: item.quantity,
        })),
        total: order.total,
        status: order.status,
      }));
      setOrders(transformedOrders);
      setError(null);
    } catch (err) {
      console.error("Error loading orders:", err);
      setError("Failed to load orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error("Error updating order status:", err);
      alert("Failed to update order status. Please try again later.");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await deleteOrder(orderId);
        setOrders(orders.filter((order) => order.id !== orderId));
      } catch (err) {
        console.error("Error deleting order:", err);
        alert("Failed to delete order. Please try again later.");
      }
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.party.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "All" || order.status === selectedStatus;
    const matchesParty =
      selectedParty === "All" || order.party === selectedParty;
    const matchesDateRange =
      (!startDate || order.date >= startDate) &&
      (!endDate || order.date <= endDate);

    return matchesSearch && matchesStatus && matchesParty && matchesDateRange;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Processing":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <HiClock className="w-4 h-4" />;
      case "Processing":
        return <HiFilter className="w-4 h-4" />;
      case "Completed":
        return <HiCheck className="w-4 h-4" />;
      case "Cancelled":
        return <HiX className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
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
          Orders
        </h1>
        <div className="flex flex-col md:flex-row w-full md:w-auto gap-3">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <HiSearch
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            New Order
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Party
          </label>
          <select
            value={selectedParty}
            onChange={(e) => setSelectedParty(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          >
            {parties.map((party) => (
              <option key={party} value={party}>
                {party}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-4">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900">{order.id}</h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusIcon(order.status)}
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{order.party}</p>
                <p className="text-sm text-gray-600">{order.date}</p>

                {/* Order Items */}
                <div className="mt-3 space-y-1">
                  {order.items.map((item, index) => (
                    <div key={index} className="text-sm">
                      {item.name} x {item.quantity}
                    </div>
                  ))}
                  <div className="text-sm font-medium">
                    Total: ₹{order.total}
                  </div>
                </div>
              </div>

              <div className="relative">
                <button
                  onClick={() =>
                    setShowActions(showActions === order.id ? null : order.id)
                  }
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <HiDotsVertical className="w-5 h-5 text-gray-500" />
                </button>
                {showActions === order.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                    <button
                      onClick={() => handleViewOrder(order)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(order.id, "Processing")}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Update Status
                    </button>
                    <button
                      onClick={() => handleDeleteOrder(order.id)}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Cancel Order
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
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Party
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
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
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {order.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.party}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.date}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="space-y-1">
                    {order.items.map((item, index) => (
                      <div key={index}>
                        {item.name} x {item.quantity}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₹{order.total}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusIcon(order.status)}
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleViewOrder(order)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(order.id, "Processing")}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDeleteOrder(order.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Summary Modal */}
      {selectedOrder && (
        <OrderSummaryModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default Orders;
