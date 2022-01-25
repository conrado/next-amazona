import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { ErrorHandler } from 'next-connect';
import db from './db';

export const getError = (err: any) => {
  return err.response && err.response.data && err.response.data.message
    ? err.response.data.message
    : err.message;
};

export const onError: ErrorHandler<NextApiRequest, NextApiResponse> = async (
  err,
  req,
  res,
  next
) => {
  await db.disconnect();
  res.status(500).send({ message: err.toString() });
};
