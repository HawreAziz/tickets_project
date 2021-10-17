import express from 'express';
// async error handling
import 'express-async-errors';
import { NotFoundError, errorHandler, currentUser } from '@hacommon/common';
import cookieSession from 'cookie-session';
import { json } from 'body-parser';
import { createOrderRouter } from './routes/new';
import { cancelOrderRouter } from './routes/cancel';
import { showOrderRouter } from './routes/show';
import { indexOrderRouter } from './routes';


const app = express();

app.set('trust proxy', true);
app.use(json());


app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test'
}
));


// middlewares
app.use(currentUser);

// create routes
app.use(createOrderRouter);
app.use(cancelOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter)




app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
