const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'orange-secret';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer token

  if (!token) return res.status(401).json({ error: 'Token não fornecido' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Token inválido ou expirado' });

    req.userId = decoded.userId;
    next();
  });
}

module.exports = authenticateToken;
