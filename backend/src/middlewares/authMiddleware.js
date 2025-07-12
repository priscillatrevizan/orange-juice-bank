const jwt = require('jsonwebtoken');

module.exports = function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não fornecido.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'segredo-padrao');
    req.user = decoded; // opcional: salva dados no req.user
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token inválido.' });
  }
};
