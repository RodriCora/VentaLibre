import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ItemDetail from "./ItemDetail";
import { obtenerProductoPorId } from "../firebase/productosService";

function ItemDetailContainer() {
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const { id } = useParams();

  useEffect(() => {
    const cargarProducto = async () => {
      try {
        setCargando(true);
        setError("");
        setProducto(null);

        const productoEncontrado = await obtenerProductoPorId(id);
        setProducto(productoEncontrado);
      } catch (err) {
        console.error("Error al buscar el producto en Firestore:", err);
        setError("Ocurrió un error al cargar el producto. Intentá nuevamente.");
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

  if (error) {
    return (
      <p style={{ textAlign: "center", padding: "40px", color: "red" }}>
        {error}
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
