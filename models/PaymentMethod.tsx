import React from 'react';
import { atom, useRecoilState } from 'recoil';
import { recoilPersist } from 'recoil-persist';

export interface IPaymentMethod {
  paymentMethod: string;
}

const { persistAtom } = recoilPersist();

export const PaymentMethodState = atom({
  key: 'PaymentMethodState',
  default: { paymenthMethod: null, isLoading: true },
  effects_UNSTABLE: [persistAtom],
});

// taken from https://stackoverflow.com/questions/68110629/nextjs-react-recoil-persist-values-in-local-storage-initial-page-load-in-wrong/70459889#70459889
export const usePaymentMethod = () => {
  const [isInitial, setIsInitial] = React.useState(true);
  // LS for local storage
  const [LSPaymentMethod, setLSPaymentMethod] = useRecoilState<{
    paymentMethod: IPaymentMethod;
    isLoading: boolean | null;
  }>(PaymentMethodState);

  const setPaymentMethod = (paymentMethod: IPaymentMethod) => {
    setLSPaymentMethod({ paymentMethod, isLoading: false });
  };

  React.useEffect(() => {
    setIsInitial(false);
    setLSPaymentMethod({
      paymentMethod: LSPaymentMethod.paymentMethod,
      isLoading: false,
    });
  }, []);

  return [
    isInitial === true
      ? { paymentMethod: null, isLoading: true }
      : LSPaymentMethod,
    setPaymentMethod,
  ] as const;
};
