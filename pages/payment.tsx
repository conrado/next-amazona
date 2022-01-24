import {
  Button,
  FormControl,
  FormControlLabel,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import CheckoutWizard from '../components/CheckoutWizard';
import Layout from '../components/Layout';
import { IPaymentMethod, usePaymentMethod } from '../models/PaymentMethod';
import { useShippingAddress } from '../models/ShippingAddress';
import useStyles from '../utils/styles';

export default function Payment() {
  const [shippingAddress] = useShippingAddress();
  const [paymentMethod, setPaymentMethod] = usePaymentMethod();
  const router = useRouter();
  const classes = useStyles();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IPaymentMethod>({
    defaultValues: {
      paymentMethod: paymentMethod?.paymentMethod?.paymentMethod,
    },
  });
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const onFormSubmit = (formData: IPaymentMethod) => {
    setPaymentMethod(formData);
    closeSnackbar();
    router.push('/placeorder');
  };

  useEffect(() => {
    if (errors.paymentMethod && errors.paymentMethod.type === 'required') {
      enqueueSnackbar('Payment method is required', { variant: 'error' });
    }
    return closeSnackbar;
  }, [errors.paymentMethod]);

  if (paymentMethod.isLoading) {
    return <></>;
  }
  if (!shippingAddress) return <></>;
  if (!shippingAddress.isLoading && !shippingAddress?.shippingAddress) {
    router.push('/shipping');
  }
  return (
    <Layout title="Payment Method">
      <CheckoutWizard activeStep={2} />
      <form onSubmit={handleSubmit(onFormSubmit)} className={classes.form}>
        <Typography variant="h1">Payment Method</Typography>
        <List>
          <ListItem>
            <FormControl component="fieldset">
              <Controller
                name="paymentMethod"
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field }) => (
                  <RadioGroup
                    defaultValue={paymentMethod.paymentMethod?.paymentMethod}
                    {...field}
                  >
                    <FormControlLabel
                      label="Stripe"
                      value="Stripe"
                      control={<Radio />}
                    ></FormControlLabel>
                    <FormControlLabel
                      label="PayPal"
                      value="PayPal"
                      control={<Radio />}
                    ></FormControlLabel>
                    <FormControlLabel
                      label="Cash"
                      value="Cash"
                      control={<Radio />}
                    ></FormControlLabel>
                  </RadioGroup>
                )}
              />
            </FormControl>
          </ListItem>
          <ListItem>
            <Button variant="contained" type="submit" fullWidth>
              Continue
            </Button>
          </ListItem>
          <ListItem>
            <Button
              variant="contained"
              type="button"
              fullWidth
              className={classes.grayBg}
              onClick={() => {
                router.push('/shipping');
              }}
            >
              Back
            </Button>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
}
