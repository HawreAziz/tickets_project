import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';


it("returns 404 if the ticket is not found", async () => {
  // generate a mongoose id
  const id = mongoose.Types.ObjectId().toHexString();
  await request(app)
    .get(`/api/tickets/${id}`)
    .send()
    .expect(404);
});


it("returns the ticket that ticket is found", async () => {
  const ticket = {
    title: 'concert',
    price: 20
  };

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send(ticket)
    .expect(201)

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .expect(200);

  const { id, title, price } = ticketResponse.body.ticket;
  expect(id).toEqual(response.body.id);
  expect(title).toEqual(ticket.title);
  expect(price).toEqual(ticket.price);
});
