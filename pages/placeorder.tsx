import {
  Button,
  Card,
  CircularProgress,
  Grid,
  Link,
  List,
  ListItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import Layout from '../components/Layout';
import { useShoppingCart } from '../models/ShoppingCart';
import NextLink from 'next/link';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { useRouter } from 'next/router';
import useStyles from '../utils/styles';
import { useShippingAddress } from '../models/ShippingAddress';
import CheckoutWizard from '../components/CheckoutWizard';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { getError } from '../utils/error';
import { useUser } from '../models/UserState';
import { PaymentMethodState } from '../models/PaymentMethod';
import { useRecoilState } from 'recoil';

function PlaceOrder() {
  const [user] = useUser();
  const [cart, , , , clearCart] = useShoppingCart();
  const [shippingAddress] = useShippingAddress();
  const [paymentMethod] = useRecoilState(PaymentMethodState);
  const { cartItems } = cart;
  const router = useRouter();
  const classes = useStyles();
  const round2 = (num: number) => Math.floor(num * 100 + Number.EPSILON) / 100;
  const itemsPrice = round2(
    cartItems.reduce((a, c) => a + c.product.price * c.quantity, 0)
  );
  useEffect(() => {
    if (cart && cartItems.length === 0) {
      router.push('/cart ');
    }
    if (!paymentMethod.paymentMethod) {
      router.push('/payment');
    }
  }, []);
  const shippingPrice = itemsPrice > 200 ? 0 : 15;
  const taxPrice = round2(itemsPrice * 0.15);
  const totalPrice = round2(itemsPrice + taxPrice + shippingPrice);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const onPlaceOrder = async () => {
    console.log(cartItems);
    closeSnackbar();
    try {
      setLoading(true);
      const { data } = await axios.post(
        '/api/orders',
        {
          orderItems: cartItems,
          shippingAddress,
          paymentMethod: paymentMethod.paymentMethod,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${user?.token}`,
          },
        }
      );
      clearCart();
      setLoading(false);
      router.push(`/order/${data._id}`);
    } catch (err) {
      setLoading(false);
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };
  return (
    <Layout title="Place Order">
      <CheckoutWizard activeStep={3} />
      <Typography variant="h1">Place Order</Typography>
      <Grid container spacing={1}>
        <Grid item md={9} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography variant="h2">Shipping Address</Typography>
              </ListItem>
              <ListItem>
                <Typography>
                  {shippingAddress?.fullName}, {shippingAddress?.address},{' '}
                  {shippingAddress?.city}, {shippingAddress?.postalCode},{' '}
                  {shippingAddress?.country}
                </Typography>
              </ListItem>
            </List>
          </Card>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography variant="h2">Payment Method</Typography>
              </ListItem>
              <ListItem>
                <Typography>{paymentMethod.paymentMethod}</Typography>
              </ListItem>
            </List>
          </Card>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography variant="h2">Order Items</Typography>
              </ListItem>
              <ListItem>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Image</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Price</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cartItems.map((item) => (
                        <TableRow key={item.product._id}>
                          <TableCell>
                            <NextLink
                              href={`/products/${item.product.slug}`}
                              passHref
                            >
                              <Link>
                                <img
                                  src={item.product.image}
                                  alt={item.product.name}
                                  width={50}
                                  height={50}
                                ></img>
                              </Link>
                            </NextLink>
                          </TableCell>
                          <TableCell>
                            <NextLink
                              href={`/products/${item.product.slug}`}
                              passHref
                            >
                              <Link>
                                <Typography>{item.product.name}</Typography>
                              </Link>
                            </NextLink>
                          </TableCell>
                          <TableCell align="right">
                            <Typography>{item.quantity}</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography>${item.product.price}</Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </ListItem>
            </List>
          </Card>
        </Grid>
        <Grid item md={3} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography variant="h2">Order Summary</Typography>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Items:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right">${itemsPrice}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Tax:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right">${taxPrice}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Shipping:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right">${shippingPrice}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>
                      <strong>Total:</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right">
                      <strong>${totalPrice}</strong>
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Button onClick={onPlaceOrder} variant="contained" fullWidth>
                  Place Order
                </Button>
              </ListItem>
              {loading && (
                <ListItem>
                  <CircularProgress />
                </ListItem>
              )}
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

// added dynamic() just because it was added in Basir's course, however
//  the problem that Basir was trying to fix is not presenting itself in this
//  code base and could be server-side-rendered indeed.
export default dynamic(() => Promise.resolve(PlaceOrder), { ssr: false });
