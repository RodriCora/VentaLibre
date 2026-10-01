import { useState, useEffect } from "react";
import Item from "./Item";

function ItemListContainer({ productosExtra = [] }) {
  const [catalogo, setCatalogo] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setCargando(true);

        const baseUrl = import.meta.env.BASE_URL;
        const rutaJson = `${baseUrl.endsWith("/") ? baseUrl : baseUrl + "/"}datos/productos.json`;

        const response = await fetch(rutaJson);

        if (!response.ok) {
          throw new Error("No se pudo cargar el archivo de productos");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("El archivo productos.json no contiene una lista válida");
        }

        setCatalogo(data);
      } catch (error) {
        console.error("Error al cargar el catálogo:", error);
        setCatalogo([]);
      } finally {
        setCargando(false);
      }
    };

    cargarProductos();
  }, []);

  const catalogoCompleto = [
    ...productosExtra,
    ...catalogo,
  ].filter((producto) => producto);

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

  return (
    <section className="ml-products-section">
      <div className="ml-container">
        <h2>Catálogo de Productos</h2>

        {catalogoCompleto.length === 0 ? (
          <p style={{ textAlign: "center", padding: "40px" }}>
            No hay productos disponibles.
          </p>
        ) : (
          <div className="ml-products-grid">
            {catalogoCompleto.map((productoIndividual) => (
              <Item
                key={productoIndividual.id}
                prod={productoIndividual}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

ItemListContainer.displayName = "ItemListContainer";

export default ItemListContainer;