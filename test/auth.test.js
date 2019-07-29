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

    let user = null;
    beforeEach(async() => {
        user = JSON.parse(JSON.stringify(await User.create({
            userName: 'Vasily',
            email: 'markovavasily@gmail.com',
            phone: +15039544973,
            password: 'hiDanny'
        })));
    });

    afterAll(() => {
        return mongoose.connection.close();
    });

    it('creates a user', () => {
        return request(app)
        .post('/api/v1/auth/signup')
        .send({ user })
        .then( res => {
            expect(res.body).toEqual({
                _id: expect.any(String),
                userName: 'Vasily',
                email: 'markovavasily@gmail.com',
                phone: +15039544973,
                __v: 0
            });
        });
    });
    
});
