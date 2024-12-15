import PropTypes from "prop-types";
import ColorSelection from "./ColorSelection";

const OrderForm = ({ party }) => {
  return (
    <div className="bg-white p-4">
      <ColorSelection party={party} />
    </div>
  );
};

OrderForm.propTypes = {
  party: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
  }).isRequired,
};

export default OrderForm;
