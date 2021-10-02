import { Router, Request, Response } from 'express';
import { Ticket } from '../model/ticket';


const router = Router();

router.get('/api/tickets', async (req: Request, res: Response) => {
  const tickets = await Ticket.find({});
  res.status(201).send({ tickets });
});

export { router as showAllTickets };
