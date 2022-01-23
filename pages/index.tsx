import * as React from 'react';
import type { NextPage } from 'next';
import NextLink from 'next/link';
import Layout from '../components/Layout';
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@mui/material';
import db from '../utils/db';
import Product, { IProduct } from '../models/Product';
import axios from 'axios';
import { useShoppingCart } from '../models/ShoppingCart';
import { useRouter } from 'next/router';

interface Props {
  products: IProduct[];
}

const Home: NextPage<Props> = ({ products }) => {
  const [, updateCart, , getQuantity] = useShoppingCart();
  const router = useRouter();
  const onAddToCart = async (product: IProduct) => {
    const quantity = getQuantity(product) + 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    updateCart({ product, quantity });
    router.push('/cart');
  };
  return (
    <Layout>
      <div>
        <Typography variant="h1" id="PageTitle">
          Products
        </Typography>
        <Grid container spacing={3}>
          {products.map((product) => {
            return (
              <Grid item md={4} key={product._id}>
                <Card>
                  <NextLink href={`/products/${product.slug}`}>
                    <CardActionArea>
                      <CardMedia
                        component="img"
                        image={product.image}
                        title={product.name}
                      ></CardMedia>
                      <CardContent>
                        <Typography>{product.name}</Typography>
                      </CardContent>
                    </CardActionArea>
                  </NextLink>
                  <CardActions>
                    <Typography>${product.price}</Typography>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => onAddToCart(product)}
                    >
                      Add to cart
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </div>
    </Layout>
  );
};

export default Home;

// comments for this function have two solutions for
//   getServerSideProps, see 1- and 2- below
// For history see the following GitHub issue
//   https://github.com/vercel/next.js/issues/11993
// if serialization of more complex data is needed see the following:
//   https://github.com/blitz-js/superjson#using-with-nextjs
export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find({}).lean();
  // 1 - either use .lean() to strip some fields
  // const products = await Product.find({});
  await db.disconnect();
  return {
    props: {
      products: products.map(db.convertDocToObj),
      // 2 - or use the JSON.parse(JSON.stringify(data))
      // products: JSON.parse(JSON.stringify(products)),
    },
  };
}
