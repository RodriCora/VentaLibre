import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import {
  crearOrden,
  obtenerPerfilUsuario,
} from '../firebase/productosService';
import './CartView.css';

const CartView = () => {
  const {
    cart,
    incrementItem,
    decrementItem,
    removeItem,
    clearCart,
    totalPrice,
    totalQuantity,
  } = useCart();

  const { usuario } = useAuth();
  const navigate = useNavigate();

  const [perfil, setPerfil] = useState(null);
  const [compraFinalizada, setCompraFinalizada] = useState(null);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarDatosEnvio = async () => {
      if (!usuario?.uid) {
        setPerfil(null);
        return;
      }
      try {
        const datos = await obtenerPerfilUsuario(usuario.uid);
        setPerfil(datos);
      } catch (err) {
        console.error('Error al cargar datos de envío:', err);
      }
    };

    cargarDatosEnvio();
  }, [usuario]);

  const handleFinalizarCompra = async () => {
    if (!usuario) {
      navigate('/login');
      return;
    }

    if (!perfil?.direccion || !perfil?.ciudad) {
      setError('Completá tu domicilio de entrega en "Mi cuenta" antes de finalizar la compra.');
      return;
    }

    try {
      setProcesando(true);
      setError('');

      const nuevaOrden = {
        comprador: {
          email: usuario.email,
          uid: usuario.uid,
          nombre: `${perfil.nombre || ''} ${perfil.apellido || ''}`.trim() || usuario.displayName || '',
          telefono: perfil.telefono || '',
        },
        envio: {
          direccion: perfil.direccion,
          ciudad: perfil.ciudad,
          codigoPostal: perfil.codigoPostal || '',
        },
        items: cart.map((prod) => ({
          id: prod.id,
          title: prod.title,
          price: Number(prod.price),
          quantity: prod.quantity,
        })),
        total: totalPrice,
      };

      const idOrden = await crearOrden(nuevaOrden);

      setCompraFinalizada({
        orden: idOrden,
        email: usuario.email,
        total: totalPrice,
        envio: nuevaOrden.envio,
        destinatario: nuevaOrden.comprador.nombre,
      });
      clearCart();
    } catch (err) {
      console.error('Error al generar la orden:', err);
      setError('No se pudo procesar la compra. Intentá nuevamente.');
    } finally {
      setProcesando(false);
    }
  };

  if (compraFinalizada) {
    return (
      <section className="cart-card cart-empty-box">
        <div className="cart-empty-icon">✅</div>
        <h2>¡Gracias por tu compra!</h2>
        <p>
          Tu pedido fue registrado para <strong>{compraFinalizada.email}</strong>.
        </p>
        <div className="cart-order-details">
          <div>Número de orden: <strong>{compraFinalizada.orden}</strong></div>
          <div>Total abonado: <strong>${compraFinalizada.total}</strong></div>
          {compraFinalizada.envio && (
            <div style={{ marginTop: '8px', fontSize: '0.9rem' }}>
              Envío a: <strong>{compraFinalizada.envio.direccion}</strong> ({compraFinalizada.envio.ciudad})
            </div>
          )}
        </div>
        <Link to="/productos" className="cart-btn-primary">
          Seguir comprando
        </Link>
      </section>
    );
  }

  if (cart.length === 0) {
    return (
      <section className="cart-card cart-empty-box">
        <div className="cart-empty-icon">🛒</div>
        <h2>Tu carrito está vacío</h2>
        <p>Explorá nuestro catálogo y agregá los productos que más te gusten.</p>
        <Link to="/productos" className="cart-btn-primary">
          Descubrir productos
        </Link>
      </section>
    );
  }

  return (
    <section className="cart-page">
      <h2 className="cart-page-title">
        Carrito de Compras ({totalQuantity}{' '}
        {totalQuantity === 1 ? 'producto' : 'productos'})
      </h2>

      {error && (
        <p style={{ color: '#dc2626', marginBottom: '16px', fontWeight: '500' }}>
          {error}
        </p>
      )}

      <div className="cart-grid">
        <div className="cart-card">
          {cart.map((prod) => (
            <div key={prod.id} className="cart-item-row">
              <div className="cart-item-info">
                {prod.image && (
                  <img
                    src={prod.image}
                    alt={prod.title}
                    className="cart-item-img"
                  />
                )}
                <div>
                  <Link to={`/producto/${prod.id}`} className="cart-item-title">
                    {prod.title}
                  </Link>
                  <div className="cart-item-unit">
                    Precio unitario: ${prod.price}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(prod.id)}
                    className="cart-remove-btn"
                    disabled={procesando}
                  >
                    Eliminar
                  </button>
                </div>
              </div>

              <div className="cart-item-actions">
                <div className="cart-qty-box">
                  <button
                    type="button"
                    onClick={() => decrementItem(prod.id)}
                    className="cart-qty-btn"
                    disabled={procesando}
                  >
                    −
                  </button>
                  <span className="cart-qty-num">{prod.quantity}</span>
                  <button
                    type="button"
                    onClick={() => incrementItem(prod.id)}
                    className="cart-qty-btn"
                    disabled={procesando}
                  >
                    +
                  </button>
                </div>

                <div className="cart-item-subtotal">
                  ${Number(prod.price) * prod.quantity}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-card cart-summary">
          <h3 className="cart-summary-title">Resumen de compra</h3>

          {/* BLOQUE DE DATOS DE ENVÍO DEL USUARIO */}
          {usuario && (
            <div className="cart-shipping-box">
              <div className="cart-shipping-header">
                <strong>🚚 Datos de envío</strong>
                <Link to="/perfil" className="cart-shipping-edit">
                  Modificar
                </Link>
              </div>

              {perfil?.direccion ? (
                <>
                  <div>
                    Recibe: <strong>{perfil.nombre} {perfil.apellido}</strong>
                  </div>
                  <div>{perfil.direccion}</div>
                  <div>
                    {perfil.ciudad} {perfil.codigoPostal ? `(CP ${perfil.codigoPostal})` : ''}
                  </div>
                  {perfil.telefono && <div>Tel: {perfil.telefono}</div>}
                </>
              ) : (
                <div className="cart-shipping-missing">
                  Aún no cargaste tu dirección.{' '}
                  <Link to="/perfil" className="cart-shipping-edit">
                    Completar ahora
                  </Link>
                </div>
              )}
            </div>
          )}

          <div className="cart-summary-row">
            <span>Productos ({totalQuantity})</span>
            <span>${totalPrice}</span>
          </div>

          <div className="cart-summary-row cart-summary-free">
            <span>Envío</span>
            <span>Gratis</span>
          </div>

          <div className="cart-summary-total">
            <span>Total</span>
            <span>${totalPrice}</span>
          </div>

          <button
            type="button"
            onClick={handleFinalizarCompra}
            className="cart-btn-primary"
            disabled={procesando}
          >
            {procesando
              ? 'Procesando compra...'
              : usuario
                ? 'Finalizar compra'
                : 'Iniciá sesión para comprar'}
          </button>

          <button
            type="button"
            onClick={clearCart}
            className="cart-btn-clear"
            disabled={procesando}
          >
            Vaciar carrito
          </button>
        </div>
      </div>
    </section>
  );
};

export default CartView;
