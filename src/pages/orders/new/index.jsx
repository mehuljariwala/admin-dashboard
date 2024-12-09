import { useNavigate } from "react-router-dom";
import PartySelection from "../../../components/PartySelection";

const NewOrderPartySelection = () => {
  const navigate = useNavigate();

  const handlePartySelect = (party) => {
    // Navigate to order form with party data
    navigate("/orders/new/form", { state: { party } });
  };

  return (
    <div>
      <PartySelection
        onSelect={handlePartySelect}
        onClose={() => navigate("/orders")}
      />
    </div>
  );
};

export default NewOrderPartySelection;
