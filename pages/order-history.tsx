import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';
import { useUser } from '../models/UserState';
import { IOrderHistory, useOrderHistory } from '../models/OrderHistory';
import axios from 'axios';
import { getError } from '../utils/error';
import {
  Button,
  Card,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import NextLink from 'next/link';
import useStyles from '../utils/styles';

export function OrderHistory() {
  const router = useRouter();
  const [user] = useUser();
  const [orderHistory, setOrderHistory] = useOrderHistory();
  const classes = useStyles();
  useEffect(() => {
    if (user && !user.token) {
      router.push('/login?redirect=/order-history');
    }
    const fetchOrders = async () => {
      try {
        setOrderHistory({ ...orderHistory, loading: true });
        const { data } = await axios.get<IOrderHistory>('/api/orders/history', {
          headers: { authorization: `Bearer ${user?.token}` },
        });
        console.log('data');
        console.log(data.orders);
        setOrderHistory({
          ...orderHistory,
          orders: data.orders,
          loading: false,
        });
      } catch (err) {
        setOrderHistory({ ...orderHistory, error: getError(err) });
      }
    };
    fetchOrders();
  }, [user]);
  return (
    <Layout title="Order History">
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card className={classes.section}>
            <List>
              <NextLink href="/profile" passHref>
                <ListItem button component="a">
                  <ListItemText primary="User Profile"></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/order-history" passHref>
                <ListItem selected button component="a">
                  <ListItemText primary="Order History"></ListItemText>
                </ListItem>
              </NextLink>
            </List>
          </Card>
        </Grid>
        <Grid item md={9} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography variant="h1">Order History</Typography>
              </ListItem>
              <ListItem>
                {orderHistory.loading ? (
                  <CircularProgress />
                ) : orderHistory.error ? (
                  <Typography className={classes.error}>
                    {orderHistory.error}
                  </Typography>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>DATE</TableCell>
                          <TableCell>TOTAL</TableCell>
                          <TableCell>PAID</TableCell>
                          <TableCell>DELIVERED</TableCell>
                          <TableCell>ACTION</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orderHistory.orders?.map((order) => (
                          <TableRow key={order._id}>
                            <TableCell>{order._id.substring(20, 24)}</TableCell>
                            <TableCell>{order.createdAt}</TableCell>
                            <TableCell>{order.totalPrice}</TableCell>
                            <TableCell>
                              {order.isPaid
                                ? `paid at ${order.paidAt}`
                                : 'not paid'}
                            </TableCell>
                            <TableCell>
                              {order.isDelivered
                                ? `delivered at ${order.deliveredAt}`
                                : 'not delivered'}
                            </TableCell>
                            <TableCell>
                              <NextLink href={`/order/${order._id}`} passHref>
                                <Button variant="contained">Details</Button>
                              </NextLink>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(OrderHistory), { ssr: false });
