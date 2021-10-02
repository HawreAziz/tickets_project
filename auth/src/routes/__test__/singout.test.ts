import request from 'supertest';
import { app } from '../../app';


it("Signout a logged in user", async () => {
  await global.signup();

  await request(app)
    .post('/api/users/signin')
    .send({
      email: "test@test.com",
      password: "12345678"
    })
    .expect(200)

  const response = await request(app)
    .post('/api/users/signout')
    .expect({})
  expect(response.get('Set-Cookie')[0]).toEqual('express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly');
})
