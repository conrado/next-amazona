import React from 'react';
import { atom, useRecoilState } from 'recoil';
import { recoilPersist } from 'recoil-persist';

export interface IShippingAddress {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

const { persistAtom } = recoilPersist();

export const ShippingAddressState = atom({
  key: 'ShippingAddressState',
  default: { shippingAddress: null },
  effects_UNSTABLE: [persistAtom],
});

// taken from https://stackoverflow.com/questions/68110629/nextjs-react-recoil-persist-values-in-local-storage-initial-page-load-in-wrong/70459889#70459889
export const useShippingAddress = () => {
  const [isInitial, setIsInitial] = React.useState(true);
  // LS for local storage
  const [LSShippingAddress, setLSShippingAddress] =
    useRecoilState<{ shippingAddress: IShippingAddress | null }>(
      ShippingAddressState
    );

  const setShippingAddress = (shippingAddress: IShippingAddress) => {
    setLSShippingAddress({ shippingAddress });
  };

  React.useEffect(() => {
    setIsInitial(false);
  }, []);

  return [
    isInitial === true ? { shippingAddress: null } : LSShippingAddress,
    setShippingAddress,
  ] as const;
};
