import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';


it('returns not 401 not authorized if user not authorized', async () => {
  const id = mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'concert',
      price: 20
    }).expect(401);
});


it('return 404 if ticket not found', async () => {
  const id = mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signup())
    .send({
      title: "concert",
      price: 20
    }).expect(404);
});


it('return 401 if user does not own the ticket', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({
      title: 'concert',
      price: 20
    }).expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signup())
    .send({
      title: 'movie',
      price: 30
    }).expect(401);
});


it('retuns 400 if the user provides invalid title or price', async () => {
  const cookie = global.signup();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'concert',
      price: 50
    }).expect(201);

  const { id } = response.body;

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', cookie)
    .send({
      title: "",
      price: 20
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', cookie)
    .send({
      title: "concert",
      price: -10
    }).expect(400);
});

it('changes the ticket if ticket is found', async () => {
  const cookie = global.signup();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'concert',
      price: 20
    })
    .expect(201)

  const ticket = {
    title: 'theater',
    price: 50
  };

  const ticketResponse = await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send(ticket);
  const { title, price } = ticketResponse.body.ticket;
  expect(title).toEqual(ticket.title);
  expect(price).toEqual(ticket.price);
});

it("publishes en event", async () => {
  const cookie = global.signup();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'concert',
      price: 20
    })
    .expect(201)

  const ticket = {
    title: 'theater',
    price: 50
  };

  const ticketResponse = await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send(ticket);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
})