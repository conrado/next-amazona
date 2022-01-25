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

handler.post(async (req, res) => {
  await db.connect();
  const newOrder = new Order({
    ...req.body,
    user: req?.user?._id,
  });
  const order = await newOrder.save();
  await db.disconnect();
  res.status(201).json(order);
});

export default handler;
