import { Document, SchemaTimestampsConfig } from 'mongoose';
import { IPaymentMethod } from './PaymentMethod';
import { IShippingAddress } from './ShippingAddress';
import { ICartItem } from './ShoppingCart';
import { IUser } from './UserInterface';

export interface IOrder extends Document, SchemaTimestampsConfig {
  user: IUser;
  orderItems: ICartItem[];
  shippingAddress: IShippingAddress;
  paymentMethod: IPaymentMethod;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  paidAt?: Date;
  deliveredAt?: Date;
}
