import {
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
import Layout from '../../components/Layout';
import NextLink from 'next/link';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { useRouter } from 'next/router';
import useStyles from '../../utils/styles';
import CheckoutWizard from '../../components/CheckoutWizard';
import { useEffect, useState } from 'react';
import { getError } from '../../utils/error';
import { useUser } from '../../models/UserState';
import { IOrder } from '../../models/OrderState';

interface Props {
  params: {
    id: string;
  };
}

function Order({ params }: Props) {
  const orderId = params.id;
  const [user] = useUser();
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const shippingAddress = order?.shippingAddress;
  const paymentMethod = order?.paymentMethod;
  const orderItems = order?.orderItems;
  const itemsPrice = order?.itemsPrice;
  const taxPrice = order?.taxPrice;
  const shippingPrice = order?.shippingPrice;
  const totalPrice = order?.totalPrice;
  const isDelivered = order?.isDelivered;
  const deliveredAt = order?.deliveredAt;
  const isPaid = order?.isPaid;
  const paidAt = order?.paidAt;
  const router = useRouter();
  const classes = useStyles();
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get<IOrder>(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${user?.token}` },
        });
        setOrder(data);
        setLoading(false);
      } catch (err) {
        setError(getError(err));
      }
    };
    if ((user && !order) || (user && order && order._id !== orderId)) {
      fetchOrder();
    }
  }, [order, user]);
  useEffect(() => {
    if (user !== null && !user.authenticated) {
      router.push('/login');
    }
  }, [user]);
  return (
    <Layout title={`Order ${orderId}`}>
      <CheckoutWizard activeStep={4} />
      <Typography variant="h1">Order {orderId}</Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography className={classes.error}>{error}</Typography>
      ) : (
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
                <ListItem>
                  <Typography>
                    Status:{' '}
                    {isDelivered
                      ? `delivered at ${deliveredAt}`
                      : 'not yet delivered'}
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
                  <Typography>{paymentMethod}</Typography>
                </ListItem>
                <ListItem>
                  <Typography>
                    Status: {isPaid ? `paid at: ${paidAt}` : 'not yet paid'}
                  </Typography>
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
                        {orderItems?.map((item) => (
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
              </List>
            </Card>
          </Grid>
        </Grid>
      )}
    </Layout>
  );
}

export async function getServerSideProps({ params }: Props) {
  return { props: { params } };
}

// added dynamic() just because it was added in Basir's course, however
//  the problem that Basir was trying to fix is not presenting itself in this
//  code base and could be server-side-rendered indeed.
export default dynamic(() => Promise.resolve(Order), { ssr: false });
