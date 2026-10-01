import { createContext, useContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {

  const [cart, setCart] = useState([]);

  // Agregar producto al carrito
  const addItem = (item, quantity) => {

    if (isInCart(item.id)) {

      setCart(
        cart.map((prod) =>
          prod.id === item.id
            ? { ...prod, quantity: prod.quantity + quantity }
            : prod
        )
      );

    } else {

      setCart([...cart, { ...item, quantity }]);

    }
  };

  // Eliminar un producto específico
  const removeItem = (id) => {
    setCart(cart.filter((prod) => prod.id !== id));
  };

  // Vaciar todo el carrito
  const clearCart = () => {
    setCart([]);
  };

  // Validar si el producto ya está en el carrito
  const isInCart = (id) => {
    return cart.some((prod) => prod.id === id);
  };

  // Cantidad total
  const totalQuantity = cart.reduce(
    (acc, prod) => acc + prod.quantity,
    0
  );

  // Precio total
  const totalPrice = cart.reduce(
    (acc, prod) => acc + prod.price * prod.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        clearCart,
        totalQuantity,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);