import React from 'react';
import { atom, useRecoilState } from 'recoil';
import { persistAtomEffect } from '../utils/useSSRecoil';

export interface IShippingAddress {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export const ShippingAddressState = atom<IShippingAddress | null>({
  key: 'ShippingAddressState',
  default: null,
  effects_UNSTABLE: [persistAtomEffect],
});

// taken from https://stackoverflow.com/questions/68110629/nextjs-react-recoil-persist-values-in-local-storage-initial-page-load-in-wrong/70459889#70459889
export const useShippingAddress = () => {
  // LS for local storage
  const [LSShippingAddress, setLSShippingAddress] =
    useRecoilState<IShippingAddress | null>(ShippingAddressState);

  return [LSShippingAddress, setLSShippingAddress] as const;
};
