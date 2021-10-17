import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

let mongodb: MongoMemoryServer;

declare global {
  var signup: () => string[]
}

jest.mock('../nats-wrapper');

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
  jest.clearAllMocks();
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


global.signup = () => {
  // create json data
  const userData = {
    id: mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  }

  // using jsonwebtoken sign it
  const token = jwt.sign(userData, process.env.JWT_KEY!);

  // build session object
  const session = { jwt: token }

  // convert to json object
  const sessionJSON = JSON.stringify(session);

  // use base64 of jsonwebtoken
  const base64 = Buffer.from(sessionJSON).toString('base64');
  return [`express:sess=${base64}`];
};
