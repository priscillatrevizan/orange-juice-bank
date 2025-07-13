const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Token não fornecido.' });
  }

  const [type, token] = authHeader.split(' ');

  if (type !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Token malformado.' });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded; // define `req.user` com o payload do token
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido.' });
  }
}

module.exports = authMiddleware;
