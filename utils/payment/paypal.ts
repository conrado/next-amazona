import { ReactPayPalScriptOptions } from '@paypal/react-paypal-js';

const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;

export const PayPalOptions: ReactPayPalScriptOptions = {
  'client-id': CLIENT_ID || '',
  'data-react-paypal-script-id': '',
};
