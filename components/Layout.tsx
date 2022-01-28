import { MouseEvent, ReactNode, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import {
  AppBar,
  Container,
  Link,
  Switch,
  Toolbar,
  Typography,
  Badge,
  Button,
  Menu,
  MenuItem,
} from '@mui/material';
import useStyles from '../utils/styles';

import { useDarkMode } from '../components/DarkMode';
import { useShoppingCart } from '../models/ShoppingCart';
import { useUser } from '../models/UserState';
import { useRouter } from 'next/router';

interface Props {
  title?: string;
  description?: string;
  children: NonNullable<ReactNode>;
}

export default function Layout({ title, description, children }: Props) {
  const router = useRouter();
  const classes = useStyles();
  const [mode, setMode] = useDarkMode();
  const [cart, , , , clearCart] = useShoppingCart();
  const [user, setUser] = useUser();
  const onDarkModeChange = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  const onLoginMenuClick = (evt: MouseEvent) => {
    setAnchorEl(evt.currentTarget);
  };

  const onLoginMenuClose = () => {
    setAnchorEl(null);
  };

  const onLogout = () => {
    setAnchorEl(null);
    setUser(null);
    clearCart();
    router.push('/');
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
              <Link>
                {cart.cartItems.length > 0 ? (
                  <Badge color="secondary" badgeContent={cart.cartItems.length}>
                    Cart
                  </Badge>
                ) : (
                  'Cart'
                )}
              </Link>
            </NextLink>
            {user?.authenticated ? (
              <>
                <Button
                  aria-controls="userProfile-menu"
                  aria-haspopup="true"
                  onClick={onLoginMenuClick}
                  className={classes.navbarButton}
                >
                  {user.name}
                </Button>
                <Menu
                  id="userProfile-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={onLoginMenuClose}
                >
                  <MenuItem onClick={onLoginMenuClose}>Profile</MenuItem>
                  <MenuItem onClick={onLoginMenuClose}>My account</MenuItem>
                  <MenuItem onClick={onLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <NextLink href="/login" passHref>
                <Link>Login</Link>
              </NextLink>
            )}
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
