import { atom, useRecoilState } from 'recoil';
import { persistAtomEffect } from '../utils/useSSRecoil';
import { IUser } from './UserInterface';

export const UserState = atom<IUser | null>({
  key: 'UserState',
  default: null,
  effects_UNSTABLE: [persistAtomEffect],
});

export const useUser = () => {
  // LS for local storage
  const [LSUser, setLSUser] = useRecoilState(UserState);

  return [LSUser, setLSUser] as const;
};
