import { atom, useRecoilState } from 'recoil';
import { persistAtomEffect } from '../utils/useSSRecoil';

export interface IPaymentPaypal {
  paymentLoading: boolean;
  paymentSuccess: boolean;
  paymentError: string | null;
}

export const PaymentPaypalState = atom<IPaymentPaypal>({
  key: 'PaymentPaypalState',
  default: { paymentLoading: false, paymentSuccess: false, paymentError: null },
  effects_UNSTABLE: [persistAtomEffect],
});

// taken from https://stackoverflow.com/questions/68110629/nextjs-react-recoil-persist-values-in-local-storage-initial-page-load-in-wrong/70459889#70459889
export const usePaymentPaypal = () => {
  // LS for local storage
  const [LSPaymentPaypal, setLSPaymentPaypal] =
    useRecoilState<IPaymentPaypal>(PaymentPaypalState);

  return [LSPaymentPaypal, setLSPaymentPaypal] as const;
};
