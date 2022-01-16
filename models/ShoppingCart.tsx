import React from 'react';
import { atom, useRecoilState } from 'recoil';
import { recoilPersist } from 'recoil-persist';
import { IProduct } from './Product';

export interface IShoppingCart {
  cartItems: {
    product: IProduct;
    quantity: number;
  }[];
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
  const [LSShoppingCart, setLSShoppingCart] = useRecoilState(ShoppingCartState);

  interface Props {
    product: IProduct;
    quantity: number;
  }
  const addToCart = ({ product, quantity }: Props) => {
    const existingItem = LSShoppingCart.cartItems.find(
      (item: Props) => item.product._id === product._id
    );
    const cartItems = existingItem
      ? LSShoppingCart.cartItems.map((item: Props) =>
          item.product.name === existingItem.name
            ? { product, quantity: item.quantity + quantity }
            : { product, quantity }
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
