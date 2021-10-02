import request from 'supertest';
import { app } from '../../app';

const createTicket = async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({
      title: "concert",
      price: 20
    })
    .expect(201);
}

it('can fetch a list of tickets', async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const response = await request(app)
    .get('/api/tickets')
    .expect(201);

  expect(response.body.tickets.length).toEqual(3);

});
