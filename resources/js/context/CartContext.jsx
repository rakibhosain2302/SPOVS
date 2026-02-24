import React, { createContext, useContext, useState }from 'react'

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [tickets, setTickets] = useState([]);
    const [guestInfo, setGuestInfo] = useState(null);

    const totalAmount = tickets.reduce((sum, ticket) => sum + ticket.quantity * ticket.price, 0);

  return (
    <CartContext.Provider value={{ tickets, setTickets, guestInfo, setGuestInfo, totalAmount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

