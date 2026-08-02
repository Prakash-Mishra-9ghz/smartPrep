const mongoose = require('mongoose');

const blacklistSchema = new mongoose.Schema({
    token:{
        type: String,
        required: [true, "token is required"]
    }
}, {
    timestamps: true
})

// Remove blacklisted tokens after the JWT expiration time to avoid unused storage
blacklistSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 6});

const tokenBlacklistModel = mongoose.model('tokenBlacklistModel', blacklistSchema);
module.exports = tokenBlacklistModel; 