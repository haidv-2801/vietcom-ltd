import React, { useState } from 'react';
import { getUserID } from '../constants/commonAuth';
import { ParseJson } from '../constants/commonFunction';
import { getLocalStorage, setLocalStorage } from './authContext';

const CART_ID = 'CART_' + getUserID();

export const CartContext = React.createContext({
  size: 0,
  cart: [],
  total: 0,
  add: () => {},
  remove: () => {},
  removeAll: () => {},
  checkout: () => {},
});

/**
 * id
 * quantity
 */
const CartContextProvider = (props) => {
  const INITITAL = ParseJson(getLocalStorage(CART_ID));
  const [cart, setCart] = useState(INITITAL ?? null);

  const add = (item) => {
    try {
      let newCart = null;
      if (!cart) {
        newCart = [item];
      } else {
        let existsItem = cart.find((c) => c.id === item.id);
        if (existsItem) {
          existsItem.quantity += item.quantity;
          newCart = [
            existsItem,
            ...cart.filter((item) => item.id !== existsItem.id),
          ];
        } else {
          newCart = [item, ...cart];
        }
      }
      setCart(newCart);
      setLocalStorage(CART_ID, JSON.stringify(newCart));
      return true;
    } catch (error) {
      return false;
    }
  };

  const remove = (id) => {
    if (!cart) return;
    let newCart = cart.filter((item) => item.id !== id);
    if (newCart.length === 0) {
      setCart(null);
      window.localStorage.removeItem(CART_ID);
    } else {
      setCart(newCart);
      setLocalStorage(CART_ID, newCart);
    }
  };

  const removeAll = () => {
    if (!cart) return;
    setCart(null);
    window.localStorage.removeItem(CART_ID);
  };

  const checkout = async () => {
    const userID = getUserID();
  };

  const calcTotal = () => {
    if (!cart) return 0;
    const total = cart.reduce((pre, next) => pre + next.quantity, 0);
    return total;
  };

  const contextValue = {
    size: cart?.length ?? 0,
    cart,
    total: calcTotal(),
    add,
    remove,
    removeAll,
    checkout: checkout,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {props.children}
    </CartContext.Provider>
  );
};

export default CartContextProvider;
