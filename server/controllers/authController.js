import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import RefreshToken from '../models/RefreshToken.js';


// Use your secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
    await RefreshToken.create({ token: refreshToken, user: user._id });
    res.json({
      success: true,
      accessToken,
      refreshToken,
      user: { id: user._id, name: user.name, email: user.email }
    });

  } catch (err) {
    next(err);
  }
};


// Register handler
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (await User.findOne({ email })) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashed });
    const accessToken = jwt.sign(
    { id: newUser._id },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { id: newUser._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    await RefreshToken.create({ token: refreshToken, user: newUser._id });
    res.status(201).json({
      success: true,
      accessToken,
      refreshToken,
      user: { id: newUser._id, name: newUser.name, email: newUser.email }
    });

  } catch (err) {
    next(err);
  }
};


export const refresh = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: "No token" });

  const stored = await RefreshToken.findOne({ token: refreshToken });
  if (!stored) return res.status(403).json({ message: "Forbidden" });

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const accessToken = jwt.sign({ id: payload.id }, process.env.JWT_SECRET, { expiresIn: "15m" });
    return res.json({ accessToken });
  } catch {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};

