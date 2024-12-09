import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { HiX } from "react-icons/hi";

const AddColorModal = ({ isEdit, color, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    stock: 0,
    status: "Enable",
  });

  const categories = ["Cetionic", "Litchy", "Polyester", "Multy"];

  useEffect(() => {
    if (isEdit && color) {
      setFormData({
        name: color.name,
        category: color.category,
        stock: color.stock,
        status: color.status,
      });
    }
  }, [isEdit, color]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      stock: parseInt(formData.stock, 10),
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            {isEdit ? "Edit Color" : "Add New Color"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <HiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Color Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Enter color name"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="stock"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Stock
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                required
                value={formData.stock}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Enter stock quantity"
              />
            </div>

            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="Enable">Enable</option>
                <option value="Disable">Disable</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              {isEdit ? "Update" : "Add"} Color
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AddColorModal.propTypes = {
  isEdit: PropTypes.bool,
  color: PropTypes.shape({
    name: PropTypes.string,
    category: PropTypes.string,
    stock: PropTypes.number,
    status: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

AddColorModal.defaultProps = {
  isEdit: false,
  color: null,
};

export default AddColorModal;
