import React from 'react';
import { atom, useRecoilState } from 'recoil';
import { recoilPersist } from 'recoil-persist';
import { IProduct } from './Product';

export interface ICartItem {
  product: IProduct;
  quantity: number;
}

export interface IShoppingCart {
  cartItems: ICartItem[];
}

const { persistAtom } = recoilPersist();

export const ShoppingCartState = atom({
  key: 'ShoppingCartState',
  default: { cartItems: [] },
  effects_UNSTABLE: [persistAtom],
});

// taken from https://stackoverflow.com/questions/68110629/nextjs-react-recoil-persist-values-in-local-storage-initial-page-load-in-wrong/70459889#70459889
export const useShoppingCart = () => {
  const [isInitial, setIsInitial] = React.useState(true);
  // LS for local storage
  const [LSShoppingCart, setLSShoppingCart] =
    useRecoilState<IShoppingCart>(ShoppingCartState);

  const addToCart = ({ product, quantity }: ICartItem) => {
    const existingItem = LSShoppingCart.cartItems.find(
      (item) => item.product._id === product._id
    );
    const cartItems = existingItem
      ? LSShoppingCart.cartItems.map((item) =>
          item.product._id === existingItem.product._id
            ? {
                product: existingItem.product,
                quantity: existingItem.quantity + quantity,
              }
            : { product: item.product, quantity: item.quantity }
        )
      : [...LSShoppingCart.cartItems, { product, quantity }];
    setLSShoppingCart({ cartItems });
  };

  React.useEffect(() => {
    setIsInitial(false);
  }, []);

  return [
    isInitial === true ? { cartItems: [] } : LSShoppingCart,
    addToCart,
  ] as const;
};
