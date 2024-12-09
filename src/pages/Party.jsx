import { useState, useEffect } from "react";
import { HiSearch, HiDotsVertical } from "react-icons/hi";
import AddPartyModal from "../components/AddPartyModal";
import {
  getParties,
  addParty,
  updateParty,
  deleteParty,
} from "../lib/supabase";

const Party = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingParty, setEditingParty] = useState(null);
  const [showActions, setShowActions] = useState(null);
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadParties();
  }, []);

  const loadParties = async () => {
    try {
      setLoading(true);
      const data = await getParties();
      setParties(data);
      setError(null);
    } catch (err) {
      console.error("Error loading parties:", err);
      setError("Failed to load parties. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const filteredParties = parties.filter(
    (party) =>
      party.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      party.route.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddParty = () => {
    setEditingParty(null);
    setShowModal(true);
  };

  const handleEditParty = (party) => {
    setEditingParty(party);
    setShowModal(true);
    setShowActions(null);
  };

  const handleDeleteParty = async (id) => {
    if (window.confirm("Are you sure you want to delete this party?")) {
      try {
        await deleteParty(id);
        setParties(parties.filter((party) => party.id !== id));
      } catch (err) {
        console.error("Error deleting party:", err);
        alert("Failed to delete party. Please try again later.");
      }
    }
    setShowActions(null);
  };

  const handleSaveParty = async (formData) => {
    try {
      if (editingParty) {
        const updatedParty = await updateParty(editingParty.id, formData);
        setParties(
          parties.map((party) =>
            party.id === editingParty.id ? updatedParty : party
          )
        );
      } else {
        const newParty = await addParty(formData);
        setParties([newParty, ...parties]);
      }
      setShowModal(false);
    } catch (err) {
      console.error("Error saving party:", err);
      alert("Failed to save party. Please try again later.");
    }
  };

  const handleExportCSV = () => {
    const headers = ["Id,Name,Route,Status"];
    const csvData = parties.map(
      (party) => `${party.id},${party.name},${party.route},${party.status}`
    );
    const csvContent = [...headers, ...csvData].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "parties.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  return (
    <div className="p-4 md:p-6">
      {/* Header - Mobile Responsive */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
          Manage Party
        </h1>
        <div className="flex flex-col md:flex-row w-full md:w-auto gap-3">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search here..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <HiSearch
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddParty}
              className="flex-1 md:flex-none px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Party
            </button>
            <button
              onClick={handleExportCSV}
              className="flex-1 md:flex-none px-4 py-2 bg-blue-400 text-white rounded-md hover:bg-blue-500"
            >
              CSV Export
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden">
        {filteredParties.map((party) => (
          <div key={party.id} className="bg-white rounded-lg shadow mb-4 p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">{party.name}</h3>
                <p className="text-sm text-gray-600">ID: {party.id}</p>
                <p className="text-sm text-gray-600">Route: {party.route}</p>
                <span
                  className={`mt-2 inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                    party.status === "Enable"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {party.status}
                </span>
              </div>
              <div className="relative">
                <button
                  onClick={() =>
                    setShowActions(showActions === party.id ? null : party.id)
                  }
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <HiDotsVertical className="w-5 h-5 text-gray-500" />
                </button>
                {showActions === party.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                    <button
                      onClick={() => handleEditParty(party)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteParty(party.id)}
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
                Id
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Route
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
            {filteredParties.map((party) => (
              <tr key={party.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {party.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {party.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {party.route}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                      party.status === "Enable"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {party.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleEditParty(party)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteParty(party.id)}
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

      {/* Add/Edit Party Modal */}
      {showModal && (
        <AddPartyModal
          isEdit={!!editingParty}
          party={editingParty}
          onClose={() => setShowModal(false)}
          onSave={handleSaveParty}
        />
      )}
    </div>
  );
};

export default Party;
