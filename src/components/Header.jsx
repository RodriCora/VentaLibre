import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="ml-header">
      <div className="ml-header-content">
        <Link to="/" className="ml-logo">VentaLibre</Link>
        <div className="ml-search-bar">
          <input type="text" placeholder="Buscar productos, marcas y más..." />
        </div>
        <nav className="ml-nav-links">
          <Link to="/">Inicio</Link>
          <Link to="/productos">Productos</Link>
          <Link to="/publicar">Publicar</Link>
          <Link to="/carrito" className="cart-link">
            🛒 Carrito <span className="cart-badge">0</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;