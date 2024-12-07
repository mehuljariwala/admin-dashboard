import { useState } from "react";
import { motion } from "framer-motion";
import { HiSearch } from "react-icons/hi";
import { MdPendingActions, MdDoneAll, MdDirectionsRun } from "react-icons/md";
import PropTypes from "prop-types";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  Legend,
  ResponsiveContainer,
} from "recharts";
import OrderForm from "../components/OrderForm";
import PartySelection from "../components/PartySelection";

const PartyCard = ({ name, address, onSelect }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
    onClick={onSelect}
  >
    <h3 className="font-medium text-blue-600">{name}</h3>
    <p className="text-sm text-gray-600">{address}</p>
  </motion.div>
);

PartyCard.propTypes = {
  name: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${color}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-semibold mt-1">{value}</p>
      </div>
      <Icon className={`w-8 h-8 ${color.replace("border", "text")}`} />
    </div>
  </div>
);

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  icon: PropTypes.elementType.isRequired,
  color: PropTypes.string.isRequired,
};

const COLORS = ["#0088FE", "#FFBB28", "#00C49F"];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("RUNNING");
  const [selectedParty, setSelectedParty] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPartySelection, setShowPartySelection] = useState(false);

  const parties = {
    LIMBAYAT: [
      { name: "GURUDEV LACE", address: "169 JAY NARAYAN" },
      { name: "DEVANSH LACE", address: "JIVASERI" },
      { name: "DEVANSH LACE (M)", address: "MADHU NAGAR" },
      { name: "BALAJI LACE", address: "4/11 KHATODRA" },
      { name: "BHAGYALAXMI LACE", address: "51 MAHAPRABHU NAGAR" },
      { name: "CHARLI CREATION", address: "2/2939 BHARUCHAWADI" },
    ],
    SONAL: [
      { name: "URVI IMPEX", address: "DHARAM" },
      { name: "NEHA CREATION", address: "91-92 SONAL" },
      { name: "AASHAPURI LACE", address: "38 LALWALA" },
      { name: "AKASH LACE", address: "868 SONAL-2" },
      { name: "AUMKAR ETERPRISE", address: "200 AMBICA" },
    ],
    BHATAR: [
      { name: "BHAVINI CREATION", address: "69 NAVSARJAN" },
      { name: "DARPAN LACE", address: "9 VISHAL" },
      { name: "SHREE SAI KRUPA TEXTILE", address: "41 RADHEKRISHNA" },
      { name: "SURYA LACE", address: "10 NAVSARJAN" },
      { name: "CASH", address: "CASH" },
    ],
  };

  const stats = [
    {
      title: "Running Orders",
      value: 12,
      icon: MdDirectionsRun,
      color: "border-blue-500",
    },
    {
      title: "Pending Orders",
      value: 5,
      icon: MdPendingActions,
      color: "border-yellow-500",
    },
    {
      title: "Completed Orders",
      value: 28,
      icon: MdDoneAll,
      color: "border-green-500",
    },
  ];

  // Chart Data
  const orderStatusData = [
    { name: "Running", value: 12 },
    { name: "Pending", value: 5 },
    { name: "Completed", value: 28 },
  ];

  const ordersByRouteData = [
    { name: "LIMBAYAT", orders: 20 },
    { name: "SONAL", orders: 15 },
    { name: "BHATAR", orders: 10 },
  ];

  const orderTrendsData = [
    { name: "Mon", orders: 8 },
    { name: "Tue", orders: 12 },
    { name: "Wed", orders: 15 },
    { name: "Thu", orders: 10 },
    { name: "Fri", orders: 18 },
    { name: "Sat", orders: 20 },
    { name: "Sun", orders: 16 },
  ];

  const filterParties = (routeParties) => {
    if (!searchQuery) return routeParties;
    return routeParties.filter(
      (party) =>
        party.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        party.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleNewOrder = () => {
    setShowPartySelection(true);
  };

  const handlePartySelect = (party) => {
    setSelectedParty(party);
    setShowPartySelection(false);
  };

  if (selectedParty) {
    return (
      <OrderForm party={selectedParty} onClose={() => setSelectedParty(null)} />
    );
  }

  const tabIcons = {
    RUNNING: <MdDirectionsRun className="w-5 h-5" />,
    PENDING: <MdPendingActions className="w-5 h-5" />,
    COMPLETE: <MdDoneAll className="w-5 h-5" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Order Status Pie Chart */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4">
            Order Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={orderStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {orderStatusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Orders by Route Bar Chart */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4">Orders by Route</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ordersByRouteData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Order Trends Line Chart */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4">Weekly Order Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={orderTrendsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="orders" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Header with Search and Tabs */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex space-x-4 border-b md:border-none">
            {["RUNNING", "PENDING", "COMPLETE"].map((tab) => (
              <button
                key={tab}
                className={`py-2 px-4 flex items-center space-x-2 rounded-md transition-colors ${
                  activeTab === tab
                    ? "text-white bg-blue-600"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tabIcons[tab]}
                <span>{tab}</span>
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-auto">
            <input
              type="text"
              placeholder="Search parties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <HiSearch
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
        </div>
      </div>

      {/* Route List */}
      <div className="space-y-8">
        {Object.entries(parties).map(([routeName, routeParties]) => {
          const filteredParties = filterParties(routeParties);
          if (searchQuery && filteredParties.length === 0) return null;

          return (
            <div
              key={routeName}
              className="bg-white p-6 rounded-lg shadow-md space-y-4"
            >
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                {routeName}
              </h2>
              {filteredParties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredParties.map((party) => (
                    <PartyCard
                      key={party.name}
                      name={party.name}
                      address={party.address}
                      onSelect={() => handlePartySelect(party)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 py-4">No parties in this route.</p>
              )}
            </div>
          );
        })}
      </div>

      {/* New Order Button */}
      <div className="fixed bottom-8 right-8">
        <button
          onClick={handleNewOrder}
          className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <span className="text-2xl">+</span>
          <span>New Order</span>
        </button>
      </div>

      {/* Party Selection Modal */}
      {showPartySelection && (
        <PartySelection
          onSelect={handlePartySelect}
          onClose={() => setShowPartySelection(false)}
        />
      )}
    </motion.div>
  );
};

export default Dashboard;
