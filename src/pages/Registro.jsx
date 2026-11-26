import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { updateProfile } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';
import { guardarPerfilUsuario } from '../firebase/productosService';
import './Registro.css';

const Registro = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [codigoPostal, setCodigoPostal] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const { registro } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!nombre.trim() || !apellido.trim()) {
      setError('Completá tu nombre y apellido.');
      return;
    }

    if (!telefono.trim()) {
      setError('Ingresá un teléfono de contacto.');
      return;
    }

    if (!direccion.trim() || !ciudad.trim() || !codigoPostal.trim()) {
      setError('Completá tu dirección, ciudad y código postal para los envíos.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setError('Ingresá un correo electrónico válido.');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (password !== confirmarPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (!aceptaTerminos) {
      setError('Debés aceptar los términos y condiciones para continuar.');
      return;
    }

    setCargando(true);
    try {
      const credencial = await registro(email.trim(), password);

      if (credencial?.user) {
        await updateProfile(credencial.user, {
          displayName: `${nombre.trim()} ${apellido.trim()}`,
        });

        await guardarPerfilUsuario(credencial.user.uid, {
          nombre: nombre.trim(),
          apellido: apellido.trim(),
          telefono: telefono.trim(),
          direccion: direccion.trim(),
          ciudad: ciudad.trim(),
          codigoPostal: codigoPostal.trim(),
          email: email.trim(),
        });
      }

      navigate('/');
    } catch (err) {
      if (err?.code === 'auth/email-already-in-use') {
        setError('Este correo ya está registrado. Probá iniciar sesión.');
      } else {
        setError('No se pudo crear la cuenta. Verificá los datos ingresados.');
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <section className="ml-reg-section">
      <div className="ml-reg-card">
        <h2 className="ml-reg-title">Completá tus datos para crear tu cuenta</h2>
        <p className="ml-reg-subtitle">
          Necesitamos tus datos personales y domicilio para coordinar tus envíos.
        </p>

        {error && <div className="ml-reg-error">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="ml-reg-divider">Datos personales</div>

          <div className="ml-reg-row">
            <div className="ml-reg-group">
              <label htmlFor="nombre">Nombre</label>
              <input
                id="nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Juan"
              />
            </div>

            <div className="ml-reg-group">
              <label htmlFor="apellido">Apellido</label>
              <input
                id="apellido"
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                placeholder="Ej: Perez"
              />
            </div>
          </div>

          <div className="ml-reg-row">
            <div className="ml-reg-group">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
              />
            </div>

            <div className="ml-reg-group">
              <label htmlFor="telefono">Teléfono / WhatsApp</label>
              <input
                id="telefono"
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="Ej: 11 5555-4444"
              />
            </div>
          </div>

          <div className="ml-reg-divider">Domicilio de entrega</div>

          <div className="ml-reg-group">
            <label htmlFor="direccion">Calle y altura (Piso / Depto)</label>
            <input
              id="direccion"
              type="text"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              placeholder="Ej: Av. Hipólito Yrigoyen 1234, Piso 2 B"
            />
          </div>

          <div className="ml-reg-row">
            <div className="ml-reg-group">
              <label htmlFor="ciudad">Localidad / Provincia</label>
              <input
                id="ciudad"
                type="text"
                value={ciudad}
                onChange={(e) => setCiudad(e.target.value)}
                placeholder="Ej: Avellaneda, Buenos Aires"
              />
            </div>

            <div className="ml-reg-group">
              <label htmlFor="codigoPostal">Código Postal</label>
              <input
                id="codigoPostal"
                type="text"
                value={codigoPostal}
                onChange={(e) => setCodigoPostal(e.target.value)}
                placeholder="Ej: 1870"
              />
            </div>
          </div>

          <div className="ml-reg-divider">Seguridad</div>

          <div className="ml-reg-row">
            <div className="ml-reg-group">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div className="ml-reg-group">
              <label htmlFor="confirmarPassword">Repetir contraseña</label>
              <input
                id="confirmarPassword"
                type="password"
                value={confirmarPassword}
                onChange={(e) => setConfirmarPassword(e.target.value)}
                placeholder="Repetí tu contraseña"
              />
            </div>
          </div>

          <label className="ml-reg-terms">
            <input
              type="checkbox"
              checked={aceptaTerminos}
              onChange={(e) => setAceptaTerminos(e.target.checked)}
            />
            <span>
              Acepto los Términos y Condiciones y autorizo el uso de mis datos de acuerdo a la Declaración de Privacidad de VentaLibre.
            </span>
          </label>

          <button type="submit" className="ml-reg-btn" disabled={cargando}>
            {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <div className="ml-reg-footer">
          ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
        </div>
      </div>
    </section>
  );
};

export default Registro;
