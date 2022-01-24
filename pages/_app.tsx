import Head from 'next/head';
import { AppProps } from 'next/app';
import { CacheProvider, EmotionCache } from '@emotion/react';
import createEmotionCache from '../src/createEmotionCache';
import { useEffect } from 'react';
import { RecoilRoot } from 'recoil';
import { DarkMode } from '../components/DarkMode';
import { SnackbarProvider } from 'notistack';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    return () => {
      if (jssStyles) {
        jssStyles.parentElement?.removeChild(jssStyles);
      }
    };
  }, []);
  return (
    <RecoilRoot>
      <SnackbarProvider
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <CacheProvider value={emotionCache}>
          <Head>
            <meta
              name="viewport"
              content="initial-scale=1, width=device-width"
            />
          </Head>
          <DarkMode>
            <Component {...pageProps} />
          </DarkMode>
        </CacheProvider>
      </SnackbarProvider>
    </RecoilRoot>
  );
}
