require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const User = require('../lib/models/User');
const Message = require('../lib/models/Message');


describe('testing auth routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can send message if auth', async() => {
    const user = await User.create({
      fullname: 'Vasily',
      email: 'markovavasily@gmail.com',
      phone: +15039544973,
      password: 'hiDanny'
    });
    const vasily = request.agent(app);
    return vasily
      .post('/api/v1/auth/signin')
      .send({ fullname: 'Vasily', password: 'hiDanny' })
      .then(() => {
        return vasily
          .post('/api/v1/message/send')
          .send({
            body: 'Test Passes ',
            from: '+19712525641',
            to: '+15039893177'
          })
          .then(res => {
            expect(res.body).toEqual({
              _id: expect.any(String),
              fullname: expect.any(String),
              body: 'Test Passes',
              from: +19712525641,
              to: +15039893177,
              __v: 0
            });
          });
      });
  });
});
