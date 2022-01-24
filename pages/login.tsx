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
  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const onFormSubmit = async (formData: {
    email: string;
    password: string;
  }) => {
    const { email, password } = formData;
    try {
      const { data } = await axios.post<IUser>('/api/users/login', {
        email,
        password,
      });
      setUser({ userInfo: data, isLoading: false });
      router.push(redirectUrl || '/');
    } catch (err: any) {
      console.error(
        err.response.data ? err.response.data.message : err.message
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
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  label="Email"
                  inputProps={{ type: 'email' }}
                  {...field}
                ></TextField>
              )}
            />
          </ListItem>
          <ListItem>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  label="Password"
                  inputProps={{ type: 'password' }}
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
            <NextLink href="/register" passHref>
              <Link>Register</Link>
            </NextLink>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
}
