import {
  Button,
  Card,
  Grid,
  Link,
  List,
  ListItem,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import Layout from '../components/Layout';
import { ICartItem, useShoppingCart } from '../models/ShoppingCart';
import NextLink from 'next/link';

export default function CartScreen() {
  const [cart, addToCart] = useShoppingCart();
  const { cartItems } = cart;
  return (
    <Layout title="Shopping Cart">
      <Typography variant="h1">Shopping Cart</Typography>
      {cartItems.length === 0 ? (
        <div>
          Cart is empty. <NextLink href="/">Go Shopping</NextLink>
        </div>
      ) : (
        <Grid container spacing={1}>
          <Grid item md={9} xs={12}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Action</TableCell>
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
                        <Select value={item.quantity}>
                          {Array.from(
                            Array(item.product.countInStock).keys()
                          ).map((x) => (
                            <MenuItem key={x + 1} value={x + 1}>
                              {x + 1}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell align="right">${item.product.price}</TableCell>
                      <TableCell align="right">
                        <Button variant="contained" color="secondary">
                          x
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item md={3} xs={12}>
            <Card>
              <List>
                <ListItem>
                  <Typography variant="h2">
                    Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                    items) : $
                    {cartItems.reduce(
                      (a, c) => a + c.quantity * c.product.price,
                      0
                    )}
                  </Typography>
                </ListItem>
                <ListItem>
                  <Button variant="contained" fullWidth>
                    Checkout
                  </Button>
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      )}
    </Layout>
  );
}
