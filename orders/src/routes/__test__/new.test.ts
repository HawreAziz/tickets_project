import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order } from '../../models/order';
import { OrderStatus } from '@hacommon/common';


it('Can only be accessed if the user is signed in', async () => {
    await request(app)
        .post('/api/orders')
        .send({})
        .expect(401);
});


it('Should not be found if the ticket does not exist', async () => {
    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signup())
        .expect(404)
});


it('Bad request if ticket already reserved', async () => {

    const ticket = Ticket.build({
        title: 'concert',
        price: 20
    });
    await ticket.save();

    const order = Order.build({
        userId: "1234",
        status: OrderStatus.Created,
        expiresAt: new Date(),
        ticket
    });

    await order.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signup())
        .send({ ticketId: ticket.id })
        .expect(400)
});


it('Revers a ticket', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20
    });
    await ticket.save()

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signup())
        .send({ ticketId: ticket.id })
        .expect(201)
});
