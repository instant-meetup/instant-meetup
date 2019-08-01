const { getAgent } = require('../test/data-helpers');

describe('testing auth routes', () => {
  it('can send message if auth', () => {
    return getAgent()
      .post ('/api/v1/message/send')
      .send({
        from: '+19712525641',
        to: '+15039893177',
        body: 'Alchemy'
      })
      .then(res => {                
        expect(res.body).toEqual({
          body: expect.any(String)
        });
      });
  });

  it('send message to multile users', () => {
    const allUsers = ['+15039544973', '+15039893177', '+19712356888'];
    return getAgent()
      .post ('/api/v1/message/sendall')
      .send({
        from: '+19712525641',
        to: allUsers,
        body: 'Alchemy'
      })
      .then(res => {
        expect(res.body).toEqual({  
          body: expect.any(String)
        });
      });
  });
});
