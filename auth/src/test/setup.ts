import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';

let mongodb: MongoMemoryServer;

declare global {
  namespace NodeJS {
    interface Global {
      signup(): Promise<string[]>
    }
  }
}

beforeAll(async () => {
  // setup mongodb
  process.env.JWT_KEY = "askfddfk";
  mongodb = new MongoMemoryServer();
  const uri = await mongodb.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  });
});

beforeEach(async () => {
  // delete collections
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});


afterAll(async () => {
  // stop mongodb
  await mongodb.stop();
  await mongoose.connection.close();
});


global.signup = async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: "test@test.com",
      password: "12345678"
    })
    .expect(201);
  const cookie = response.get('Set-Cookie');
  expect(cookie).toBeDefined();
  return cookie;
}
