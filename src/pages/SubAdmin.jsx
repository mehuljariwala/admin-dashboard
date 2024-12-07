import { useState } from "react";
import { motion } from "framer-motion";
import { HiSearch } from "react-icons/hi";
import PropTypes from "prop-types";

const SubAdminForm = ({ isEdit = false, initialData = null, onClose }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    password: initialData?.password || "",
    email: initialData?.email || "",
    image: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          {isEdit ? "Edit Sub Admin" : "Add Sub Admin"}
        </h2>
        <button
          onClick={onClose}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name :-
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            password :-
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            email :-
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Image :-
            <span className="text-red-500 text-xs ml-1">
              (Recommended resolution: 300x300,400x400 or Square Image)
            </span>
          </label>
          <input
            type="file"
            onChange={(e) =>
              setFormData({ ...formData, image: e.target.files[0] })
            }
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            accept="image/*"
          />
          {isEdit && (
            <div className="mt-2">
              <img
                src="/path/to/current/image.jpg"
                alt="Current profile"
                className="w-full max-w-md rounded-md"
              />
            </div>
          )}
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

SubAdminForm.propTypes = {
  isEdit: PropTypes.bool,
  initialData: PropTypes.shape({
    name: PropTypes.string,
    password: PropTypes.string,
    email: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
};

const SubAdmin = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const subAdmins = [
    {
      id: 6,
      name: "PRAMOD",
      password: "1234",
      email: "bantyjariwala@gmail.com",
    },
    {
      id: 5,
      name: "BHAGAT",
      password: "1234",
      email: "bantyjariwala@gmail.com",
    },
    {
      id: 4,
      name: "RADHE",
      password: "1234",
      email: "bantyjariwala@gmail.com",
    },
    {
      id: 3,
      name: "PAPPA",
      password: "PAPPA",
      email: "bantyjariwala@gmail.com",
    },
    {
      id: 2,
      name: "sub_admin",
      password: "sub_admin",
      email: "sub_admin@gmail.com",
    },
  ];

  const handleEdit = (admin) => {
    setSelectedAdmin(admin);
    setShowEditForm(true);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setShowEditForm(false);
    setSelectedAdmin(null);
  };

  if (showAddForm) {
    return <SubAdminForm onClose={handleCloseForm} />;
  }

  if (showEditForm && selectedAdmin) {
    return (
      <SubAdminForm
        isEdit
        initialData={selectedAdmin}
        onClose={handleCloseForm}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">
          Manage Sub Admin
        </h1>
        <div className="flex gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search here..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <HiSearch
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Add Sub Admin
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
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Password
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {subAdmins.map((admin) => (
              <tr key={admin.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {admin.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {admin.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {admin.password}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {admin.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleEdit(admin)}
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

export default SubAdmin;
