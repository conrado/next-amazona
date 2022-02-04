import { NextApiResponse } from 'next';
import nc from 'next-connect';
import Order from '../../../../models/Order';
import db from '../../../../utils/db';
import { isAuth, NextApiRequestWithUser } from '../../../../utils/auth';
import { onError } from '../../../../utils/error';

const handler = nc<NextApiRequestWithUser, NextApiResponse>({
  onError,
});
handler.use(isAuth);

handler.put(async (req, res) => {
  await db.connect();
  const order = await Order.findById(req.query.id);
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      email_address: req.body.email_address,
    };
    const paidOrder = await order.save();
    res.status(201).json({ message: 'order paid', order: paidOrder });
  } else {
    res.status(404).json({ message: 'order not found' });
  }
  await db.disconnect();
});

export default handler;
