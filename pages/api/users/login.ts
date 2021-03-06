import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import User from '../../../models/User';
import db from '../../../utils/db';
import bcrypt from 'bcrypt';
import { signToken } from '../../../utils/auth';

const handler = nc<NextApiRequest, NextApiResponse>();

handler.post(async (req, res) => {
  await db.connect();
  const user = await User.findOne({ email: req.body.email });
  await db.disconnect();
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    const token = signToken(user);
    res.json({
      token,
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      authenticated: true,
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

export default handler;
