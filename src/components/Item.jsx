import { useState } from "react";
import { useCart } from "../context/CartContext";

function Item({ prod }) {
  const [cantidad, setCantidad] = useState(1);
  const { addItem } = useCart();

  const aumentar = () => {
    setCantidad(cantidad + 1);
  };

  const disminuir = () => {
    if (cantidad > 1) {
      setCantidad(cantidad - 1);
    }
  };

  const agregarAlCarrito = () => {
    addItem(prod, cantidad);
    setCantidad(1);
  };

  return (
    <div className="ml-card">
      <div className="ml-card-img-container">
        <img
          src={prod.image}
          alt={prod.title}
          className="ml-card-img"
        />
      </div>

      <div className="ml-card-body">
        <span className="ml-price">${prod.price}</span>

        <p className="ml-title">{prod.title}</p>

        <p className="ml-desc">{prod.description}</p>

        <span className="ml-envio">Envío gratis</span>

        <div className="ml-quantity">
          <span>Cantidad:</span>

          <div className="ml-quantity-controls">
            <button type="button" onClick={disminuir}>
              −
            </button>

            <span>{cantidad}</span>

            <button type="button" onClick={aumentar}>
              +
            </button>
          </div>
        </div>

        <button
          type="button"
          className="ml-add-cart"
          onClick={agregarAlCarrito}
        >
          🛒 Agregar al carrito
        </button>
      </div>
    </div>
  );
}

export default Item;