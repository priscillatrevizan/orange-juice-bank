const usersService = require('./users.service');

async function createUser(req, res) {
  try {
    const newUser = await usersService.create(req.body);
    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

module.exports = {
  createUser,
};

