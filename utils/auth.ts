import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { Middleware } from 'next-connect';
import { IUser } from '../models/UserInterface';

const FALLBACK_SECRET = 'jwt_s3cr3t';

export const signToken = (user: IUser) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET || FALLBACK_SECRET,
    {
      expiresIn: '30d',
    }
  );
};

export type NextApiRequestWithUser = NextApiRequest & {
  user?: IUser;
};

export const isAuth: Middleware<
  NextApiRequestWithUser,
  NextApiResponse
> = async (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization) {
    const token = authorization.slice(7, authorization.length);
    jwt.verify(
      token,
      process.env.JWT_SECRET || FALLBACK_SECRET,
      (err, decode) => {
        if (err) {
          res.status(401).json({ message: 'Token is not valid' });
        } else {
          req.user = decode as IUser;
          next();
        }
      }
    );
  } else {
    res.status(401).send({ message: 'Token is not supplied' });
  }
};

export const isAdmin: Middleware<
  NextApiRequestWithUser,
  NextApiResponse
> = async (req, res, next) => {
  if (req.user?.isAdmin) {
    next();
  } else {
    res.status(401).send({ message: 'User is not admin' });
  }
};
