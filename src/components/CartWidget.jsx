import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';

function CartWidget() {
  const { totalQuantity } = useContext(CartContext);

  return (
    <Link to="/carrito" className="cart-link">
      🛒 Carrito <span className="cart-badge">{totalQuantity}</span>
    </Link>
  );
}

export default CartWidget;