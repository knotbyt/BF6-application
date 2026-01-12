import mongoose from 'mongoose';

const clanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  tag: {
    type: String,
    required: true,
    trim: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ownerUsername: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  members: {
    type: Number,
    default: 1
  },
  memberList: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  region: {
    type: String,
    required: true,
    enum: ['NA East', 'NA West', 'EU West', 'EU Central', 'Asia Pacific']
  },
  platform: {
    type: String,
    required: true,
    enum: ['PC', 'Xbox', 'PlayStation', 'Cross-play']
  },
  founded: {
    type: String,
    default: () => new Date().getFullYear().toString()
  },
  image: {
    type: String,
    default: null
  },
  color: {
    type: String,
    default: '#4A9EFF'
  },
  activity: [{
    type: {
      type: String,
      enum: ['member_joined', 'member_left', 'match_victory', 'tournament_win', 'squad_session', 'other'],
      required: true
    },
    message: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Clan', clanSchema);

