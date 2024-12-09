import { useState, useRef } from "react";
import PropTypes from "prop-types";
import { HiX, HiUpload } from "react-icons/hi";

const AddSubAdminModal = ({ isEdit, subAdmin, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: subAdmin?.name || "",
    pin: subAdmin?.pin || "",
    image: subAdmin?.image || null,
    permissions: subAdmin?.permissions || {
      // Pages
      dashboard: false,
      inventory: false,
      orders: false,
      party: false,
      color: false,
      report: false,
      // Routes
      limbayat: false,
      sonal: false,
      bhatar: false,
    },
  });

  const [imagePreview, setImagePreview] = useState(subAdmin?.image || null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePermissionChange = (key) => {
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [key]: !formData.permissions[key],
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800">
            {isEdit ? "Edit Sub-Admin" : "Add New Sub-Admin"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <HiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-base"
                required
                placeholder="Enter name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Login PIN
              </label>
              <input
                type="password"
                value={formData.pin}
                onChange={(e) =>
                  setFormData({ ...formData, pin: e.target.value })
                }
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-base"
                required
                placeholder="Enter login PIN"
                maxLength={6}
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Image
              </label>
              <div className="flex items-center gap-4">
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg flex items-center gap-2 hover:border-blue-500 hover:text-blue-500"
                >
                  <HiUpload className="w-5 h-5" />
                  Upload Image
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Permissions
            </h3>

            {/* Pages */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Pages</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries({
                  dashboard: "Dashboard",
                  inventory: "Inventory",
                  orders: "Orders",
                  party: "Party",
                  color: "Color",
                  report: "Report",
                }).map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.permissions[key]}
                      onChange={() => handlePermissionChange(key)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Routes */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Routes</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries({
                  limbayat: "Limbayat",
                  sonal: "Sonal",
                  bhatar: "Bhatar",
                }).map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.permissions[key]}
                      onChange={() => handlePermissionChange(key)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-medium"
            >
              {isEdit ? "Update" : "Add"} Sub-Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AddSubAdminModal.propTypes = {
  isEdit: PropTypes.bool,
  subAdmin: PropTypes.shape({
    name: PropTypes.string,
    pin: PropTypes.string,
    image: PropTypes.string,
    permissions: PropTypes.object,
  }),
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default AddSubAdminModal;
