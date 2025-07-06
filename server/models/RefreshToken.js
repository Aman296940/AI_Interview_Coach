import mongoose from 'mongoose';

const RefreshTokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, expires: '7d', default: Date.now } // auto-deletes after 7 days
});

export default mongoose.model('RefreshToken', RefreshTokenSchema);
