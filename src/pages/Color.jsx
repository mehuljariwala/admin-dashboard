import { useState } from "react";
import { motion } from "framer-motion";
import { HiSearch, HiPlus } from "react-icons/hi";
import PropTypes from "prop-types";

const ColorForm = ({ isEdit = false, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    category: "",
    subCategory: "",
    minStock: "",
    maxStock: "",
    stock: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-6 mb-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          {isEdit ? "Edit Colour" : "Add Colour"}
        </h2>
        <button
          onClick={onClose}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Back
        </button>
      </div>

      <form className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Colour Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Colour Code
            </label>
            <input
              type="color"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              className="w-full p-1 border rounded-md h-10"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Category</option>
              <option value="5 Tar">5 Tar</option>
              <option value="3 Tar">3 Tar</option>
              <option value="Yarn">Yarn</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sub Category
            </label>
            <select
              name="subCategory"
              value={formData.subCategory}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Sub Category</option>
              <option value="Celtionic">Celtionic</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Stock
            </label>
            <input
              type="number"
              name="minStock"
              value={formData.minStock}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Stock
            </label>
            <input
              type="number"
              name="maxStock"
              value={formData.maxStock}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
};

ColorForm.propTypes = {
  isEdit: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};

const Color = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [colors] = useState([
    {
      id: 1,
      category: "5 Tar",
      subCategory: "Celtionic",
      name: "Red",
      code: "#ff0000",
      stock: 2,
      status: "Enable",
    },
    {
      id: 2,
      category: "3 Tar",
      subCategory: "Celtionic",
      name: "Red",
      code: "#ff0000",
      stock: 18,
      status: "Enable",
    },
    {
      id: 3,
      category: "Yarn",
      subCategory: "Celtionic",
      name: "Red",
      code: "#ff0000",
      stock: 7,
      status: "Enable",
    },
    {
      id: 4,
      category: "5 Tar",
      subCategory: "Celtionic",
      name: "Rani",
      code: "#f716ec",
      stock: 7,
      status: "Enable",
    },
  ]);

  const handleCloseForm = () => {
    setShowAddForm(false);
    setShowEditForm(false);
  };

  if (showAddForm) {
    return <ColorForm onClose={handleCloseForm} />;
  }

  if (showEditForm) {
    return <ColorForm isEdit={true} onClose={handleCloseForm} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Manage Colour</h1>
        <div className="flex gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search here..."
              className="pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <HiSearch
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <HiPlus size={20} />
            Add Colour
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            CSV Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Id
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sub Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Colour Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Colour Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Colour Stock
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
            {colors.map((color) => (
              <tr key={color.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {color.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {color.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {color.subCategory}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {color.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div
                      className="w-6 h-6 rounded mr-2 border border-gray-200"
                      style={{ backgroundColor: color.code }}
                    ></div>
                    <span className="text-sm text-gray-500">{color.code}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {color.stock}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {color.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => setShowEditForm(true)}
                    className="text-white bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded"
                  >
                    Edit
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

export default Color;
