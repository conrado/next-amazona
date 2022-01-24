import {
  Button,
  Link,
  List,
  ListItem,
  TextField,
  Typography,
} from '@mui/material';
import Layout from '../components/Layout';
import useStyles from '../utils/styles';
import NextLink from 'next/link';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import { IUser } from '../models/UserInterface';
import { useUser } from '../models/UserState';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

export default function Login() {
  const [user, setUser] = useUser();
  const router = useRouter();
  const { redirect } = router.query;
  const redirectUrl = redirect
    ? redirect instanceof Array
      ? redirect[0]
      : redirect
    : undefined;
  const classes = useStyles();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const onFormSubmit = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    closeSnackbar();
    try {
      const { data } = await axios.post<IUser>('/api/users/login', {
        email,
        password,
      });
      setUser({ userInfo: data, isLoading: false });
      router.push(redirectUrl || '/');
    } catch (err: any) {
      enqueueSnackbar(
        err.response.data ? err.response.data.message : err.message,
        { variant: 'error' }
      );
    }
  };
  if (!user?.isLoading && user?.userInfo) {
    router.push(redirectUrl || '/');
  }
  return (
    <Layout title="Login">
      <form onSubmit={handleSubmit(onFormSubmit)} className={classes.form}>
        <Typography variant="h1">Login</Typography>
        <List>
          <ListItem>
            <Controller
              name="email"
              control={control}
              rules={{
                required: true,
                pattern: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  label="Email"
                  inputProps={{ type: 'email' }}
                  error={Boolean(errors.email)}
                  helperText={
                    errors.email
                      ? errors.email.type === 'pattern'
                        ? 'Email is not valid'
                        : 'Email is required'
                      : ''
                  }
                  {...field}
                ></TextField>
              )}
            />
          </ListItem>
          <ListItem>
            <Controller
              name="password"
              control={control}
              rules={{
                required: true,
                minLength: 6,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  label="Password"
                  inputProps={{ type: 'password' }}
                  error={Boolean(errors.password)}
                  helperText={
                    errors.password
                      ? errors.password.type === 'minLength'
                        ? 'Password too short'
                        : 'Password is required'
                      : ''
                  }
                  {...field}
                ></TextField>
              )}
            />
          </ListItem>
          <ListItem>
            <Button variant="contained" type="submit" fullWidth>
              Login
            </Button>
          </ListItem>
          <ListItem>
            Don't have an account?&nbsp;
            <NextLink
              href={`/register?redirect=${redirectUrl || '/'}`}
              passHref
            >
              <Link>Register</Link>
            </NextLink>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
}
