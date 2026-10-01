import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import ItemListContainer from './components/ItemListContainer';
import Home from './components/Home';
import ItemDetail from './components/ItemDetail';

function App() {
  const navigate = useNavigate();

  const [nuevoTitulo, setNuevoTitulo] = useState('');
  const [nuevaDesc, setNuevaDesc] = useState('');
  const [nuevoPrecio, setNuevoPrecio] = useState('');
  const [nuevaImagen, setNuevaImagen] = useState('');
  const [productosExtra, setProductosExtra] = useState([]);
  const [publicando, setPublicando] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nuevoTitulo || !nuevoPrecio) return;

    const productoNuevo = {
      id: Date.now(),
      title: nuevoTitulo,
      description: nuevaDesc || 'Sin descripción',
      price: Number(nuevoPrecio),
      image:
        nuevaImagen ||
        'https://http2.mlstatic.com/D_NQ_NP_665481-MLA48011296656_102021-O.webp'
    };

    setProductosExtra([productoNuevo, ...productosExtra]);

    setPublicando(true);

    setNuevoTitulo('');
    setNuevaDesc('');
    setNuevoPrecio('');
    setNuevaImagen('');

    setTimeout(() => {
      navigate('/productos');
      setPublicando(false);
    }, 1800);
  };

  return (
    <Layout>

      {/* CARTEL DE PUBLICACIÓN */}
      {publicando && (
        <div className="ml-publishing-overlay">
          <div className="ml-publishing-card">

            <div className="ml-loading-circle"></div>

            <h3>Publicando producto</h3>

            <p>
              Estamos agregando tu producto al catálogo...
            </p>

          </div>
        </div>
      )}

      <main className="ml-main-full">

        <Routes>

          {/* INICIO */}
          <Route
            path="/"
            element={<Home />}
          />

          {/* PRODUCTOS */}
          <Route
            path="/productos"
            element={
              <ItemListContainer
                productosExtra={productosExtra}
              />
            }
          />

          {/* DETALLE DEL PRODUCTO */}
          <Route
            path="/producto/:id"
            element={<ItemDetail />}
          />

          {/* PUBLICAR PRODUCTO */}
          <Route
            path="/publicar"
            element={
              <section className="ml-form-section">

                <div className="ml-form-card-centered">

                  <div className="ml-form-header">
                    <div>
                      <h2 style={{ textAlign: 'center' }}>
                        Publicá tu producto
                      </h2>

                      <p>
                        Completá los datos para publicar tu producto en
                        VentaLibre.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit}>

                    {/* TÍTULO */}
                    <div className="ml-input-group">
                      <label>Título del producto</label>

                      <input
                        type="text"
                        value={nuevoTitulo}
                        onChange={(e) =>
                          setNuevoTitulo(e.target.value)
                        }
                        placeholder="Ej: Notebook Lenovo IdeaPad 15"
                        required
                      />
                    </div>

                    {/* DESCRIPCIÓN */}
                    <div className="ml-input-group">
                      <label>Descripción</label>

                      <textarea
                        value={nuevaDesc}
                        onChange={(e) =>
                          setNuevaDesc(e.target.value)
                        }
                        placeholder="Contá las características, estado y detalles del producto..."
                        rows="4"
                      />
                    </div>

                    {/* PRECIO E IMAGEN */}
                    <div className="ml-form-row">

                      <div className="ml-input-group">
                        <label>Precio</label>

                        <div className="ml-price-input">
                          <span>$</span>

                          <input
                            type="number"
                            value={nuevoPrecio}
                            onChange={(e) =>
                              setNuevoPrecio(e.target.value)
                            }
                            placeholder="15000"
                            required
                          />
                        </div>
                      </div>

                      <div className="ml-input-group">
                        <label>Imagen</label>

                        <input
                          type="url"
                          value={nuevaImagen}
                          onChange={(e) =>
                            setNuevaImagen(e.target.value)
                          }
                          placeholder="URL de la imagen"
                        />
                      </div>

                    </div>

                    {/* INFORMACIÓN */}
                    <div className="ml-form-info">
                      <span>✓</span>

                      <p>
                        Revisá los datos antes de publicar tu producto.
                      </p>
                    </div>

                    {/* BOTÓN */}
                    <button
                      type="submit"
                      className="ml-btn-submit"
                    >
                      Publicar producto
                    </button>

                  </form>

                </div>

              </section>
            }
          />

          {/* CARRITO */}
          <Route
            path="/carrito"
            element={
              <div className="cart-view">
                <h2>Carrito de Compras</h2>

                <p>
                  Aún no hay productos agregados al carrito.
                </p>
              </div>
            }
          />

        </Routes>

      </main>
    </Layout>
  );
}

export default App;