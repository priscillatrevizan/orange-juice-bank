module.exports = function validateUserPayload(req, res, next) {
  const { name, email, cpf, birthDate } = req.body;

  if (!name || !email || !cpf || !birthDate) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'E-mail inválido.' });
  }

  next();
};
