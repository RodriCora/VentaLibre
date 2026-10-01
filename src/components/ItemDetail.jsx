import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";

function ItemDetail() {
  const { id } = useParams();

  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);

  const { addItem } = useCart();

  useEffect(() => {
    fetch("/datos/productos.json")
      .then((res) => res.json())
      .then((data) => {
        const encontrado = data.find(
          (prod) => String(prod.id) === String(id)
        );

        setProducto(encontrado);
      })
      .catch((error) => {
        console.error("Error al cargar el producto:", error);
      });
  }, [id]);

  const aumentar = () => {
    setCantidad(cantidad + 1);
  };

  const disminuir = () => {
    if (cantidad > 1) {
      setCantidad(cantidad - 1);
    }
  };

  const agregarAlCarrito = () => {
    addItem(producto, cantidad);
    setCantidad(1);
  };

  if (!producto) {
    return (
      <section className="ml-detail-section">
        <p>Producto no encontrado.</p>
      </section>
    );
  }

  return (
    <section className="ml-detail-section">
      <div className="ml-detail-card">

        {/* IMAGEN */}
        <div className="ml-detail-image">
          <img
            src={producto.image}
            alt={producto.title}
          />
        </div>

        {/* INFORMACIÓN */}
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

          {/* CANTIDAD */}
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

          {/* AGREGAR AL CARRITO */}
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

export default ItemDetail;