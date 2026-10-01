import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ItemDetail from './ItemDetail';

function ItemDetailContainer() {
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    setCargando(true);

    // Ajustamos la ruta del fetch igual que en ItemListContainer
    const baseUrl = import.meta.env.BASE_URL;
    const rutaJson = `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}datos/productos.json`;

    fetch(rutaJson)
      .then((response) => {
        if (!response.ok) {
          throw new Error('No se pudo cargar el producto');
        }
        return response.json();
      })
      .then((data) => {
        // Convertimos 'id' de la URL a número para que coincida con producto.id
        const productoEncontrado = data.find((p) => p.id === Number(id));
        setProducto(productoEncontrado);
        setCargando(false);
      })
      .catch((error) => {
        console.error('Error al buscar el producto:', error);
        setCargando(false);
      });
  }, [id]);

  if (cargando) {
    return <p style={{ textAlign: 'center', padding: '40px' }}>Cargando detalle del producto...</p>;
  }

  if (!producto) {
    return <p style={{ textAlign: 'center', padding: '40px' }}>El producto no existe.</p>;
  }

  return <ItemDetail producto={producto} />;
}

ItemDetailContainer.displayName = 'ItemDetailContainer';

export default ItemDetailContainer;