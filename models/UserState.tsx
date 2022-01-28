import React from 'react';
import { atom, useRecoilState } from 'recoil';
import { persistAtomEffect } from '../utils/useSSRecoil';
import { IUserInfo } from './UserInterface';

export const UserState = atom<IUserInfo | null>({
  key: 'UserState',
  default: null,
  effects_UNSTABLE: [persistAtomEffect],
});

export const useUser = () => {
  // LS for local storage
  const [LSUser, setLSUser] = useRecoilState(UserState);

  return [LSUser, setLSUser] as const;
};
