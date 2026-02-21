import { useCart } from "../context/CartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

const QuantityControl = ({ product }) => {
  const { increase, decrease } = useCart();

  return (
    <div className="d-flex align-items-center gap-2">
      <button
        className="btn btn-dark btn-sm"
        onClick={() => decrease(product.id)}
        disabled={product.quantity <= 1}
      >
        <FontAwesomeIcon icon={faMinus} />
      </button>

      <span className="px-2">{product.quantity || 1}</span>

      <button
        className="btn btn-dark btn-sm"
        onClick={() => increase(product.id)}
      >
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </div>
  );
};

export default QuantityControl;