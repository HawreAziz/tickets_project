import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from "@hacommon/common";
import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { Order } from '../models/order';
import { OrderCreatedPublisher } from "../events/publisher/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";


const router = Router();

const EXPIRATION_WINDOW_SECONDS = 60;


router.post('/api/orders', requireAuth, validateRequest, [
    body('ticketId')
        .not()
        .isEmpty()
        .withMessage('ticketId must be provided.')
], async (request: Request, response: Response) => {
    const { ticketId } = request.body;
    // Fetch the ticket with the ticketId.
    // if there is not a ticket return early NotFound
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
        throw new NotFoundError();
    }

    // Find an order with that ticket
    // If an order is found return early, badRequest order exists with that ticket
    const isReserved = await ticket.isReserved();
    if (isReserved) {
        throw new BadRequestError('Ticket is already reserved');
    }


    // set expiration
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + 15 * EXPIRATION_WINDOW_SECONDS);

    // Add ticket to the order and save it back to the database
    const order = Order.build({
        userId: request.currentUser!.id,
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket
    });

    await order.save();

    // publish an event saying that the order was created.
    new OrderCreatedPublisher(natsWrapper.client).publish({
        userId: order.userId,
        id: order.id,
        status: order.status,
        expiresAt: expiration,
        ticket: {
            id: ticket.id,
            title: ticket.title,
            price: ticket.price
        }
    });

    response.status(201).send(order);
});


export { router as createOrderRouter };