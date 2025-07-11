const userService = require('./users.service');

const registerUser = (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }

  const user = userService.createUser({ name, email, password });
  res.status(201).json(user);
};

module.exports = { registerUser };
