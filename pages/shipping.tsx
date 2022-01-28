import { Button, List, ListItem, TextField, Typography } from '@mui/material';
import Layout from '../components/Layout';
import useStyles from '../utils/styles';
import { useForm, Controller } from 'react-hook-form';
import { useUser } from '../models/UserState';
import { useRouter } from 'next/router';
import {
  IShippingAddress,
  useShippingAddress,
} from '../models/ShippingAddress';
import CheckoutWizard from '../components/CheckoutWizard';
import { useEffect } from 'react';

export default function Shipping() {
  const [user] = useUser();
  const [shippingAddress, setShippingAddress] = useShippingAddress();
  const router = useRouter();
  const classes = useStyles();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IShippingAddress>({
    defaultValues: {
      fullName: shippingAddress?.fullName || '',
      address: shippingAddress?.address || '',
      city: shippingAddress?.city || '',
      postalCode: shippingAddress?.postalCode || '',
      country: shippingAddress?.country || '',
    },
  });

  const onFormSubmit = (formData: IShippingAddress) => {
    const { fullName, address, city, postalCode, country } = formData;
    setShippingAddress({ fullName, address, city, postalCode, country });
    router.push('/payment');
  };
  useEffect(() => {
    if (!user || (user && !user.authenticated)) {
      router.push('/login?redirect=/shipping');
    }
  }, [user]);
  return (
    <Layout title="Shipping">
      <CheckoutWizard activeStep={1} />
      <form onSubmit={handleSubmit(onFormSubmit)} className={classes.form}>
        <Typography variant="h1">Shipping Address</Typography>
        <List>
          <ListItem>
            <Controller
              name="fullName"
              control={control}
              defaultValue={shippingAddress?.fullName}
              rules={{
                required: true,
                minLength: 2,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  label="Full Name"
                  error={Boolean(errors.fullName)}
                  helperText={
                    errors.fullName
                      ? errors.fullName.type === 'minLength'
                        ? 'Name is too short'
                        : 'Name is required'
                      : ''
                  }
                  {...field}
                ></TextField>
              )}
            />
          </ListItem>
          <ListItem>
            <Controller
              name="address"
              control={control}
              defaultValue={shippingAddress?.address}
              rules={{
                required: true,
                minLength: 2,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  label="Address"
                  error={Boolean(errors.address)}
                  helperText={
                    errors.address
                      ? errors.address.type === 'minLength'
                        ? 'Address is too short'
                        : 'Address is required'
                      : ''
                  }
                  {...field}
                ></TextField>
              )}
            />
          </ListItem>
          <ListItem>
            <Controller
              name="city"
              control={control}
              defaultValue={shippingAddress?.city}
              rules={{
                required: true,
                minLength: 2,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  label="City"
                  error={Boolean(errors.city)}
                  helperText={
                    errors.city
                      ? errors.city.type === 'minLength'
                        ? 'City is too short'
                        : 'City is required'
                      : ''
                  }
                  {...field}
                ></TextField>
              )}
            />
          </ListItem>
          <ListItem>
            <Controller
              name="postalCode"
              control={control}
              defaultValue={shippingAddress?.postalCode}
              rules={{
                required: true,
                minLength: 2,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  label="Postal Code"
                  error={Boolean(errors.postalCode)}
                  helperText={
                    errors.postalCode
                      ? errors.postalCode.type === 'minLength'
                        ? 'Postal Code is too short'
                        : 'Postal Code is required'
                      : ''
                  }
                  {...field}
                ></TextField>
              )}
            />
          </ListItem>
          <ListItem>
            <Controller
              name="country"
              control={control}
              defaultValue={shippingAddress?.country}
              rules={{
                required: true,
                minLength: 2,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  label="Contry"
                  error={Boolean(errors.country)}
                  helperText={
                    errors.country
                      ? errors.country.type === 'minLength'
                        ? 'Country is too short'
                        : 'Country is required'
                      : ''
                  }
                  {...field}
                ></TextField>
              )}
            />
          </ListItem>
          <ListItem>
            <Button variant="contained" type="submit" fullWidth>
              Continue
            </Button>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
}
