const { getAgent } = require('../test/data-helpers');


describe('testing auth routes', () => {
  it('can send message if auth', async() => {
    return getAgent()
      .post ('/api/v1/message/send')
      .send({
        from: '+19712525641',
        to: '+15039893177',
        body: ';jhd;fsuuhgliukndfliubhndrg'
      })
      .then(res => {
        console.log(res.body);
        
        expect(res.body).toEqual({          
          _id: expect.any(String),
          fullname: expect.any(String),
          body: expect.any(String),
          from: +19712525641,
          to: expect.any(Number),
          __v: 0
        });
      });
  });
});
