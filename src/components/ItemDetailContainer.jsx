import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ItemDetail from "./ItemDetail";

function ItemDetailContainer() {
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);

  const { id } = useParams();

  useEffect(() => {
    const cargarProducto = async () => {
      try {
        setCargando(true);
        setProducto(null);

        const baseUrl = import.meta.env.BASE_URL;
        const rutaJson = `${baseUrl.endsWith("/") ? baseUrl : baseUrl + "/"}datos/productos.json`;

        const response = await fetch(rutaJson);

        if (!response.ok) {
          throw new Error("No se pudo cargar el archivo de productos");
        }

        const data = await response.json();

        const productoEncontrado = data.find(
          (producto) => producto.id === Number(id)
        );

        setProducto(productoEncontrado || null);
      } catch (error) {
        console.error("Error al buscar el producto:", error);
        setProducto(null);
      } finally {
        setCargando(false);
      }
    };

    cargarProducto();
  }, [id]);

  if (cargando) {
    return (
      <p style={{ textAlign: "center", padding: "40px" }}>
        Cargando detalle del producto...
      </p>
    );
  }

  if (!producto) {
    return (
      <p style={{ textAlign: "center", padding: "40px" }}>
        El producto no existe.
      </p>
    );
  }

  return <ItemDetail producto={producto} />;
}

ItemDetailContainer.displayName = "ItemDetailContainer";

export default ItemDetailContainer;