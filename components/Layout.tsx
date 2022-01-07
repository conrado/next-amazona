import React from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import {
  AppBar,
  Container,
  createTheme,
  Link,
  PaletteMode,
  Switch,
  Toolbar,
  Typography,
} from '@mui/material';
import useStyles from '../utils/styles';

import { useDarkMode } from '../utils/DarkMode';

interface Props {
  title?: string;
  description?: string;
  children: NonNullable<React.ReactNode>;
}

export default function Layout({ title, description, children }: Props) {
  const classes = useStyles();
  const [mode, setMode] = useDarkMode();
  const onDarkModeChange = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  return (
    <div>
      <Head>
        <title>{title ? `${title} - Next Amazona` : 'Next Amazona'}</title>
        {description && <meta name="description" content={description}></meta>}
      </Head>
      <AppBar position="static" className={classes.navBar}>
        <Toolbar>
          <NextLink href="/" passHref>
            <Link>
              <Typography className={classes.brand}>amazona</Typography>
            </Link>
          </NextLink>
          <div className={classes.grow}></div>
          <div>
            <Switch
              checked={mode === 'dark' ? true : false}
              onChange={onDarkModeChange}
            ></Switch>
            <NextLink href="/cart" passHref>
              <Link>Cart</Link>
            </NextLink>
            <NextLink href="/login" passHref>
              <Link>Login</Link>
            </NextLink>
          </div>
        </Toolbar>
      </AppBar>
      <Container className={classes.main}>{children}</Container>
      <footer className={classes.footer}>
        <Typography>All rights reserved. Next Amazona.</Typography>
      </footer>
    </div>
  );
}
