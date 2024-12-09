import { useState } from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

const Login = ({ onLogin }) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const validatePin = () => {
    const storedPin = import.meta.env.VITE_2FA_PIN;
    return pin === storedPin;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!pin) {
      setError("PIN is required");
      return;
    }

    if (validatePin()) {
      onLogin();
    } else {
      setError("Invalid PIN");
    }
  };

  const handlePinChange = (e) => {
    const value = e.target.value;
    if (value.length <= 6) {
      // Limit PIN to 6 digits
      setPin(value);
      setError("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-600 mt-2">
            Please enter your PIN to continue
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-gray-700 text-sm font-bold mb-2">
              PIN
            </label>
            <input
              type="number"
              value={pin}
              onChange={handlePinChange}
              className={`w-full px-4 py-3 rounded-lg border ${
                error ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
              placeholder="Enter 6-digit PIN"
              maxLength={6}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-semibold
                hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                transform transition-all duration-300 hover:scale-[1.02]"
            >
              Login
            </button>
          </motion.div>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-gray-600">Demo PIN: 123456</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default Login;
