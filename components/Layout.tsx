import React from 'react';
import Head from 'next/head';
import { AppBar, Container, Toolbar, Typography } from '@mui/material';

interface Props {
  children: NonNullable<React.ReactNode>;
}

export default function Layout({ children }: Props) {
  return (
    <div>
      <Head>
        <title>Next Amazona</title>
      </Head>
      <AppBar position="static">
        <Toolbar>
          <Typography>amazona</Typography>
        </Toolbar>
      </AppBar>
      <Container>{children}</Container>
      <footer>
        <Typography>All rights reserved. Next Amazona.</Typography>
      </footer>
    </div>
  );
}
