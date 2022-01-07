import { createTheme, PaletteMode } from '@mui/material';
import { ThemeProvider } from '@mui/styles';
import { red } from '@mui/material/colors';
import React from 'react';
import { atom, useRecoilState } from 'recoil';
import { recoilPersist } from 'recoil-persist';

interface Props {
  children: NonNullable<React.ReactNode>;
}

const { persistAtom } = recoilPersist();

export const paletteState = atom({
  key: 'paleteState',
  default: 'light' as PaletteMode,
  effects_UNSTABLE: [persistAtom],
});

// taken from https://stackoverflow.com/questions/68110629/nextjs-react-recoil-persist-values-in-local-storage-initial-page-load-in-wrong/70459889#70459889
export const useDarkMode = () => {
  const [isInitial, setIsInitial] = React.useState(true);
  const [darkModeStored, setDarkModeStored] = useRecoilState(paletteState);

  React.useEffect(() => {
    setIsInitial(false);
  }, []);

  return [
    isInitial === true ? 'light' : darkModeStored,
    setDarkModeStored,
  ] as const;
};

export default function DarkMode({ children }: Props) {
  const [mode, setMode] = useDarkMode();
  const theme = createTheme({
    typography: {
      h1: {
        fontSize: '1.6rem',
        fontWeight: 400,
        margin: '1rem 0',
      },
      h2: {
        fontSize: '1.4rem',
        fontWeight: 400,
        margin: '1rem 0',
      },
    },
    palette: {
      mode,
      primary: {
        main: '#f0c000',
      },
      secondary: {
        main: '#208000',
      },
      error: {
        main: red.A400,
      },
    },
  });
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
