import React, { createContext, useReducer } from 'react';

const initialState = {
  darkMode: false,
};

export const Store = createContext({});

interface Action {
  type: string;
}

function reducer(state: any, action: Action) {
  switch (action.type) {
    case 'DARK_MODE_ON':
      return { ...state, darkMode: true };
    case 'DARK_MODE_OFF':
      return { ...state, darkMode: false };
    default:
      return state;
  }
}

interface Props {
  children: NonNullable<React.ReactNode>;
}

export function StoreProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{children}</Store.Provider>;
}
