import { Document } from "mongoose";

interface IOrderGroup {
	_id: null;
	sales: number;
}
interface IOrdersPriceGroup extends Document{
	group: IOrderGroup[];
}