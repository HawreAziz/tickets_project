import request from 'supertest';
import { app } from '../../app';
import { Ticket } from "../../models/ticket";
import mongoose from 'mongoose';


it('NotFoundError when order does not exist', async () => {
    const orderId = mongoose.Types.ObjectId();
    await request(app)
        .get(`/api/orders/${orderId}`)
        .set('Cookie', global.signup())
        .expect(404)
});


it('Not authorized user requests order', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20
    });

    await ticket.save();

    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', global.signup())
        .send({ ticketId: ticket.id })
        .expect(201)

    await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', global.signup())
        .expect(401)
});

it('Fetches order', async () => {
    // create a ticket
    const ticket = Ticket.build({
        title: "concert",
        price: 20
    });

    await ticket.save();

    // make a request to create an order with that ticket
    const cookie = global.signup()
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', cookie)
        .send({ ticketId: ticket.id })
        .expect(201)


    // make a request to get the order
    const { body: fetchedOrder } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', cookie)
        .expect(201)

    expect(order.id).toEqual(fetchedOrder.id);
    expect(order.ticket.id).toEqual(fetchedOrder.ticket.id);
});