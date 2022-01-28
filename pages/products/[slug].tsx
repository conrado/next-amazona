import Layout from '../../components/Layout';
import NextLink from 'next/link';
import Image from 'next/image';
import {
  Button,
  Card,
  Grid,
  Link,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import useStyles from '../../utils/styles';
import db from '../../utils/db';
import Product from '../../models/Product';
import { IProduct } from '../../models/ProductState';
import { GetServerSideProps } from 'next';
import axios from 'axios';
import { useShoppingCart } from '../../models/ShoppingCart';
import { useRouter } from 'next/router';

interface Props {
  product: IProduct;
}

export default function ProductDetailPage({ product }: Props) {
  const router = useRouter();
  const [, updateCart, , getQuantity] = useShoppingCart();
  const classes = useStyles();
  if (!product) {
    return <div>Product not found</div>;
  }
  const onAddToCart = async () => {
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
    <Layout title={product.name} description={product.description}>
      <div className={classes.section}>
        <NextLink href="/" passHref>
          <Link>
            <Typography>back to products</Typography>
          </Link>
        </NextLink>
      </div>
      <Grid container spacing={1}>
        <Grid item md={6} xs={12}>
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
            layout="responsive"
          ></Image>
        </Grid>
        <Grid item md={3} xs={12}>
          <List>
            <ListItem>
              <Typography variant="h1">{product.name}</Typography>
            </ListItem>
            <ListItem>
              <Typography>Category: {product.category}</Typography>
            </ListItem>
            <ListItem>
              <Typography>Brand: {product.brand}</Typography>
            </ListItem>
            <ListItem>
              <Typography>
                Rating: {product.rating} stars ({product.numReviews} reviews)
              </Typography>
            </ListItem>
            <ListItem>
              <Typography>Description: {product.description}</Typography>
            </ListItem>
          </List>
        </Grid>
        <Grid item md={3} xs={12}>
          <Card>
            <List>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Price</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>$ {product.price}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Status</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>
                      {product.countInStock > 0 ? 'In stock' : 'Unavailable'}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={onAddToCart}
                >
                  Add to Cart
                </Button>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

// comments for this function have two solutions for
//   getServerSideProps, see 1- and 2- below
// For history see the following GitHub issue
//   https://github.com/vercel/next.js/issues/11993
// if serialization of more complex data is needed see the following:
//   https://github.com/blitz-js/superjson#using-with-nextjs
export const getServerSideProps: GetServerSideProps = async (context) => {
  const slug = context.params?.slug;
  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  // 1 - either use .lean() to strip some fields
  // const products = await Product.findOne({slug});
  await db.disconnect();
  return {
    props: {
      product: db.convertDocToObj(product),
      // 2 - or use the JSON.parse(JSON.stringify(data))
      // product: JSON.parse(JSON.stringify(product)),
    },
  };
};
