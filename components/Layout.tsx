import React from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { AppBar, Container, Link, Toolbar, Typography } from '@mui/material';
import useStyles from '../utils/styles';

interface Props {
  children: NonNullable<React.ReactNode>;
}

export default function Layout({ children }: Props) {
  const classes = useStyles();
  return (
    <div>
      <Head>
        <title>Next Amazona</title>
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
