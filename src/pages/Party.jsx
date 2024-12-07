import { useState } from "react";
import { HiSearch } from "react-icons/hi";
import AddPartyModal from "../components/AddPartyModal";

const Party = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingParty, setEditingParty] = useState(null);
  const [parties, setParties] = useState([
    { id: 49, name: "SILVER LACE", route: "SONAL", status: "Enable" },
    { id: 48, name: "MAHASAKTI ENTERPRISE", route: "SONAL", status: "Enable" },
    { id: 47, name: "DENMARK LACE", route: "LIMBAYAT", status: "Enable" },
    { id: 46, name: "DIMPAL LACE", route: "SONAL", status: "Enable" },
    { id: 45, name: "RISHIKA CREATION", route: "BHATAR", status: "Enable" },
    {
      id: 44,
      name: "SUNNYBHAI GALIYAWAL",
      route: "LIMBAYAT",
      status: "Enable",
    },
    {
      id: 43,
      name: "GREEN FEATHER (175)",
      route: "LIMBAYAT",
      status: "Enable",
    },
    { id: 42, name: "KRUSHNA TEXTILE", route: "LIMBAYAT", status: "Enable" },
    { id: 41, name: "CASH", route: "BHATAR", status: "Enable" },
    { id: 40, name: "YASI IMPEX", route: "SONAL", status: "Enable" },
    { id: 39, name: "SURYA LACE", route: "BHATAR", status: "Enable" },
    {
      id: 38,
      name: "SHREE SAI KRUPA TEXTILE",
      route: "BHATAR",
      status: "Enable",
    },
    {
      id: 37,
      name: "SHREE MAHALAXMI(KAMALBHAI)",
      route: "SONAL",
      status: "Enable",
    },
    { id: 36, name: "SHREE MAHALAXMI LACE", route: "SONAL", status: "Enable" },
    { id: 35, name: "SHIVAY ENTERPRISE", route: "LIMBAYAT", status: "Enable" },
    {
      id: 34,
      name: "SAPTARSUNGI CREATION",
      route: "LIMBAYAT",
      status: "Enable",
    },
    { id: 33, name: "SAKTI LACE", route: "SONAL", status: "Enable" },
    { id: 32, name: "SAI LACE", route: "SONAL", status: "Enable" },
  ]);

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
  };

  const handleDeleteParty = (id) => {
    if (window.confirm("Are you sure you want to delete this party?")) {
      setParties(parties.filter((party) => party.id !== id));
    }
  };

  const handleSaveParty = (formData) => {
    if (editingParty) {
      // Update existing party
      setParties(
        parties.map((party) =>
          party.id === editingParty.id ? { ...party, ...formData } : party
        )
      );
    } else {
      // Add new party
      const newParty = {
        id: Math.max(...parties.map((p) => p.id)) + 1,
        ...formData,
      };
      setParties([newParty, ...parties]);
    }
  };

  const handleExportCSV = () => {
    // Convert parties data to CSV format
    const headers = ["Id,Name,Route,Status"];
    const csvData = parties.map(
      (party) => `${party.id},${party.name},${party.route},${party.status}`
    );
    const csvContent = [...headers, ...csvData].join("\n");

    // Create and trigger download
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

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Manage Party</h1>
        <div className="flex gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search here..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-md w-64 focus:ring-2 focus:ring-blue-500"
            />
            <HiSearch
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
          <button
            onClick={handleAddParty}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Party
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-blue-400 text-white rounded-md hover:bg-blue-500"
          >
            CSV Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
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
