import { useState } from "react";
import {
  HiChartBar,
  HiCurrencyRupee,
  HiShoppingCart,
  HiUserGroup,
} from "react-icons/hi";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const Report = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("This Week");
  const periods = ["Today", "This Week", "This Month", "This Year"];

  // Sample data for charts
  const salesData = [
    { name: "Mon", sales: 4000 },
    { name: "Tue", sales: 3000 },
    { name: "Wed", sales: 2000 },
    { name: "Thu", sales: 2780 },
    { name: "Fri", sales: 1890 },
    { name: "Sat", sales: 2390 },
    { name: "Sun", sales: 3490 },
  ];

  const categoryData = [
    { name: "Cetionic", value: 400 },
    { name: "Litchy", value: 300 },
    { name: "Polyester", value: 300 },
    { name: "Multy", value: 200 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const stats = [
    {
      title: "Total Sales",
      value: "₹45,231",
      change: "+12.5%",
      icon: HiCurrencyRupee,
      color: "bg-blue-500",
    },
    {
      title: "Total Orders",
      value: "126",
      change: "+8.2%",
      icon: HiShoppingCart,
      color: "bg-green-500",
    },
    {
      title: "Active Parties",
      value: "48",
      change: "+3.1%",
      icon: HiUserGroup,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
          Reports & Analytics
        </h1>
        <div className="flex gap-2 overflow-x-auto">
          {periods.map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-md whitespace-nowrap ${
                selectedPeriod === period
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <h3 className="text-2xl font-semibold mt-1">{stat.value}</h3>
                <p
                  className={`text-sm mt-1 ${
                    stat.change.startsWith("+")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {stat.change} from last period
                </p>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Sales Trend</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#0088FE"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Sales by Category</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
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
                  {categoryData.map((entry, index) => (
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
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Top Products</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Sales
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Growth
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  { name: "Red", sales: "1,234", growth: "+12.3%" },
                  { name: "Blue", sales: "987", growth: "+8.1%" },
                  { name: "Green", sales: "756", growth: "+6.5%" },
                  { name: "Yellow", sales: "543", growth: "+4.2%" },
                ].map((product) => (
                  <tr key={product.name}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.sales}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      {product.growth}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[
              {
                type: "order",
                message: "New order from Party A",
                time: "5 minutes ago",
              },
              {
                type: "stock",
                message: "Stock updated for Red color",
                time: "1 hour ago",
              },
              {
                type: "party",
                message: "New party added: XYZ Textiles",
                time: "2 hours ago",
              },
              {
                type: "order",
                message: "Order completed for Party B",
                time: "3 hours ago",
              },
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-4">
                <div
                  className={`p-2 rounded-full ${
                    activity.type === "order"
                      ? "bg-blue-100 text-blue-600"
                      : activity.type === "stock"
                      ? "bg-green-100 text-green-600"
                      : "bg-purple-100 text-purple-600"
                  }`}
                >
                  {activity.type === "order" ? (
                    <HiShoppingCart className="w-5 h-5" />
                  ) : activity.type === "stock" ? (
                    <HiChartBar className="w-5 h-5" />
                  ) : (
                    <HiUserGroup className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
