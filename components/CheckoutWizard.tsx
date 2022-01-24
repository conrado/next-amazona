import { Step, StepLabel, Stepper } from '@mui/material';
import useStyles from '../utils/styles';

interface Props {
  activeStep?: number;
}

export default function CheckoutWizard({ activeStep = 0 }: Props) {
  const classes = useStyles();
  return (
    <Stepper
      className={classes.stepper}
      activeStep={activeStep}
      alternativeLabel
    >
      {['Login', 'Shipping Address', 'Payment Method', 'Place Order'].map(
        (step) => (
          <Step key={step}>
            <StepLabel>{step}</StepLabel>
          </Step>
        )
      )}
    </Stepper>
  );
}
