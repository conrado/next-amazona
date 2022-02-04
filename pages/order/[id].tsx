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
import {
  OnApproveBraintreeActions,
  PayPalButtons,
  SCRIPT_LOADING_STATE,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js';
import {
  CreateOrderActions,
  CreateOrderRequestBody,
  OnApproveActions,
  OnApproveData,
  PaymentFailureReason,
} from '@paypal/paypal-js';
import { useSnackbar } from 'notistack';
import { usePaymentPaypal } from '../../models/PaymentPaypal';

interface Props {
  params: {
    id: string;
  };
}

function Order({ params }: Props) {
  const orderId = params.id;
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
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
  const [paymentPaypal, setPaymentPaypal] = usePaymentPaypal();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
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
    if (
      (user && !order) ||
      paymentPaypal.paymentSuccess ||
      (user && order && order._id !== orderId)
    ) {
      fetchOrder();
      if (paymentPaypal.paymentSuccess) {
        setPaymentPaypal({
          paymentLoading: false,
          paymentSuccess: false,
          paymentError: null,
        });
      }
    } else if (user?.token) {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get('/api/keys/paypal', {
          headers: {
            authorization: `Bearer ${user?.token}`,
          },
        });
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': clientId,
            currency: 'USD',
          },
        });
        paypalDispatch({
          type: 'setLoadingStatus',
          value: SCRIPT_LOADING_STATE.PENDING,
        });
      };
      loadPaypalScript();
    }
  }, [order, user, paymentPaypal]);
  useEffect(() => {
    if (user !== null && !user.authenticated) {
      router.push('/login');
    }
  }, [user]);
  const createOrder = (_: any, actions: CreateOrderActions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: (totalPrice ? totalPrice : 0).toString() },
          },
        ],
      })
      .then((orderId) => {
        return orderId;
      });
  };
  const onApprove = (data: OnApproveData, actions: OnApproveActions) => {
    const retVal = actions.order?.capture().then(async (details) => {
      console.log(details);
      console.log(user?.token);
      try {
        setPaymentPaypal({ ...paymentPaypal, paymentLoading: true });
        const { data } = await axios.put(
          `/api/orders/${order?._id}/pay`,
          details,
          {
            headers: {
              authorization: `Bearer ${user?.token}`,
            },
          }
        );
        setPaymentPaypal({
          ...paymentPaypal,
          paymentLoading: false,
          paymentSuccess: true,
        });
        enqueueSnackbar('Order is paid', { variant: 'success' });
      } catch (err) {
        setPaymentPaypal({
          ...paymentPaypal,
          paymentLoading: false,
          paymentError: getError(err),
        });
        enqueueSnackbar(getError(err), { variant: 'error' });
      }
    });
    // look at this wonderful retVal crap... sometimes typescript is a pain
    // because vendors are too crap to provide proper types or examples.
    return retVal
      ? retVal
      : new Promise<void>(() => {
          return;
        });
  };
  const onError = (error: Record<string, unknown>) => {
    enqueueSnackbar(getError(error), { variant: 'error' });
  };
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
                {!isPaid && (
                  <ListItem>
                    {isPending ? (
                      <CircularProgress />
                    ) : (
                      <div className={classes.fullWidth}>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      </div>
                    )}
                  </ListItem>
                )}
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
