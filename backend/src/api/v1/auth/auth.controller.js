const authService = require('./auth.service');

async function login(req, res) {
  const { email, cpf } = req.body;

  try {
    const token = await authService.login(email, cpf);
    return res.status(200).json({ token });
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
}

module.exports = { login };
