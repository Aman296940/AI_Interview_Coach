import jwt from 'jsonwebtoken';


const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });
  console.log("🔍 Token received:", token);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("✅ Decoded token:", decoded);
    req.user = { id: decoded.id };
    next();
  } catch (error) {
  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'token_expired' });
  }
  return res.status(401).json({ error: 'invalid_token' });
}

};

export default authMiddleware;
