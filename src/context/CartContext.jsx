import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Add book or increase quantity if it exists
  const addToCart = (book) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === book.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...book, quantity: 1 }];
    });
  };

  // Reduce quantity by 1, or remove if quantity is 1
  const removeFromCart = (bookId) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === bookId);
      if (existingItem?.quantity > 1) {
        return prev.map((item) =>
          item.id === bookId ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      return prev.filter((item) => item.id !== bookId);
    });
  };

  const clearCart = () => setCart([]);

  // Calculate total items (sum of all quantities)
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);