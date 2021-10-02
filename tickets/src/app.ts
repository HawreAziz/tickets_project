import express from 'express';
// async error handling
import 'express-async-errors';
import { NotFoundError, errorHandler, currentUser } from '@hacommon/common';
import cookieSession from 'cookie-session';
import { json } from 'body-parser';
import {
  createTicket,
  showAllTickets,
  showTicketById,
  updateTicket
} from './routes';

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

// routes
app.use(createTicket);
app.use(showAllTickets);
app.use(showTicketById);
app.use(updateTicket);


app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
