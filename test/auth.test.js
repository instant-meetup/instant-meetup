require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const User = require('../lib/models/User');

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

  it('creates a user', () => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send({ 
        fullname: 'Vasily',
        email: 'markovavasily@gmail.com',
        phone: +15039544973,
        password: 'hiDanny',
        location: '-29.52974, 24.52815'
      })
      .then(res => {        
        expect(res.body).toEqual({
          _id: expect.any(String),
          fullname: 'Vasily',
          email: 'markovavasily@gmail.com',
          phone: +15039544973,
          location: '-29.52974, 24.52815'
        });
      });
  });

  it('signs in a user', async() => {
    const user = await User.create({
      fullname: 'Danny',
      email: 'suarezd10@gmail.com',
      phone: +15039893177,
      password: '123456',
      location: '-29.52974, 24.52815'
    });

    return request(app)
      .post('/api/v1/auth/signin')
      .send({
        fullname: 'Danny',
        password: '123456',
      })
      .then(res=> {
        expect(res.body).toEqual({
          _id: expect.any(String),
          fullname: user.fullname,
          email: 'suarezd10@gmail.com',
          phone: +15039893177,
          location: '-29.52974, 24.52815'
        });
      });
  });

  it('it verifies', async() => {
    await User.create({
      fullname: 'Danny',
      email: 'suarezd10@gmail.com',
      phone: +15039893177,
      password: '123456',
      location: '-29.52974, 24.52815'
    });

    const danny = request.agent(app);
    return danny
      .post('/api/v1/auth/signin')
      .send({ fullname: 'Danny', password: '123456' })
      .then(() => {
        return danny
          .get('/api/v1/auth/verify');
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          fullname: 'Danny',
          email: 'suarezd10@gmail.com',
          phone: +15039893177,
          location: '-29.52974, 24.52815'
        });
      });
  });

  it('can sign out a user', async() => {
    await User.create({
      fullname: 'Alex',
      email: 'alex@gmail.com',
      phone: +18052761296,
      password: 'hiDanny',
      location: '-29.52974, 24.52815'
    });
    const alex = request.agent(app);
    return alex
      .post('/api/v1/auth/signin')
      .send({ fullname: 'Alex', password: 'hiDanny' })
      .then(() => {
        return alex
          .get('/api/v1/auth/signout');
      })
      .then(res => {        
        expect(res.body).toEqual({
          message: 'See you next time!'
        });
      });
  });
});
