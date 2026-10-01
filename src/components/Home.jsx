import { Link } from 'react-router-dom';

function Home() {
  return (
    <section className="ml-home">

      <div className="ml-home-hero">
        <h1>Bienvenido a VentaLibre</h1>

        <p>
          Comprá, vendé y encontrá lo que necesitás
          de manera simple y segura.
        </p>

        <div className="ml-home-buttons">
          <Link to="/productos" className="ml-home-btn primary">
            Ver productos
          </Link>

          <Link to="/publicar" className="ml-home-btn secondary">
            Publicar producto
          </Link>
        </div>
      </div>

      <div className="ml-home-features">

        <div className="ml-home-feature">
          <span>🛒</span>
          <h3>Comprá fácil</h3>
          <p>Encontrá productos de forma rápida y sencilla.</p>
        </div>

        <div className="ml-home-feature">
          <span>📦</span>
          <h3>Vendé tus productos</h3>
          <p>Publicá tus productos y llegá a nuevos compradores.</p>
        </div>

        <div className="ml-home-feature">
          <span>🔒</span>
          <h3>Experiencia segura</h3>
          <p>Una plataforma simple pensada para comprar y vender.</p>
        </div>

      </div>

    </section>
  );
}

export default Home;