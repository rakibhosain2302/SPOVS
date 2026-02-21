import QuantityControl from "./QuantityControl";
import { useCart } from "../context/CartContext";

const ProductRow = ({ product }) => {
  const { removeProduct } = useCart();
  return (
    <tr>
      <td>{product.name}</td>
      <td>{product.category}</td>
      <td>{product.specifications}</td>
      <td className="text-success fw-bold">৳ {product.price}</td>
      <td className="d-flex justify-content-center">
        <QuantityControl product={product} />
      </td>
      <td className="fw-bold text-primary">
        ৳ {product.price * (product.quantity || 1)}
      </td>
      <td>
        <button
          className="btn btn-sm btn-danger"
          onClick={() => removeProduct(product.id)}
        >
          Remove
        </button>
      </td>
    </tr>
  );
};

export default ProductRow;