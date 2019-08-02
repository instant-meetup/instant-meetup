const User = require('../lib/models/User');
const chance = require('chance').Chance();

module.exports = async({ users = 10 } = { users: 10 }) => {
  const createdUsers = await User.create(
    [...Array(users)].map(() => ({
      username: chance.name(),
      email: chance.email(),
      phone: chance.phone({ formatted: false, country: 'us' }),
      password: 'password',
      location: chance.coordinates({ fixed: 7 }),
    }))
  );

  return { users: createdUsers };

};
