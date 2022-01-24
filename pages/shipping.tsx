import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useUser } from '../models/UserState';

export default function Shipping() {
  const router = useRouter();
  const [user] = useUser();
  if (!user) return <></>;
  if (!user?.isLoading && !user.userInfo) {
    router.push('/login?redirect=/shipping');
  }
  return <Layout>Shipping</Layout>;
}
