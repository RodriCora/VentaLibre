import { useState, useEffect } from 'react';
import Item from './Item';

function ItemListContainer({ productosExtra = [] }) {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetch('/datos/productos.json')
      .then((response) => response.json())
      .then((data) => setProductos(data))
      .catch((error) =>
        console.error('Error al cargar los productos:', error)
      );
  }, []);

  const todosLosProductos = [...productosExtra, ...productos];

  return (
    <section className="ml-products-section">
      <h2>Catálogo de Productos Disponibles</h2>

      <div className="ml-grid">
        {todosLosProductos.map((prod) => (
          <Item
            key={prod.id}
            prod={prod}
          />
        ))}
      </div>
    </section>
  );
}

export default ItemListContainer;