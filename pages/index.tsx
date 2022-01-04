import * as React from 'react';
import type { NextPage } from 'next';
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
import data from '../utils/data';

const Home: NextPage = () => {
  return (
    <Layout>
      <div>
        <h1>Products</h1>
        <Grid container spacing={3}>
          {data.products.map((product) => {
            return (
              <Grid item md={4} key={product.name}>
                <Card>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      image={product.image}
                      title={product.name}
                    ></CardMedia>
                    <CardContent>
                      <Typography>{product.name}</Typography>
                    </CardContent>
                    <CardActions>
                      <Typography>${product.price}</Typography>
                      <Button size="small" color="primary">
                        Add to cart
                      </Button>
                    </CardActions>
                  </CardActionArea>
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
