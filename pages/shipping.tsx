import { useRouter } from 'next/router';
import Layout from '../components/Layout';

export default function Shipping() {
  const router = useRouter();
  router.push('/login');
  return <Layout>Shipping</Layout>;
}