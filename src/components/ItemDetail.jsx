import { useState } from "react";
import { useCart } from "../context/CartContext";

function ItemDetail({ producto }) {
  const [cantidad, setCantidad] = useState(1);
  const { addItem } = useCart();

  // Evita que la pantalla se rompa si todavía no llegó el producto
  if (!producto) {
    return (
      <section className="ml-detail-section">
        <p style={{ textAlign: "center", padding: "40px" }}>
          Producto no encontrado.
        </p>
      </section>
    );
  }

  const aumentar = () => {
    setCantidad((cantidadActual) => cantidadActual + 1);
  };

  const disminuir = () => {
    setCantidad((cantidadActual) =>
      cantidadActual > 1 ? cantidadActual - 1 : 1
    );
  };

  const agregarAlCarrito = () => {
    addItem(producto, cantidad);
    setCantidad(1);
  };

  return (
    <section className="ml-detail-section">
      <div className="ml-detail-card">

        <div className="ml-detail-image">
          <img
            src={producto.image}
            alt={producto.title}
          />
        </div>

        <div className="ml-detail-info">
          <span className="ml-detail-price">
            ${producto.price}
          </span>

          <h1>{producto.title}</h1>

          <p className="ml-detail-description">
            {producto.description}
          </p>

          <span className="ml-envio">
            Envío gratis
          </span>

          <div className="ml-detail-quantity">
            <span>Cantidad:</span>

            <div className="ml-quantity-controls">
              <button
                type="button"
                onClick={disminuir}
              >
                −
              </button>

              <span>{cantidad}</span>

              <button
                type="button"
                onClick={aumentar}
              >
                +
              </button>
            </div>
          </div>

          <button
            type="button"
            className="ml-detail-cart-btn"
            onClick={agregarAlCarrito}
          >
            🛒 Agregar al carrito
          </button>
        </div>

      </div>
    </section>
  );
}

ItemDetail.displayName = "ItemDetail";

export default ItemDetail;