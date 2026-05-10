// Simple authentication middleware for demo purposes
// Expects a Bearer token which is Base64 encoded JSON { id, email }
module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    // attach user info to request for downstream handlers
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token decoding failed:', err);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};