import React from 'react';
import { atom } from 'recoil';
import { persistAtomEffect } from '../utils/useSSRecoil';

export interface IPaymentMethod {
  paymentMethod: string | null;
}

export const PaymentMethodState = atom<IPaymentMethod>({
  key: 'PaymentMethodState',
  default: { paymentMethod: null },
  effects_UNSTABLE: [persistAtomEffect],
});
