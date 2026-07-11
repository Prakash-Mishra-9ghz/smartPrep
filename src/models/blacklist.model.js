const mongoose = require('mongoose');

const blacklistSchema = new mongoose.Schema({
    token:{
        type: String,
        required: [true, "token is required"]
    }
}, {
    timestamps: true
})

const tokenBlacklistModel = mongoose.model('tokenBlacklistModel', blacklistSchema);
module.exports = tokenBlacklistModel; 