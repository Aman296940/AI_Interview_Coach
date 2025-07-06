// Backend Question Bank
// server/models/Question.js
const questionSchema = new mongoose.Schema({
  type: { type: String, enum: ['SDE', 'DS', 'ML'], required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  question: { type: String, required: true },
  idealAnswer: String,
  scoringCriteria: [String]
});

module.exports = mongoose.model('Question', questionSchema);
