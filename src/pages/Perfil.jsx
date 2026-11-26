import { useEffect, useState } from 'react';
import { updateProfile } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';
import {
  obtenerPerfilUsuario,
  guardarPerfilUsuario,
} from '../firebase/productosService';
import './Registro.css';

const Perfil = () => {
  const { usuario } = useAuth();

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [codigoPostal, setCodigoPostal] = useState('');

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarDatos = async () => {
      if (!usuario?.uid) return;
      try {
        setCargando(true);
        const perfil = await obtenerPerfilUsuario(usuario.uid);
        if (perfil) {
          setNombre(perfil.nombre || '');
          setApellido(perfil.apellido || '');
          setTelefono(perfil.telefono || '');
          setDireccion(perfil.direccion || '');
          setCiudad(perfil.ciudad || '');
          setCodigoPostal(perfil.codigoPostal || '');
        } else if (usuario.displayName) {
          const partes = usuario.displayName.split(' ');
          setNombre(partes[0] || '');
          setApellido(partes.slice(1).join(' ') || '');
        }
      } catch (err) {
        console.error('Error al cargar perfil:', err);
        setError('No se pudieron cargar tus datos.');
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [usuario]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');

    if (!nombre.trim() || !apellido.trim()) {
      setError('Completá tu nombre y apellido.');
      return;
    }

    try {
      setGuardando(true);

      await updateProfile(usuario, {
        displayName: `${nombre.trim()} ${apellido.trim()}`,
      });

      await guardarPerfilUsuario(usuario.uid, {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        telefono: telefono.trim(),
        direccion: direccion.trim(),
        ciudad: ciudad.trim(),
        codigoPostal: codigoPostal.trim(),
        email: usuario.email,
      });

      setMensaje('Tus datos fueron actualizados correctamente.');
    } catch (err) {
      console.error('Error al actualizar perfil:', err);
      setError('Ocurrió un error al guardar los cambios.');
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <section className="ml-reg-section">
        <p style={{ padding: '40px', color: '#374151' }}>Cargando tu perfil...</p>
      </section>
    );
  }

  return (
    <section className="ml-reg-section">
      <div className="ml-reg-card">
        <h2 className="ml-reg-title">Mi cuenta</h2>
        <p className="ml-reg-subtitle">
          Administrá tus datos personales y tu domicilio de entrega ({usuario?.email}).
        </p>

        {error && <div className="ml-reg-error">{error}</div>}
        {mensaje && (
          <div
            style={{
              backgroundColor: '#eff6ff',
              borderLeft: '4px solid #3483fa',
              color: '#1e3a8a',
              padding: '10px 14px',
              borderRadius: '6px',
              fontSize: '0.9rem',
              marginBottom: '18px',
            }}
          >
            {mensaje}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="ml-reg-divider">Datos personales</div>

          <div className="ml-reg-row">
            <div className="ml-reg-group">
              <label htmlFor="perfil-nombre">Nombre</label>
              <input
                id="perfil-nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>

            <div className="ml-reg-group">
              <label htmlFor="perfil-apellido">Apellido</label>
              <input
                id="perfil-apellido"
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
              />
            </div>
          </div>

          <div className="ml-reg-group">
            <label htmlFor="perfil-telefono">Teléfono / WhatsApp</label>
            <input
              id="perfil-telefono"
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="Ej: 11 5555-4444"
            />
          </div>

          <div className="ml-reg-divider">Domicilio de entrega</div>

          <div className="ml-reg-group">
            <label htmlFor="perfil-direccion">Calle y altura (Piso / Depto)</label>
            <input
              id="perfil-direccion"
              type="text"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              placeholder="Ej: Av. Hipólito Yrigoyen 1234"
            />
          </div>

          <div className="ml-reg-row">
            <div className="ml-reg-group">
              <label htmlFor="perfil-ciudad">Localidad / Provincia</label>
              <input
                id="perfil-ciudad"
                type="text"
                value={ciudad}
                onChange={(e) => setCiudad(e.target.value)}
                placeholder="Ej: Avellaneda, Buenos Aires"
              />
            </div>

            <div className="ml-reg-group">
              <label htmlFor="perfil-cp">Código Postal</label>
              <input
                id="perfil-cp"
                type="text"
                value={codigoPostal}
                onChange={(e) => setCodigoPostal(e.target.value)}
                placeholder="Ej: 1870"
              />
            </div>
          </div>

          <button type="submit" className="ml-reg-btn" disabled={guardando}>
            {guardando ? 'Guardando cambios...' : 'Guardar cambios'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Perfil;
