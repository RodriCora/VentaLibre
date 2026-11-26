import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RutaProtegida = ({ children, soloAdmin = false }) => {
  const { usuario, esAdmin, cargandoAuth } = useAuth();

  if (cargandoAuth) return <p>Verificando sesión...</p>;
  if (!usuario) return <Navigate to="/login" replace />;
  if (soloAdmin && !esAdmin) return <Navigate to="/" replace />;

  return children;
};

export default RutaProtegida;