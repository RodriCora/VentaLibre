import { createContext, useContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const carritoGuardado = localStorage.getItem('carrito');
      return carritoGuardado ? JSON.parse(carritoGuardado) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(cart));
  }, [cart]);

  // Validar si el producto ya está en el carrito
  const isInCart = (id) => {
    return cart.some((prod) => prod.id === id);
  };

  // Agregar producto al carrito
  const addItem = (item, quantity = 1) => {
    if (quantity <= 0) return;

    if (isInCart(item.id)) {
      setCart((prevCart) =>
        prevCart.map((prod) =>
          prod.id === item.id
            ? { ...prod, quantity: prod.quantity + quantity }
            : prod
        )
      );
    } else {
      setCart((prevCart) => [...prevCart, { ...item, quantity }]);
    }
  };

  // Incrementar cantidad en 1
  const incrementItem = (id) => {
    setCart((prevCart) =>
      prevCart.map((prod) =>
        prod.id === id ? { ...prod, quantity: prod.quantity + 1 } : prod
      )
    );
  };

  // Decrementar cantidad en 1 (si llega a 0, se elimina del carrito)
  const decrementItem = (id) => {
    setCart((prevCart) =>
      prevCart
        .map((prod) =>
          prod.id === id ? { ...prod, quantity: prod.quantity - 1 } : prod
        )
        .filter((prod) => prod.quantity > 0)
    );
  };

  // Eliminar un producto específico
  const removeItem = (id) => {
    setCart((prevCart) => prevCart.filter((prod) => prod.id !== id));
  };

  // Vaciar todo el carrito
  const clearCart = () => {
    setCart([]);
  };

  // Cantidad total de unidades
  const totalQuantity = cart.reduce((acc, prod) => acc + prod.quantity, 0);

  // Precio total
  const totalPrice = cart.reduce(
    (acc, prod) => acc + Number(prod.price) * prod.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        incrementItem,
        decrementItem,
        removeItem,
        clearCart,
        isInCart,
        totalQuantity,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
