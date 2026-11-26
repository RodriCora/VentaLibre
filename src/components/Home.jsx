import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { obtenerProductos } from '../firebase/productosService';
import './Home.css';

function Home() {
  const { usuario, esAdmin } = useAuth();
  const [destacados, setDestacados] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDestacados = async () => {
      try {
        const lista = await obtenerProductos();
        const mezclados = [...lista].sort(() => Math.random() - 0.5);
        setDestacados(mezclados.slice(0, 4));
      } catch (error) {
        console.error('Error al cargar destacados:', error);
      } finally {
        setCargando(false);
      }
    };

    cargarDestacados();
  }, []);

  return (
    <section className="home-wrapper">
      {/* 1. BANNER PRINCIPAL ANCHO Y EQUILIBRADO */}
      <div className="home-hero-banner">
        <div className="home-hero-text">
          <span className="home-hero-badge">Tienda online · Envíos a todo el país</span>
          <h1>Todo lo que buscás para tu espacio, en un solo lugar</h1>
          <p>
            Explorá nuestro catálogo de aromaterapia, decoración y bienestar.
            Comprá rápido, seguí tu carrito en tiempo real y recibí tu pedido sin moverte de tu casa.
          </p>

          <div className="home-hero-buttons">
            <Link to="/productos" className="home-btn-primary">
              Explorar catálogo
            </Link>

            {!usuario ? (
              <Link to="/login" className="home-btn-secondary">
                Ingresar a mi cuenta
              </Link>
            ) : esAdmin ? (
              <Link to="/panel" className="home-btn-secondary">
                Ir al Panel Admin
              </Link>
            ) : (
              <Link to="/carrito" className="home-btn-secondary">
                Ver mi carrito
              </Link>
            )}
          </div>
        </div>

        <div className="home-hero-highlights">
          <div className="home-highlight-item">
            <div className="home-highlight-icon">🚚</div>
            <div>
              <strong>Envío gratis</strong>
              <span>En productos seleccionados del catálogo</span>
            </div>
          </div>

          <div className="home-highlight-item">
            <div className="home-highlight-icon">⚡</div>
            <div>
              <strong>Compra ágil y directa</strong>
              <span>Agregá al carrito y confirmá tu orden al instante</span>
            </div>
          </div>

          <div className="home-highlight-item">
            <div className="home-highlight-icon">🛡️</div>
            <div>
              <strong>Catálogo actualizado</strong>
              <span>Stock y precios gestionados en tiempo real</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. PRODUCTOS DESTACADOS ALINEADOS AL MISMO ANCHO */}
      <div className="home-featured-section">
        <div className="home-featured-header">
          <h2>Productos destacados</h2>
          <Link to="/productos" className="home-featured-link">
            Ver catálogo completo →
          </Link>
        </div>

        {cargando ? (
          <p className="home-featured-loading">Cargando productos...</p>
        ) : (
          <div className="home-featured-grid">
            {destacados.map((prod) => (
              <Link
                key={prod.id}
                to={`/producto/${prod.id}`}
                className="home-featured-card"
              >
                <div className="home-featured-img-box">
                  <img src={prod.image} alt={prod.title} />
                </div>

                <div className="home-featured-body">
                  <div>
                    <div className="home-featured-price">${prod.price}</div>
                    <div className="home-featured-title">{prod.title}</div>
                  </div>
                  <span className="home-featured-shipping">Envío gratis</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* 3. TARJETAS DE CONFIANZA INFERIORES */}
      <div className="home-benefits-grid">
        <div className="home-benefit-card">
          <span>🛒</span>
          <div>
            <h3>Elegí tus productos</h3>
            <p>Filtrá por nombre o descripción y armá tu carrito a medida.</p>
          </div>
        </div>

        <div className="home-benefit-card">
          <span>💳</span>
          <div>
            <h3>Confirmá tu orden</h3>
            <p>Iniciá sesión y registrá tu pedido con comprobante inmediato.</p>
          </div>
        </div>

        <div className="home-benefit-card">
          <span>📦</span>
          <div>
            <h3>Recibilo en tu puerta</h3>
            <p>Despacho rápido y seguimiento de cada compra realizada.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;
