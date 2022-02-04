import { NextApiResponse } from 'next';
import nc from 'next-connect';
import Order from '../../../models/Order';
import db from '../../../utils/db';
import { isAuth, NextApiRequestWithUser } from '../../../utils/auth';
import { onError } from '../../../utils/error';

const handler = nc<NextApiRequestWithUser, NextApiResponse>({
  onError,
});
handler.use(isAuth);

handler.get(async (req, res) => {
  await db.connect();
  const orders = await Order.find({ user: req.user?._id });
  console.log({ orders });
  await db.disconnect();
  res.json({ orders });
});

export default handler;
