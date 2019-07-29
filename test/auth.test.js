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
            userName: 'Vasily',
            email: 'markovavasily@gmail.com',
            phone: +15039544973,
            password: 'hiDanny'
        })
        .then( res => {
            expect(res.body).toEqual({
                _id: expect.any(String),
                userName: 'Vasily',
                email: 'markovavasily@gmail.com',
                phone: +15039544973
            });
        });
    });

});
