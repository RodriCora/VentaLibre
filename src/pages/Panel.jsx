import { useEffect, useState } from 'react';
import './Panel.css';
import {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from '../firebase/productosService';

const estadoInicial = {
  title: '',
  description: '',
  price: '',
  image: '',
};

const ITEMS_POR_PAGINA = 6;

const esUrlValida = (url) => {
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

const conTimeout = (promesa, ms = 8000) =>
  Promise.race([
    promesa,
    new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error('Firestore tardó demasiado en responder (timeout).')),
        ms
      )
    ),
  ]);

const Panel = () => {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState(estadoInicial);
  const [editandoId, setEditandoId] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [filtro, setFiltro] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);

  const cargarProductos = async () => {
    try {
      setCargando(true);
      const lista = await conTimeout(obtenerProductos(), 8000);
      setProductos(lista);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      setMensaje(error.message || 'No se pudieron cargar los productos desde Firestore.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
    setPaginaActual(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');

    if (!form.title.trim()) {
      setMensaje('Completá el título del producto.');
      return;
    }

    const precioNumero = Number(form.price);
    if (!form.price || Number.isNaN(precioNumero) || precioNumero <= 0) {
      setMensaje('Ingresá un precio mayor a 0.');
      return;
    }

    if (!esUrlValida(form.image)) {
      setMensaje('Ingresá una URL de imagen válida (empezando con http:// o https://).');
      return;
    }

    const datosLimpios = {
      title: form.title.trim(),
      description: form.description.trim() || 'Sin descripción',
      price: precioNumero,
      image: form.image.trim(),
    };

    try {
      setEnviando(true);
      if (editandoId) {
        await conTimeout(actualizarProducto(editandoId, datosLimpios), 8000);
        setMensaje('Producto actualizado correctamente.');
      } else {
        await conTimeout(crearProducto(datosLimpios), 8000);
        setMensaje('Producto creado en Firestore.');
        setPaginaActual(1);
      }
      setForm(estadoInicial);
      setEditandoId(null);
      await cargarProductos();
    } catch (error) {
      console.error('Error al guardar producto:', error);
      setMensaje(error.message || 'Error al guardar el producto.');
    } finally {
      setEnviando(false);
    }
  };

  const handleEditar = (prod) => {
    setEditandoId(prod.id);
    setForm({
      title: prod.title || '',
      description: prod.description || '',
      price: prod.price ?? '',
      image: prod.image || '',
    });
    setMensaje(`Editando: ${prod.title}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelarEdicion = () => {
    setEditandoId(null);
    setForm(estadoInicial);
    setMensaje('');
  };

  const handleEliminar = async (id, title) => {
    const confirmar = window.confirm(
      `¿Estás seguro de que querés eliminar "${title}"?`
    );
    if (!confirmar) return;

    try {
      setEnviando(true);
      await conTimeout(eliminarProducto(id), 8000);
      setMensaje('Producto eliminado.');
      if (editandoId === id) {
        setEditandoId(null);
        setForm(estadoInicial);
      }
      await cargarProductos();
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      setMensaje(error.message || 'Error al eliminar el producto.');
    } finally {
      setEnviando(false);
    }
  };

  const textoFiltro = filtro.toLowerCase().trim();
  const productosFiltrados = productos.filter((prod) => {
    if (!textoFiltro) return true;
    const titulo = (prod.title || '').toLowerCase();
    const desc = (prod.description || '').toLowerCase();
    return titulo.includes(textoFiltro) || desc.includes(textoFiltro);
  });

  const totalPaginas = Math.ceil(productosFiltrados.length / ITEMS_POR_PAGINA);
  const paginaSegura = Math.min(paginaActual, Math.max(1, totalPaginas));
  const inicio = (paginaSegura - 1) * ITEMS_POR_PAGINA;
  const productosVisibles = productosFiltrados.slice(inicio, inicio + ITEMS_POR_PAGINA);

  return (
    <section className="panel-admin">
      <div className="panel-header">
        <h2>Panel de Administración</h2>
        <span className="panel-badge-count">
          {productos.length} {productos.length === 1 ? 'producto' : 'productos'} en catálogo
        </span>
      </div>

      {mensaje && <p className="panel-mensaje">{mensaje}</p>}

      <form onSubmit={handleSubmit} className="panel-form" noValidate>
        <h3 className="panel-form-title">
          {editandoId ? '✏️ Editar producto existente' : '➕ Publicar nuevo producto'}
        </h3>

        <div className="panel-form-grid">
          <div className="panel-field">
            <label htmlFor="title">Título del producto</label>
            <input
              id="title"
              type="text"
              name="title"
              placeholder="Ej: Difusor aromático de varillas"
              value={form.title}
              onChange={handleChange}
            />
          </div>

          <div className="panel-field">
            <label htmlFor="price">Precio ($)</label>
            <input
              id="price"
              type="number"
              name="price"
              placeholder="Ej: 3500"
              value={form.price}
              onChange={handleChange}
            />
          </div>

          <div className="panel-field panel-field-full">
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              name="description"
              rows="2"
              placeholder="Detallá las características principales del producto..."
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="panel-field panel-field-full">
            <label htmlFor="image">URL de la imagen</label>
            <input
              id="image"
              type="url"
              name="image"
              placeholder="https://..."
              value={form.image}
              onChange={handleChange}
            />

            {esUrlValida(form.image) && (
              <div className="panel-preview-box">
                <img
                  src={form.image.trim()}
                  alt="Vista previa"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <span>Vista previa de la imagen ingresada</span>
              </div>
            )}
          </div>
        </div>

        <div className="panel-acciones-form">
          <button
            type="submit"
            className="panel-btn-primario"
            disabled={enviando}
          >
            {enviando
              ? 'Guardando...'
              : editandoId
                ? 'Guardar cambios'
                : 'Agregar producto'}
          </button>
          {editandoId && (
            <button
              type="button"
              onClick={handleCancelarEdicion}
              className="panel-btn-secundario"
              disabled={enviando}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="panel-list-toolbar">
        <h3>Productos publicados ({productosFiltrados.length})</h3>
        <input
          type="text"
          className="panel-search-input"
          placeholder="Buscar en el panel..."
          value={filtro}
          onChange={handleFiltroChange}
        />
      </div>

      {cargando ? (
        <p>Cargando productos...</p>
      ) : productosFiltrados.length === 0 ? (
        <p>
          {textoFiltro
            ? `No hay productos que coincidan con "${filtro}".`
            : 'Todavía no hay productos cargados en Firestore.'}
        </p>
      ) : (
        <>
          <div className="panel-lista">
            {productosVisibles.map((prod) => (
              <div key={prod.id} className="panel-item">
                <div className="panel-item-izq">
                  {prod.image && (
                    <img
                      src={prod.image}
                      alt={prod.title}
                      className="panel-item-img"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  <div className="panel-item-info">
                    <div className="panel-item-top">
                      <strong>{prod.title}</strong>
                      <span className="panel-item-price">${prod.price}</span>
                    </div>
                    <div className="panel-item-desc">{prod.description}</div>
                  </div>
                </div>
                <div className="panel-item-botones">
                  <button
                    type="button"
                    onClick={() => handleEditar(prod)}
                    className="panel-btn-editar"
                    disabled={enviando}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEliminar(prod.id, prod.title)}
                    className="panel-btn-eliminar"
                    disabled={enviando}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {totalPaginas > 1 && (
            <div className="panel-paginacion">
              <button
                type="button"
                className="panel-page-btn"
                onClick={() => setPaginaActual((p) => Math.max(1, p - 1))}
                disabled={paginaSegura === 1}
              >
                Anterior
              </button>
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  type="button"
                  className={`panel-page-btn ${paginaSegura === num ? 'active' : ''}`}
                  onClick={() => setPaginaActual(num)}
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                className="panel-page-btn"
                onClick={() => setPaginaActual((p) => Math.min(totalPaginas, p + 1))}
                disabled={paginaSegura === totalPaginas}
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default Panel;