import mongoose from 'mongoose';
import { app } from './app';
import { DatabaseConnectionError, EnvironmentError } from '@hacommon/common';
import { natsWrapper } from './nats-wrapper';
import { TicketCreatedPublisher } from './events/publishers/ticket-created-publisher';

const PORT = 3001;

const start = async () => {
  const { JWT_KEY, TICKETS_MONGO_URI, NATS_CLIENT_ID, NATS_CLUSTER_ID } = process.env;
  if (!JWT_KEY) {
    throw new Error('JWT_KEY not set');
  }

  if (!TICKETS_MONGO_URI) {
    throw new EnvironmentError(`MONGO_URI is not set`);
  }


  if (!NATS_CLUSTER_ID) {
    throw new EnvironmentError('NATS_CLUSTER_ID is not set');
  }

  if (!NATS_CLIENT_ID) {
    throw new EnvironmentError('NATS_CLIENT_ID is not set');
  }

  try {
    await natsWrapper.connect(NATS_CLUSTER_ID, NATS_CLIENT_ID, 'http://nats-srv:4222');
    natsWrapper.client.on('close', () => {
      console.log('Event colsed gracefully');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());
    await mongoose.connect(TICKETS_MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    console.log('Database connected successfully');
  } catch (error) {
    throw new DatabaseConnectionError();
  }


  app.listen(PORT, () => {
    console.log('Tickets listening on port', PORT);
  });
}

start();
