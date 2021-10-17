import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../model/ticket'
import { natsWrapper } from '../../nats-wrapper';


it("Send a request make sure the route exist", async () => {
  const response = await request(app)
    .post('/api/tickets')
    .send({});
  expect(response.status).not.toEqual(404)
});


it("can only be accessed only if the user is signed in", async () => {
  await request(app)
    .post('/api/tickets')
    .send({})
    .expect(401);
});

it("returns a status code other than 401 if the user is signed in", async () => {
  const response = await request(app)
    .post('/api/tickets')
    .send({})
    .set('Cookie', global.signup())
  expect(response.status).not.toEqual(401);
});

it("returns error if the title is invalid", async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({
      title: '',
      price: 20
    })
    .expect(400);
});


it("returns error if the price is invalid", async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({
      title: "Concert",
      price: -10
    })
    .expect(400);
});


it("creates a ticket with valid input", async () => {
  const ticket = {
    title: 'concert',
    price: 20,
  };

  // make sure the database is empty
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);


  // create a ticket
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send(ticket)
    .expect(201);

  // make sure the tickets are the same
  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  const { price, title } = tickets[0];
  expect(ticket.price).toEqual(price);
  expect(ticket.title).toEqual(title);

});

it('publishes an event', async () => {
  const ticket = {
    title: 'concert',
    price: 20,
  };

  // make sure the database is empty
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);


  // create a ticket
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send(ticket)
    .expect(201);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
})