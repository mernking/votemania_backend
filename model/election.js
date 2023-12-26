const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CandidateSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  party: {
    type: String,
    required: true,
  },
  votes: {
    type: Number,
    default: 0,
  },
});

const VoterSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure email is unique
  },
  password: {
    type: String,
    required: true,
  },
  votedFor: {
    type: Schema.Types.ObjectId,
    ref: 'Candidate',
  },
});

const ElectionSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  r_voters: {
    type: [VoterSchema],
  },
  candidates: {
    type: [CandidateSchema],
  },
});

module.exports = mongoose.model('Election', ElectionSchema);
