const usersService = require('./users.service');

async function createUser(req, res) {
  try {
    const newUser = await usersService.create(req.body);
    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}


async function getAllUsers(req, res) {
  try {
    const users = await usersService.getAll();
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
  createUser,
  getAllUsers,
};

