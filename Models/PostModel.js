const mongoose = require('mongoose');

const commentsSchema = new mongoose.Schema({
    content: String,
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    pinned: Boolean,
    rePostedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [this]
},// This allows for nested comments
{
    timestamps: true
});

const postSchema = new mongoose.Schema({
    content: {
        type: String,
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    pinned: Boolean,
    comments: [commentsSchema], // Array of comments objects
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    rePostedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    rePost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Post', postSchema);
