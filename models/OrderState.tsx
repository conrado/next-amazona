import { Document } from 'mongoose';
import { IPaymentMethod } from './PaymentMethod';
import { IShippingAddress } from './ShippingAddress';
import { ICartItem } from './ShoppingCart';

export interface IOrder extends Document {
  user: string;
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
