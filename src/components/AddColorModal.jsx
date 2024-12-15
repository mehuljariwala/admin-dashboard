import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { HiX, HiPlus } from "react-icons/hi";
import {
  getColorCategories,
  getColorSubcategories,
  addColorCategory,
  addColorSubcategory,
} from "../lib/supabase";

const AddColorModal = ({ isEdit, color, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    subcategory_id: "",
    stock: 0,
    min_stock: 0,
    max_stock: 100,
    color_code: "#000000",
    status: "Enable",
  });

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
  const [showNewSubcategoryForm, setShowNewSubcategoryForm] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    display_order: 0,
  });
  const [newSubcategory, setNewSubcategory] = useState({
    name: "",
    display_order: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (formData.category_id) {
      const filtered = subcategories.filter(
        (sub) => sub.category_id === parseInt(formData.category_id)
      );
      setFilteredSubcategories(filtered);
    } else {
      setFilteredSubcategories([]);
    }
  }, [formData.category_id, subcategories]);

  useEffect(() => {
    if (isEdit && color) {
      setFormData({
        name: color.name,
        category_id: color.category_id,
        subcategory_id: color.subcategory_id,
        stock: color.stock,
        min_stock: color.min_stock || 0,
        max_stock: color.max_stock || 100,
        color_code: color.color_code || "#000000",
        status: color.status,
      });
    }
  }, [isEdit, color]);

  const fetchData = async () => {
    try {
      const [categoriesData, subcategoriesData] = await Promise.all([
        getColorCategories(),
        getColorSubcategories(),
      ]);
      setCategories(categoriesData);
      setSubcategories(subcategoriesData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      stock: parseInt(formData.stock, 10),
      min_stock: parseInt(formData.min_stock, 10),
      max_stock: parseInt(formData.max_stock, 10),
      category_id: parseInt(formData.category_id),
      subcategory_id: parseInt(formData.subcategory_id),
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "category_id" ? { subcategory_id: "" } : {}),
    }));
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setLoading(true);
      const newCategoryData = await addColorCategory({
        name: newCategory.name,
        display_order: categories.length + 1,
      });
      await fetchData();
      setFormData((prev) => ({ ...prev, category_id: newCategoryData.id }));
      setShowNewCategoryForm(false);
      setNewCategory({ name: "", display_order: 0 });
    } catch (error) {
      console.error("Error adding category:", error);
      alert("Failed to add category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubcategory = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!formData.category_id) {
      alert("Please select a category first");
      return;
    }
    try {
      setLoading(true);
      const newSubcategoryData = await addColorSubcategory({
        name: newSubcategory.name,
        category_id: parseInt(formData.category_id),
        display_order: filteredSubcategories.length + 1,
      });
      await fetchData();
      setFormData((prev) => ({
        ...prev,
        subcategory_id: newSubcategoryData.id,
      }));
      setShowNewSubcategoryForm(false);
      setNewSubcategory({ name: "", display_order: 0 });
    } catch (error) {
      console.error("Error adding subcategory:", error);
      alert("Failed to add subcategory. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl w-full max-w-2xl transform transition-all duration-300 ease-in-out scale-100 shadow-2xl">
        <div className="flex justify-between items-center px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-white rounded-t-xl">
          <h2 className="text-2xl font-semibold text-gray-800">
            {isEdit ? "Edit Color" : "Add New Color"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <HiX className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="group">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200 shadow-sm hover:shadow-md"
                  placeholder="Enter color name"
                />
              </div>

              <div className="group">
                <label
                  htmlFor="color_code"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Color Code
                </label>
                <div className="flex space-x-2">
                  <input
                    type="color"
                    id="color_code"
                    name="color_code"
                    required
                    value={formData.color_code}
                    onChange={handleChange}
                    className="h-[46px] w-16 p-1 border border-gray-300 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.color_code}
                    onChange={handleChange}
                    name="color_code"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200 shadow-sm hover:shadow-md uppercase"
                    placeholder="#000000"
                    pattern="^#[0-9A-Fa-f]{6}$"
                  />
                </div>
              </div>
            </div>

            <div className="group">
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor="category_id"
                  className="block text-sm font-medium text-gray-700"
                >
                  Category
                </label>
                <button
                  type="button"
                  onClick={() => setShowNewCategoryForm(!showNewCategoryForm)}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center transition-colors duration-200 px-3 py-1 rounded-full hover:bg-blue-50"
                >
                  <HiPlus className="w-4 h-4 mr-1" />
                  Add New
                </button>
              </div>
              {showNewCategoryForm && (
                <div className="mb-3 p-4 border rounded-lg bg-blue-50 shadow-inner transition-all duration-300">
                  <div className="category-form">
                    <input
                      type="text"
                      value={newCategory.name}
                      onChange={(e) =>
                        setNewCategory({ ...newCategory, name: e.target.value })
                      }
                      placeholder="Category name"
                      className="w-full px-4 py-3 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 shadow-sm"
                      required
                    />
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowNewCategoryForm(false)}
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleAddCategory}
                        disabled={loading}
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200 shadow-sm hover:shadow-md"
                      >
                        {loading ? "Adding..." : "Add"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <select
                id="category_id"
                name="category_id"
                required
                value={formData.category_id}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200 shadow-sm hover:shadow-md"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="group">
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor="subcategory_id"
                  className="block text-sm font-medium text-gray-700"
                >
                  Subcategory
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setShowNewSubcategoryForm(!showNewSubcategoryForm)
                  }
                  disabled={!formData.category_id}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center transition-colors duration-200 px-3 py-1 rounded-full hover:bg-blue-50 disabled:opacity-50 disabled:hover:bg-transparent"
                >
                  <HiPlus className="w-4 h-4 mr-1" />
                  Add New
                </button>
              </div>
              {showNewSubcategoryForm && (
                <div className="mb-3 p-4 border rounded-lg bg-blue-50 shadow-inner transition-all duration-300">
                  <div className="subcategory-form">
                    <input
                      type="text"
                      value={newSubcategory.name}
                      onChange={(e) =>
                        setNewSubcategory({
                          ...newSubcategory,
                          name: e.target.value,
                        })
                      }
                      placeholder="Subcategory name"
                      className="w-full px-4 py-3 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 shadow-sm"
                      required
                    />
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowNewSubcategoryForm(false)}
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleAddSubcategory}
                        disabled={loading}
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200 shadow-sm hover:shadow-md"
                      >
                        {loading ? "Adding..." : "Add"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <select
                id="subcategory_id"
                name="subcategory_id"
                required
                value={formData.subcategory_id}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200 shadow-sm hover:shadow-md disabled:bg-gray-50 disabled:cursor-not-allowed"
                disabled={!formData.category_id}
              >
                <option value="">Select subcategory</option>
                {filteredSubcategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="group">
                <label
                  htmlFor="min_stock"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Minimum Stock
                </label>
                <input
                  type="number"
                  id="min_stock"
                  name="min_stock"
                  required
                  min="0"
                  value={formData.min_stock}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200 shadow-sm hover:shadow-md"
                  placeholder="Min stock"
                />
              </div>

              <div className="group">
                <label
                  htmlFor="max_stock"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Maximum Stock
                </label>
                <input
                  type="number"
                  id="max_stock"
                  name="max_stock"
                  required
                  min="0"
                  value={formData.max_stock}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200 shadow-sm hover:shadow-md"
                  placeholder="Max stock"
                />
              </div>

              <div className="group">
                <label
                  htmlFor="stock"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Current Stock
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  required
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200 shadow-sm hover:shadow-md"
                  placeholder="Current stock"
                />
              </div>
            </div>

            <div className="group">
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200 shadow-sm hover:shadow-md"
              >
                <option value="Enable">Enable</option>
                <option value="Disable">Disable</option>
              </select>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
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
    category_id: PropTypes.number,
    subcategory_id: PropTypes.number,
    stock: PropTypes.number,
    min_stock: PropTypes.number,
    max_stock: PropTypes.number,
    color_code: PropTypes.string,
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
