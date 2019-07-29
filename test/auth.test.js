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
            username: 'Vasily',
            email: 'markovavasily@gmail.com',
            phone: +15039544973,
            password: 'hiDanny'
        })
        .then( res => {
            expect(res.body).toEqual({
                _id: expect.any(String),
                username: 'Vasily',
                email: 'markovavasily@gmail.com',
                phone: +15039544973
            });
        });
    });

    it('signs in a user', async() => {
        const user = await User.create({
            username: 'Danny',
            email: 'suarezd10@gmail.com',
            phone: +15039893177,
            password: '123456'
        })

        return request(app)
            .post('/api/v1/auth/signin')
            .send({
                username: 'Danny',
                password: '123456',
            })
            .then(res=> {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    username: user.username,
                    email: 'suarezd10@gmail.com',
                    phone: +15039893177
                })
            })
    })

    it('it verifus', async() => {
        await User.create({
            username: 'Danny',
            email: 'suarezd10@gmail.com',
            phone: +15039893177,
            password: '123456'
        })

        const danny = request.agent(app);
        return danny
            .post('/api/v1/auth/signin')
            .send({ username: 'Danny', password: '123456'})
            .then(() => {
                return danny
                    .get('/api/v1/auth/verify');
            })
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    username: 'Danny',
                    email: 'suarezd10@gmail.com',
                    phone: +15039893177,
                });
            });
    });

});
