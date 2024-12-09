import { useState, useEffect } from "react";
import {
  getColors,
  getInventoryTransactions,
  addInventoryTransaction,
} from "../lib/supabase";
import { format } from "date-fns";
import Shimmer from "../components/Shimmer";

export default function Inventory() {
  const [colors, setColors] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    color_id: "",
    quantity: "",
    transaction_type: "IN",
    reference_type: "ADJUSTMENT",
    notes: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [colorsData, transactionsData] = await Promise.all([
        getColors(),
        getInventoryTransactions(),
      ]);
      setColors(colorsData);
      setTransactions(transactionsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addInventoryTransaction({
        ...formData,
        quantity: parseInt(formData.quantity),
      });
      setShowAddModal(false);
      setFormData({
        color_id: "",
        quantity: "",
        transaction_type: "IN",
        reference_type: "ADJUSTMENT",
        notes: "",
      });
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading)
    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Inventory Management</h1>
          <button
            disabled
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 opacity-50 cursor-not-allowed"
          >
            Add Transaction
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold mb-4">Current Stock Levels</h2>
            <Shimmer rows={4} />
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
            <Shimmer rows={4} />
          </div>
        </div>
      </div>
    );

  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Transaction
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Current Stock Levels</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Color</th>
                  <th className="px-4 py-2 text-left">Category</th>
                  <th className="px-4 py-2 text-left">Stock</th>
                </tr>
              </thead>
              <tbody>
                {colors.map((color) => (
                  <tr key={color.id}>
                    <td className="px-4 py-2">{color.name}</td>
                    <td className="px-4 py-2">{color.category}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded ${
                          color.stock > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {color.stock}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Color</th>
                  <th className="px-4 py-2 text-left">Type</th>
                  <th className="px-4 py-2 text-left">Quantity</th>
                  <th className="px-4 py-2 text-left">Notes</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-4 py-2">
                      {format(new Date(transaction.created_at), "dd/MM/yyyy")}
                    </td>
                    <td className="px-4 py-2">{transaction.color.name}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded ${
                          transaction.transaction_type === "IN"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {transaction.transaction_type}
                      </span>
                    </td>
                    <td className="px-4 py-2">{transaction.quantity}</td>
                    <td className="px-4 py-2">{transaction.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add Transaction</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Color
                </label>
                <select
                  value={formData.color_id}
                  onChange={(e) =>
                    setFormData({ ...formData, color_id: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a color</option>
                  {colors.map((color) => (
                    <option key={color.id} value={color.id}>
                      {color.name} ({color.category})
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Transaction Type
                </label>
                <select
                  value={formData.transaction_type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      transaction_type: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="IN">Stock In</option>
                  <option value="OUT">Stock Out</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows="3"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Add Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
