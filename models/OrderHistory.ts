import { atom, useRecoilState } from 'recoil';
import { persistAtomEffect } from '../utils/useSSRecoil';
import { IOrder } from './OrderState';

export interface IOrderHistory {
  orders: IOrder[];
  loading: boolean;
  error: string;
}

export const OrderHistoryState = atom<IOrderHistory>({
  key: 'PaymentPaypalState',
  default: { orders: [], loading: true, error: '' },
  effects_UNSTABLE: [persistAtomEffect],
});

// taken from https://stackoverflow.com/questions/68110629/nextjs-react-recoil-persist-values-in-local-storage-initial-page-load-in-wrong/70459889#70459889
export const useOrderHistory = () => {
  // LS for local storage
  const [LSOrderHistory, setLSOrderHistory] =
    useRecoilState<IOrderHistory>(OrderHistoryState);

  return [LSOrderHistory, setLSOrderHistory] as const;
};
