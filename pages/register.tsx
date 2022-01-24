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

export default function Register() {
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
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });
  const onFormSubmit = async (formData: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    const { name, email, password, confirmPassword } = formData;
    if (password !== confirmPassword) {
      alert("passwords don't match");
      return;
    }
    try {
      const { data } = await axios.post<IUser>('/api/users/register', {
        name,
        email,
        password,
        confirmPassword,
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
    <Layout title="Register">
      <form onSubmit={handleSubmit(onFormSubmit)} className={classes.form}>
        <Typography variant="h1">Login</Typography>
        <List>
          <ListItem>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  label="Name"
                  inputProps={{ type: 'text' }}
                  {...field}
                ></TextField>
              )}
            />
          </ListItem>
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
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  label="Confirm Password"
                  inputProps={{ type: 'password' }}
                  {...field}
                ></TextField>
              )}
            />
          </ListItem>
          <ListItem>
            <Button variant="contained" type="submit" fullWidth>
              Register
            </Button>
          </ListItem>
          <ListItem>
            Already have an account?&nbsp;
            <NextLink href={`/login?redirect=${redirectUrl || '/'}`} passHref>
              <Link>Login</Link>
            </NextLink>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
}
