import { useState, useRef } from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

const Login = ({ onLogin }) => {
  const [pins, setPins] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const inputRefs = useRef([]);

  const validatePin = () => {
    const storedPin = import.meta.env.VITE_2FA_PIN;
    return pins.join("") === storedPin;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (pins.some((digit) => !digit)) {
      setError("All PIN digits are required");
      return;
    }

    if (validatePin()) {
      onLogin();
    } else {
      setError("Invalid PIN");
    }
  };

  const handlePinChange = (value, index) => {
    const newValue = value.replace(/[^0-9]/g, "");
    if (newValue.length <= 1) {
      const newPins = [...pins];
      newPins[index] = newValue;
      setPins(newPins);
      setError("");

      // Auto-focus next input
      if (newValue.length === 1 && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !pins[index] && index > 0) {
      // Focus previous input on backspace if current input is empty
      inputRefs.current[index - 1].focus();
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
            <div className="flex gap-2 justify-between">
              {pins.map((pin, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  value={pin}
                  onChange={(e) => handlePinChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className={`w-12 h-12 text-center text-xl rounded-lg border 
                    ${error ? "border-red-500" : "border-gray-300"}
                    focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                  maxLength={1}
                />
              ))}
            </div>
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
