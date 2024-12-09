import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { HiX, HiUser, HiLocationMarker, HiPhone, HiMap } from "react-icons/hi";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";

const FormField = ({ label, icon: Icon, error, children }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="relative rounded-md shadow-sm">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      {children}
    </div>
    {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
  </div>
);

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  error: PropTypes.string,
  children: PropTypes.node.isRequired,
};

const AddPartyModal = ({ isEdit, party, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    route_id: "",
    contact_number: "",
  });

  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    loadRoutes();
    if (isEdit && party) {
      setFormData({
        name: party.name || "",
        address: party.address || "",
        route_id: party.route_id || "",
        contact_number: party.contact_number || "",
      });
    }
  }, [isEdit, party]);

  const loadRoutes = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from("routes")
        .select("id, name")
        .order("name");

      if (fetchError) throw fetchError;
      setRoutes(data);
    } catch (err) {
      console.error("Error loading routes:", err);
      setError("Failed to load routes");
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = "Party name is required";
    }
    if (!formData.route_id) {
      errors.route_id = "Route is required";
    }
    if (formData.contact_number && !/^\d{10}$/.test(formData.contact_number)) {
      errors.contact_number = "Please enter a valid 10-digit number";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      let result;
      if (isEdit) {
        const { data, error: updateError } = await supabase
          .from("parties")
          .update({
            name: formData.name,
            address: formData.address,
            route_id: formData.route_id,
            contact_number: formData.contact_number,
          })
          .eq("id", party.id)
          .select();

        if (updateError) throw updateError;
        result = data[0];
      } else {
        const { data, error: insertError } = await supabase
          .from("parties")
          .insert([
            {
              name: formData.name,
              address: formData.address,
              route_id: formData.route_id,
              contact_number: formData.contact_number,
            },
          ])
          .select();

        if (insertError) throw insertError;
        result = data[0];
      }

      onSave(result);
    } catch (err) {
      console.error("Error saving party:", err);
      setError("Failed to save party. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-md shadow-2xl transform transition-all">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {isEdit ? "Edit Party" : "Add New Party"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <HiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <FormField label="Party Name" icon={HiUser} error={fieldErrors.name}>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                fieldErrors.name ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter party name"
            />
          </FormField>

          <FormField
            label="Address"
            icon={HiLocationMarker}
            error={fieldErrors.address}
          >
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter address"
            />
          </FormField>

          <div className="space-y-2">
            <FormField label="Route" icon={HiMap} error={fieldErrors.route_id}>
              <select
                id="route_id"
                name="route_id"
                value={formData.route_id}
                onChange={handleChange}
                className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  fieldErrors.route_id ? "border-red-300" : "border-gray-300"
                }`}
              >
                <option value="">Select Route</option>
                {routes.map((route) => (
                  <option key={route.id} value={route.id}>
                    {route.name}
                  </option>
                ))}
              </select>
            </FormField>
            <Link
              to="/route"
              onClick={onClose}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <HiMap className="w-4 h-4" />
              Manage Routes
            </Link>
          </div>

          <FormField
            label="Contact Number"
            icon={HiPhone}
            error={fieldErrors.contact_number}
          >
            <input
              type="tel"
              id="contact_number"
              name="contact_number"
              value={formData.contact_number}
              onChange={handleChange}
              className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                fieldErrors.contact_number
                  ? "border-red-300"
                  : "border-gray-300"
              }`}
              placeholder="Enter contact number"
            />
          </FormField>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>{isEdit ? "Update" : "Add"} Party</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AddPartyModal.propTypes = {
  isEdit: PropTypes.bool,
  party: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    address: PropTypes.string,
    route_id: PropTypes.string,
    contact_number: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

AddPartyModal.defaultProps = {
  isEdit: false,
  party: null,
};

export default AddPartyModal;
