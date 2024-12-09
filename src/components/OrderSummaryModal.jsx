import PropTypes from "prop-types";
import { HiX } from "react-icons/hi";

const OrderSummaryModal = ({ order, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Order Summary</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <HiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Order ID</p>
              <p className="font-medium">{order.id}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Party Name</p>
              <p className="font-medium">{order.party}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Order Date</p>
              <p className="font-medium">{order.date}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="font-medium">{order.status}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">Items</p>
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center text-sm"
                  >
                    <span>{item.name}</span>
                    <span className="font-medium">x {item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-3">
              <div className="flex justify-between items-center">
                <p className="font-medium">Total Amount</p>
                <p className="font-semibold text-lg">₹{order.total}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t p-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

OrderSummaryModal.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.string.isRequired,
    party: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
      })
    ).isRequired,
    total: PropTypes.number.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default OrderSummaryModal;
