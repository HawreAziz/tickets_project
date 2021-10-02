import { Router, Request, Response } from 'express';
import { requireAuth, validateRequest } from '@hacommon/common';
import { body } from 'express-validator';
import { Ticket } from '../model/ticket';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';


const router = Router();

router.post('/api/tickets', requireAuth,
  [
    body('title')
      .not()
      .isEmpty()
      .withMessage('Title is required.'),
    body('price')
      .isFloat({ gt: 0 })
  ], validateRequest, async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id
    });

    await ticket.save();
    const ticketCreated = new TicketCreatedPublisher(natsWrapper.client)
    await ticketCreated.publish({
      title: ticket.title,
      price: ticket.price,
      id: ticket.id,
      userId: ticket.userId
    });
    res.status(201).send(ticket);
  });


export { router as createTicket };
