import { OrderStatus } from '@hacommon/common';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';


const createTicket = async () => {
    const ticket = Ticket.build({
        title: "concert",
        price: 20
    });

    await ticket.save();
    return ticket;
}

it('error when order does not exist', async () => {
    const response = await request(app)
        .get('/api/orders')
        .set('Cookie', global.signup())
    expect(response.body).toEqual([])
});


it('fetch user order', async () => {
    // create a ticket and save it to the db
    const ticket = await createTicket();


    const cookie = global.signup();

    // create an order
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', cookie)
        .send({ ticketId: ticket.id })

    const { body: orders } = await request(app)
        .get('/api/orders')
        .set('Cookie', cookie)

    expect(orders.length).toEqual(1);
    expect(orders[0].userId).toEqual(order.userId);
    expect(orders[0].ticket.id).toEqual(ticket.id);
});




it('fetchs orders for a particular user', async () => {
    // create three tickets
    const ticketOne = await createTicket();
    const ticketTwo = await createTicket();
    const ticketThree = await createTicket();


    const user1 = global.signup();
    const user2 = global.signup();

    // create 1 order as user 1
    const { body: order1 } = await request(app)
        .post('/api/orders')
        .set('Cookie', user1)
        .send({ ticketId: ticketOne.id })
        .expect(201)


    // create 2 order as user 2
    const { body: order2 } = await request(app)
        .post('/api/orders')
        .set('Cookie', user2)
        .send({ ticketId: ticketTwo.id })
        .expect(201)

    await request(app)
        .post('/api/orders')
        .set('Cookie', user2)
        .send({ ticketId: ticketThree.id })
        .expect(201)


    // make request to get orders for  user 2
    const { body: ordersUser2 } = await request(app).get('/api/orders').set('Cookie', user2)


    expect(ordersUser2.length).toEqual(2);
    expect(ordersUser2[0].ticket.id).toEqual(ticketTwo.id);
    expect(ordersUser2[1].ticket.id).toEqual(ticketThree.id);
    expect(ordersUser2[0].userId).toEqual(order2.userId);
    expect(ordersUser2[1].userId).toEqual(order2.userId);
});