import request from 'supertest';
import { app } from '../../app';


it("Return 200 on successful signin", async () => {
  await global.signup();

  await request(app)
    .post('/api/users/signin')
    .send({
      email: "test@test.com",
      password: "12345678"
    })
    .expect(200)
});


it("Fails when email does not exist", async () => {
  return request(app)
    .post('/api/users/signin')
    .send({
      email: "test@test.com",
      password: "12345669"
    })
    .expect(400);
});


it("Return 400 when email is invalid", async () => {
  return request(app)
    .post('/api/users/signin')
    .send({
      email: "testcom",
      password: "12345669"
    })
    .expect(400);
});


it("Return 400 when password is empty", async () => {
  return request(app)
    .post('/api/users/signin')
    .send({
      email: "test@test.com",
      password: ""
    })
    .expect(400);
});


it("Return 400 when password does not match", async () => {
  await global.signup();

  await request(app)
    .post('/api/users/signin')
    .send({
      email: "test@test.com",
      password: "123450977"
    })
    .expect(400)
});


it("Return cookie on successful request", async () => {
  await global.signup();

  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: "test@test.com",
      password: "12345678"
    })
    .expect(200)
  expect(response.get('Set-Cookie')).toBeDefined();
})
