import React from 'react';
import { atom, useSetRecoilState } from 'recoil';

import { AtomEffect } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

const ssrCompletedState = atom({
  key: 'SsrCompleted',
  default: false,
});

export const useSSRecoil = () => {
  const setSsrCompleted = useSetRecoilState(ssrCompletedState);
  return () => setSsrCompleted(true);
};

export const SSRecoil = ({ children }: { children: React.ReactNode }) => {
  const setSsrCompleted = useSSRecoil();
  React.useEffect(setSsrCompleted, [setSsrCompleted]);
  return <>{children}</>;
};

export function persistAtomEffect<T>(param: Parameters<AtomEffect<T>>[0]) {
  param.getPromise(ssrCompletedState).then(() => persistAtom(param));
}
