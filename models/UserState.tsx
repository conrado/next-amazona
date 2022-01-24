import React from 'react';
import { atom, useRecoilState } from 'recoil';
import { recoilPersist } from 'recoil-persist';
import { IUserInfo } from './UserInterface';

const { persistAtom } = recoilPersist();

export const UserState = atom({
  key: 'UserState',
  default: { userInfo: null, isLoading: true },
  effects_UNSTABLE: [persistAtom],
});

export const useUser = () => {
  const [isInitial, setIsInitial] = React.useState(true);
  // LS for local storage
  const [LSUser, setLSUser] = useRecoilState<IUserInfo>(UserState);

  const setUser = (user: IUserInfo) => {
    setLSUser(user);
  };

  React.useEffect(() => {
    setIsInitial(false);
    setLSUser({ userInfo: LSUser.userInfo, isLoading: false });
  }, []);

  return [isInitial === true ? null : LSUser, setUser] as const;
};
