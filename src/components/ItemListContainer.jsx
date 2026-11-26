import { useState, useEffect } from "react";
import Item from "./Item";
import { obtenerProductos } from "../firebase/productosService";

const PRODUCTOS_POR_PAGINA = 6;

function ItemListContainer({ productosExtra = [], busqueda = "" }) {
  const [catalogo, setCatalogo] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setCargando(true);
        setError("");
        const productosFirestore = await obtenerProductos();
        setCatalogo(Array.isArray(productosFirestore) ? productosFirestore : []);
      } catch (err) {
        console.error("Error al cargar el catálogo desde Firestore:", err);
        setError("No se pudieron cargar los productos. Verificá tu conexión.");
        setCatalogo([]);
      } finally {
        setCargando(false);
      }
    };

    cargarProductos();
  }, []);

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda]);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [paginaActual]);

  const catalogoCompleto = [...productosExtra, ...catalogo].filter(Boolean);

  const textoBusqueda = busqueda.toLowerCase().trim();

  const productosFiltrados = catalogoCompleto.filter((producto) => {
    if (!textoBusqueda) return true;
    const titulo = (producto.title || producto.nombre || "").toLowerCase();
    const descripcion = (producto.description || "").toLowerCase();
    return titulo.includes(textoBusqueda) || descripcion.includes(textoBusqueda);
  });

  const totalPaginas = Math.ceil(productosFiltrados.length / PRODUCTOS_POR_PAGINA);
  const indiceInicio = (paginaActual - 1) * PRODUCTOS_POR_PAGINA;
  const productosPaginados = productosFiltrados.slice(
    indiceInicio,
    indiceInicio + PRODUCTOS_POR_PAGINA
  );

  if (cargando) {
    return (
      <section className="ml-products-section">
        <div className="ml-container">
          <p style={{ textAlign: "center", padding: "40px" }}>
            Cargando catálogo...
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="ml-products-section">
        <div className="ml-container">
          <p style={{ textAlign: "center", padding: "40px", color: "red" }}>
            {error}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="ml-products-section">
      <div className="ml-container">
        <h2>Catálogo de Productos</h2>

        {productosFiltrados.length === 0 ? (
          <p style={{ textAlign: "center", padding: "40px" }}>
            {textoBusqueda
              ? `No se encontraron productos para "${busqueda}".`
              : "No hay productos disponibles."}
          </p>
        ) : (
          <>
            <div className="ml-products-grid">
              {productosPaginados.map((productoIndividual) => (
                <Item
                  key={productoIndividual.id}
                  prod={productoIndividual}
                />
              ))}
            </div>

            {totalPaginas > 1 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px",
                  marginTop: "32px",
                  flexWrap: "wrap",
                }}
              >
                <button
                  type="button"
                  onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
                  disabled={paginaActual === 1}
                  style={{ padding: "8px 12px", cursor: "pointer" }}
                >
                  Anterior
                </button>

                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setPaginaActual(num)}
                    style={{
                      padding: "8px 12px",
                      fontWeight: paginaActual === num ? "bold" : "normal",
                      backgroundColor: paginaActual === num ? "#222" : "#eee",
                      color: paginaActual === num ? "#fff" : "#000",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    {num}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))
                  }
                  disabled={paginaActual === totalPaginas}
                  style={{ padding: "8px 12px", cursor: "pointer" }}
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

ItemListContainer.displayName = "ItemListContainer";

export default ItemListContainer;
