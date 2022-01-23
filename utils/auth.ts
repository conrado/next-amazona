import jwt from 'jsonwebtoken';
import { IUser } from '../models/User';

export const signToken = (user: IUser) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET || 'jwt_s3cr3t',
    {
      expiresIn: '30d',
    }
  );
};
