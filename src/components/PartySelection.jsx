import { useState } from "react";
import { motion } from "framer-motion";
import { HiSearch } from "react-icons/hi";
import PropTypes from "prop-types";

const PartySelection = ({ onSelect, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoute, setSelectedRoute] = useState("LIMBAYAT");

  const parties = {
    LIMBAYAT: [
      { name: "GURUDEV LACE", address: "169 JAY NARAYAN" },
      { name: "DEVANSH LACE", address: "JIVASERI" },
      { name: "DEVANSH LACE (M)", address: "MADHU NAGAR" },
      { name: "BALAJI LACE", address: "4/11 KHATODRA" },
      { name: "BHAGYALAXMI LACE", address: "51 MAHAPRABHU NAGAR" },
      { name: "CHARLI CREATION", address: "2/2939 BHARUCHAWADI" },
      { name: "DEVENDRA KINARIWALA", address: "KHAODRA" },
      { name: "DHANASSHREE CREATION", address: "R K ESTET" },
      { name: "GREEN FEATHER", address: "25 YAMUNA" },
      { name: "K T C", address: "KTC ANJANAFARM" },
      { name: "NANA MASTER", address: "NANA BHAI" },
      { name: "NISHIKA LACE", address: "211 JARI KASAB" },
      { name: "RADHE LACE HOUSE", address: "23 MAHAPRBHU NAGAR" },
      { name: "RADHE KRISHNA LACE", address: "63 CHIMANI TEKRO" },
      { name: "SAPTARSUNGI CREATION", address: "GREY JALAIWALA" },
      { name: "SHIVAY ENTERPRISE", address: "24 MODELSCHOOL" },
      { name: "KRUSHNA TEXTILE", address: "MANILA DAYING" },
      { name: "GREEN FEATHER (175)", address: "175 YAMUNA" },
      { name: "SUNNYBHAI GALIYAWAL", address: "29 JAGNATH" },
      { name: "DENMARK LACE", address: "VASANWALA COMPOUND" },
    ],
    SONAL: [
      { name: "URVI IMPEX", address: "DHARAM" },
      { name: "NEHA CREATION", address: "91-92 SONAL" },
      { name: "AASHAPURI LACE", address: "38 LALWALA" },
      { name: "AKASH LACE", address: "868 SONAL-2" },
      { name: "AUMKAR ETERPRISE", address: "200 AMBICA" },
      { name: "GANESH LACE", address: "78 THAKOR NAGAR" },
      { name: "HARIOM ENT (JUGALBHAI)", address: "1 MARGIWALA COMPOUND" },
      { name: "JANAK KUMAR", address: "216 AATMANAND" },
      { name: "JAY MAHALAXMI LACE", address: "3 RAMKRISHNA" },
      { name: "JAY SAI HUB", address: "CHAYA ENGINEER" },
      { name: "KANTA DIWASALIWALA", address: "A 380 , PRAMUKPARK" },
      { name: "KHODAL ENTERPRISE", address: "2 AMBICA" },
      { name: "MAYURI LACE(SAKTI)", address: "80 SAKTINAGAR" },
      { name: "MAYURI LACE(BHID B)", address: "219 BHIBHANJAN" },
      { name: "SAI LACE", address: "200 AMIBICA" },
      { name: "SAKTI LACE", address: "11 RAMCHODNAGAR" },
      { name: "SHREE MAHALAXMI LACE", address: "93 SONAL" },
      { name: "SHREE MAHALAXMI(KAMALBHAI)", address: "198 DEVENDRANAGAR" },
      { name: "YASI IMPEX", address: "61 SONAL" },
      { name: "DIMPAL LACE", address: "209 SAKTI NAGAR" },
      { name: "MAHASAKTI ENTERPRISE", address: "87 SONAL-2" },
      { name: "SILVER LACE", address: "53 LALWALA" },
    ],
    BHATAR: [
      { name: "BHAVINI CREATION", address: "69 NAVSARJAN" },
      { name: "DARPAN LACE", address: "9 VISHAL" },
      { name: "SHREE SAI KRUPA TEXTILE", address: "41 RADHEKRISHNA" },
      { name: "SURYA LACE", address: "10 NAVSARJAN" },
      { name: "CASH", address: "CASH" },
      { name: "RISHIKA CREATION", address: "200 JAGANNATH" },
    ],
  };

  const filterParties = (routeParties) => {
    if (!searchQuery) return routeParties;
    return routeParties.filter(
      (party) =>
        party.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        party.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-6 max-w-6xl mx-auto w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Select Party</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Search and Route Selection */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="flex space-x-4">
            {Object.keys(parties).map((route) => (
              <button
                key={route}
                className={`px-4 py-2 rounded-md transition-colors ${
                  selectedRoute === route
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => setSelectedRoute(route)}
              >
                {route}
              </button>
            ))}
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search parties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-md w-full md:w-64 focus:ring-2 focus:ring-blue-500"
            />
            <HiSearch
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
        </div>

        {/* Party Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filterParties(parties[selectedRoute]).map((party) => (
            <motion.div
              key={party.name}
              whileHover={{ scale: 1.02 }}
              className="p-4 border rounded-lg cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onSelect(party)}
            >
              <h3 className="font-medium text-blue-600">{party.name}</h3>
              <p className="text-sm text-gray-600">{party.address}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

PartySelection.propTypes = {
  onSelect: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default PartySelection;
