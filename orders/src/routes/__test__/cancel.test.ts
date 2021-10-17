import { app } from '../../app';
import request from 'supertest'
import mongoose from 'mongoose';
import { Ticket } from '../../models/ticket';
import { Order } from '../../models/order';
import { OrderStatus } from '@hacommon/common';


it('NotFoundError when order does not exist', async () => {
    await request(app)
        .post(`/api/orders/${mongoose.Types.ObjectId()}`)
        .set('Cookie', global.signup())
        .expect(404)
});


it('user not signed in is not allowed to access resources', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20
    });

    await ticket.save();

    // make a request to create an order with that ticket
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', global.signup())
        .send({ ticketId: ticket.id })
        .expect(201)

    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', global.signup())
        .expect(401)
});


it('fetches order', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20
    });

    await ticket.save();

    const user = global.signup();
    // make a request to create an order with that ticket
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201)

    const { body: fetchedOrder } = await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .expect(204)

    const updatedOrder = await Order.findById(order.id).populate('ticket');
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});