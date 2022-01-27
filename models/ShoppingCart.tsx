import React from 'react';
import { atom, useRecoilState } from 'recoil';
import { recoilPersist } from 'recoil-persist';
import { persistAtomEffect } from '../utils/useSSRecoil';
import { IProduct } from './Product';

export interface ICartItem {
  product: IProduct;
  quantity: number;
}

export interface IShoppingCart {
  cartItems: ICartItem[];
}

export const ShoppingCartState = atom<IShoppingCart>({
  key: 'ShoppingCartState',
  default: { cartItems: [] },
  effects_UNSTABLE: [persistAtomEffect],
});

// taken from https://stackoverflow.com/questions/68110629/nextjs-react-recoil-persist-values-in-local-storage-initial-page-load-in-wrong/70459889#70459889
export const useShoppingCart = () => {
  const [LSShoppingCart, setLSShoppingCart] =
    useRecoilState<IShoppingCart>(ShoppingCartState);

  const getQuantity = (product: IProduct) => {
    const existingItem = LSShoppingCart.cartItems.find(
      (item) => item.product._id === product._id
    );
    return existingItem ? existingItem.quantity : 0;
  };
  const clearCart = () => {
    setLSShoppingCart({ cartItems: [] });
  };
  const removeFromCart = ({ product }: ICartItem) => {
    const cartItems = LSShoppingCart.cartItems.filter(
      (item) => item.product._id !== product._id
    );
    setLSShoppingCart({ cartItems });
  };
  const updateCart = ({ product, quantity }: ICartItem) => {
    const existingItem = LSShoppingCart.cartItems.find(
      (item) => item.product._id === product._id
    );
    const cartItems = existingItem
      ? LSShoppingCart.cartItems.map((item) =>
          item.product._id === existingItem.product._id
            ? {
                product: existingItem.product,
                quantity: quantity,
              }
            : { product: item.product, quantity: item.quantity }
        )
      : [...LSShoppingCart.cartItems, { product, quantity }];
    setLSShoppingCart({ cartItems });
  };

  return [
    LSShoppingCart,
    updateCart,
    removeFromCart,
    getQuantity,
    clearCart,
  ] as const;
};
