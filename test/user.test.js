const { getAgent, getUsers } = require('../test/data-helpers');

describe('usres', () => {
  it('gets users', () => {
    const users = getUsers();

    return getAgent()
      .get('/api/v1/user')
      .then(res => {
        users.forEach(user => {
          expect(res.body).toHaveLength(10);
        });
      });
  });

});
