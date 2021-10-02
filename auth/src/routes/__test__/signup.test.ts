import request from 'supertest';
import { app } from '../../app';

it("Return 201 on successfull request", async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: "test@test.com",
      password: "12345676"
    })
    .expect(201);
});


it("Return 400 on invalid email", async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: "fhjkldsafdflkjdfj",
      password: "12343545"
    })
    .expect(400);
});


it("Return 400 on invalid password", async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: "test@test.com",
      password: "123"
    })
    .expect(400)
});

it("Return 400 with missing email and password", async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: "test@test.com",
      password: ""
    })
    .expect(400)

  await request(app)
    .post('/api/users/signup')
    .send({
      email: "",
      password: "12345556667"
    })
    .expect(400)
});

it("Multiple signup using a single email is not allowed", async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: "test@test.com",
      password: "1234546"
    })
    .expect(201)

  await request(app)
    .post('/api/users/signup')
    .send({
      email: "test@test.com",
      password: "123456"
    })
    .expect(400)
});


it('Sets a cookie after a successfull request', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: "test@test.com",
      password: "123456787"
    });
  expect(response.get('Set-Cookie')).toBeDefined();
})
