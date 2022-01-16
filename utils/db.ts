import mongoose, { MongooseOptions } from 'mongoose';

interface Connection {
  isConnected: number;
}
const connection: Connection = {
  isConnected: 0,
};

const connect = async () => {
  if (connection.isConnected) {
    // console.log('already connected! no need to reconnect');
  }
  if (mongoose.connections.length > 0) {
    connection.isConnected = mongoose.connections[0].readyState;
    if (connection.isConnected === 1) {
      // console.log('use a previous established connection');
      return;
    }
    await mongoose.disconnect();
  }
  const db = await mongoose.connect(
    process.env.MONGODB_URI as string,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as MongooseOptions
  );
  // console.log('using a new connection');
  connection.isConnected = db.connections[0].readyState;
};

const disconnect = async () => {
  if (connection.isConnected) {
    if (process.env.NODE_ENV === 'production') {
      await mongoose.disconnect();
      connection.isConnected = 0;
    } else {
      // console.log('we are in dev mode. not disconnecting');
    }
  }
};

const convertDocToObj = (doc: any) => {
  doc._id = doc._id.toString();
  doc.createdAt = doc.createdAt.toString();
  doc.updatedAt = doc.updatedAt.toString();
  return doc;
};

const db = { connect, disconnect, mongoose, convertDocToObj };

export default db;
