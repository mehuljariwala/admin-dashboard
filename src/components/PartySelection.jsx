import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { HiSearch, HiX, HiPlus } from "react-icons/hi";
import { supabase } from "../lib/supabase";
import AddPartyModal from "./AddPartyModal";

const PartySelection = ({ onSelect, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [parties, setParties] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [partiesResult, routesResult] = await Promise.all([
        supabase
          .from("parties")
          .select(
            `
            id,
            name,
            address,
            contact_number,
            route_id,
            routes (
              id,
              name
            )
          `
          )
          .order("name"),
        supabase.from("routes").select("id, name").order("name"),
      ]);

      if (partiesResult.error) throw partiesResult.error;
      if (routesResult.error) throw routesResult.error;

      setParties(partiesResult.data);
      setRoutes(routesResult.data);
      setSelectedRoute(routesResult.data[0]?.id || null);
      setError(null);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddParty = async () => {
    setShowAddModal(false);
    await loadData(); // Refresh the list after adding new party
  };

  const filterParties = () => {
    return parties.filter((party) => {
      const matchesRoute = selectedRoute
        ? party.route_id === selectedRoute
        : true;
      if (!searchQuery) return matchesRoute;

      const searchLower = searchQuery.toLowerCase();
      return (
        matchesRoute &&
        (party.name.toLowerCase().includes(searchLower) ||
          party.address?.toLowerCase().includes(searchLower))
      );
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="h-full md:h-auto md:max-h-[90vh] bg-white md:rounded-lg md:mx-auto md:my-8 md:max-w-4xl overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-4 py-4 flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800">
            Select Party
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <HiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Search and Route Selection */}
        <div className="p-4 border-b">
          <div className="flex justify-between items-center mb-4">
            <div className="relative flex-1 mr-4">
              <input
                type="text"
                placeholder="Search parties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <HiSearch
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              <HiPlus className="w-5 h-5 mr-1" />
              Add Party
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {routes.map((route) => (
              <button
                key={route.id}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedRoute === route.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setSelectedRoute(route.id)}
              >
                {route.name}
              </button>
            ))}
          </div>
        </div>

        {/* Party Grid */}
        <div
          className="overflow-y-auto p-4"
          style={{ maxHeight: "calc(100vh - 200px)" }}
        >
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading parties...</p>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 py-8">
              {error}
              <button
                onClick={loadData}
                className="block mx-auto mt-2 text-blue-500 hover:text-blue-600"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterParties().map((party) => (
                <button
                  key={party.id}
                  className="text-left p-4 border rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={() => onSelect(party)}
                >
                  <h3 className="font-medium text-blue-600">{party.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {party.address || "No address"}
                  </p>
                  {party.contact_number && (
                    <p className="text-sm text-gray-500 mt-1">
                      Contact: {party.contact_number}
                    </p>
                  )}
                </button>
              ))}
              {filterParties().length === 0 && !loading && (
                <p className="text-center text-gray-500 py-8 col-span-full">
                  No parties found
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <AddPartyModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddParty}
        />
      )}
    </div>
  );
};

PartySelection.propTypes = {
  onSelect: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default PartySelection;
