import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function Header({ busqueda = '', setBusqueda }) {
  const { totalQuantity } = useCart();
  const { usuario, esAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    const valor = e.target.value;
    if (setBusqueda) {
      setBusqueda(valor);
    }
    if (valor.trim() !== '') {
      navigate('/productos');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  return (
    <header className="ml-header">
      <div className="ml-header-content">
        <Link to="/" className="ml-logo">
          <svg
            width="28"
            height="28"
            viewBox="0 0 64 64"
            aria-hidden="true"
          >
            <path
              d="M21 22a11 11 0 0 1 22 0"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <rect
              x="10"
              y="22"
              width="44"
              height="34"
              rx="6"
              fill="currentColor"
            />
            <text
              x="32"
              y="42"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#0f172a"
              fontSize="24"
              fontWeight="900"
              fontFamily="sans-serif"
            >
              V
            </text>
          </svg>
          <span>Venta Libre</span>
        </Link>

        <div className="ml-search-bar">
          <input
            type="text"
            value={busqueda}
            onChange={handleSearchChange}
            placeholder="Buscar productos, marcas y más..."
          />
        </div>

        <nav className="ml-nav-links">
          <Link to="/">Inicio</Link>
          <Link to="/productos">Productos</Link>

          {esAdmin && <Link to="/panel">Panel Admin</Link>}

          {!usuario ? (
            <>
              <Link to="/login">Ingresar</Link>
              <Link to="/registro">Registrarse</Link>
            </>
          ) : (
            <>
              {!esAdmin && <Link to="/perfil">Mi cuenta</Link>}
              <button
                type="button"
                onClick={handleLogout}
                className="ml-logout-btn"
              >
                Salir
              </button>
            </>
          )}

          <Link to="/carrito" className="cart-link">
            🛒 Carrito <span className="cart-badge">{totalQuantity}</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
