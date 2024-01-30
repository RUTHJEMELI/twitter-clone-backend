const express = require('express');
const router = express.Router();
const {
    createPost,
    deleteComment,
    commentPost,
    rePostComment,
    rePost,
    deletePost,
    getAllPost,
    likeComment,
    likePost,
    myPosts,
    getTrendingTopics
} = require('../Controllers/postController');

const verifyToken = require('../Middleware/verifyToken')

// Create a new post
router.post('/posts/post', verifyToken, createPost);


// Delete a post
router.delete('/posts/delete', verifyToken,  deletePost);

// Like or unlike a post
router.put('/posts/like',  verifyToken, likePost);

// Comment on a post
router.post('/posts/comment',  verifyToken, commentPost);

// Delete a comment
router.delete('/posts/comment', verifyToken, deleteComment);

// Like or unlike a comment
router.put('/posts/comment/like', verifyToken, likeComment);


// Get all posts
router.get('/posts', verifyToken, getAllPost);

// Repost a post
router.post('/posts/repost', verifyToken, rePost);

// Get user's posts
router.get('/posts/myposts', verifyToken, myPosts);

// Repost a comment
router.post('/posts/comment/repost', verifyToken, rePostComment);

router.get('/trending', verifyToken, getTrendingTopics);


module.exports = router;
