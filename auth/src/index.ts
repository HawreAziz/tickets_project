import { DatabaseConnectionError, EnvironmentError } from '@hacommon/common';
import mongoose from 'mongoose';
import { app } from './app';

const PORT = 3002;

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY is not set');
  }

  if (!process.env.AUTH_MONGO_URI) {
    throw new EnvironmentError('MONGO_URI is not set');
  }
  try {
    await mongoose.connect(process.env.AUTH_MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    console.log("Connected to the database");
  } catch (error) {
    throw new DatabaseConnectionError();
  }
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}!`);
  });
}

start();
