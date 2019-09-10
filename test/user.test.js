const { getAgent, getUsers } = require('../test/data-helpers');

describe('usres', () => {
  it('gets users', () => {
    const users = getUsers();

    return getAgent()
      .get('/api/v1/user')
      .then(res => {
        users.forEach(() => {
          expect(res.body).toHaveLength(10);
        });
      });
  });

  it('gets one user by id', () => {
    const user = getUsers()[0];
    
    return getAgent()
      .get(`/api/v1/user/${user._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          username: expect.any(String),
          email: expect.any(String),
          phone: expect.any(Number),
          location: expect.any(String),
        });
      });
  });

  it('can update user with patch', () => {
    const user = getUsers()[0];

    return getAgent()
      .patch(`/api/v1/user/${user._id}`)
      .send(({ phone: 15039544973 }))
      .then(res => {        
        expect(res.body).toEqual({
          _id: expect.any(String),
          username: expect.any(String),
          email: expect.any(String),
          phone: 15039544973,
          location: expect.any(String),
        });
      });
  });
});
