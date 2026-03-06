import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // --- Initialize state from localStorage ---
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('local_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // --- Save to localStorage whenever the cart changes ---
  useEffect(() => {
    localStorage.setItem('local_cart', JSON.stringify(cart));
  }, [cart]);

  // Add book or increase quantity if it exists
  const addToCart = (book) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === book.id);
      
      // Stock protection: prevents adding more than available stock
      if (existingItem && existingItem.quantity >= book.stockQuantity) {
        return prev; 
      }

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

  // --- NEW: Completely remove item regardless of quantity ---
  const deleteItem = (bookId) => {
    setCart((prev) => prev.filter((item) => item.id !== bookId));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('local_cart'); // Clean up storage
  };

  // Calculate total items (sum of all quantities)
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, deleteItem, clearCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);