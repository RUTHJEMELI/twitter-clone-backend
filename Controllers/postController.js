const User = require('../Models/UserModel');
const Post = require('../Models/PostModel');
const asyncHandler = require('express-async-handler');

const createPost = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const postedBy = req.user.id;

    const user = await User.findById(postedBy).exec();

    if (!user) {
        return res.status(404).json({ message: 'User not found!' });
    }

    const newPost = {
        content: content,
        postedBy: postedBy,
        likes: [],
        comments: [],
        rePostedBy: [],
        pinned: false,
    };

    const createdPost = await Post.create(newPost);
    await createdPost.save();

    res.status(200).json({ message: 'Post created' });
});

const rePost = asyncHandler(async (req, res) => {
    const { postId } = req.body;
    const rePostedBy = req.user.id;

    const user = await User.findById(rePostedBy).exec();
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const originalPost = await Post.findById(postId).exec();
    if (!originalPost) {
        return res.status(404).json({ message: 'Post not found' });
    }

    const newPost = {
        content: originalPost.content,
        postedBy: rePostedBy,
        likes: [],
        comments: [],
        rePostedBy: [],
        pinned: false,
    };

    const rePostCreated = await Post.create(newPost);
    await rePostCreated.save();
    await originalPost.rePostedBy.push(rePostedBy);
    await originalPost.save();

    res.status(200).json({ message: 'Reposted' });
});

const deletePost = asyncHandler(async (req, res) => {
    const { postId } = req.body;
    const user = req.user.id;

    const findUser = await User.findById(user).exec();
    if (!findUser) {
        return res.status(404).json({ message: 'User not found' });
    }

    const post = await Post.findById(postId).exec();
    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
    }

    if (post.postedBy.toString() !== findUser._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
    }

    await post.deleteOne();
    res.status(200).json({ message: 'Post deleted' });
});

const likePost = asyncHandler(async (req, res) => {
    const { postId } = req.body;
    const user = req.user.id;

    const findUser = await User.findById(user).exec();

    if (!findUser) {
        return res.status(404).json({ message: 'User not found' });
    }

    const likedPost = await Post.findById(postId).exec();
    if (!likedPost) {
        return res.status(404).json({ message: 'Post not found' });
    }

    const isLiked = likedPost.likes.includes(findUser._id);
    if (isLiked) {
        likedPost.likes.pull(findUser._id);
    } else {
        likedPost.likes.addToSet(findUser._id);
    }

    await likedPost.save();
    res.status(200).json({ message: 'Liked' });
});

const commentPost = asyncHandler(async (req, res) => {
    const { comment, postId, commentId } = req.body;
    const user = req.user.id;

    const findUser = await User.findById(user).exec();
    if (!findUser) {
        return res.status(404).json({ message: 'User not found' });
    }

    const post = await Post.findById(postId).exec();
    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
    }

    const commentAComment = post.comments.comments.id(commentId);
    const userComment = {
        content: comment,
        postedBy: findUser._id,
        likes: [],
        comments: [],
        pinned: false,
        rePostedBy: [],
    };

    if (commentAComment) {
        post.comments.comments.push(userComment);
    } else {
        post.comments.push(userComment);
    }

    await post.save();
    res.status(200).json({ message: 'Comment added' });
});

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId, postId } = req.body;
    const user = req.user.id;

    const findUser = await User.findById(user).exec();
    if (!findUser) {
        return res.status(404).json({ message: 'User not found' });
    }

    const post = await Post.findById(postId).exec();
    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
    }

    const findComment = post.comments.id(commentId);
    if (!findComment) {
        const subComment = post.comments.comments.id(commentId);
        if (!subComment) {
            return res.status(404).json({ message: 'Comment not found' });
        } else if (subComment.postedBy !== findUser._id) {
            return res.status(401).json({ message: 'Not authorized' });
        } else {
            subComment.deleteOne();
        }
    } else if (findComment.postedBy !== findUser._id) {
        return res.status(401).json({ message: 'Not authorized' });
    } else {
        findComment.deleteOne();
    }

    await post.save();
    res.status(200).json({ message: 'Comment deleted' });
});

const likeComment = asyncHandler(async (req, res) => {
    const { postId, commentId } = req.body;
    const user = req.user.id;

    try {
        const findUser = await User.findById(user).exec();

        if (!findUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Find the comment (either main comment or sub-comment)
        let comment = post.comments.id(commentId);

        if (!comment) {
            // If it's not a main comment, try finding it as a sub-comment
            comment = post.comments.comments.id(commentId);

            if (!comment) {
                return res.status(404).json({ message: 'Comment not found' });
            }
        }

        // Toggle the like for the comment
        const isLiked = comment.likes.includes(findUser._id);
        if (isLiked) {
            comment.likes.pull(findUser._id);
        } else {
            comment.likes.addToSet(findUser._id);
        }

        await post.save();

        res.status(200).json({ message: 'Liked' });
    } catch (error) {
        console.error('Error liking comment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

const getAllPost = asyncHandler(async (req, res) => {
    const user = req.user.id;

    const findUser = await User.findById(user).exec();
    if (!findUser) {
        return res.status(404).json({ message: 'User not found' });
    }

    const posts = await Post.find();
    res.status(200).json(posts);
});

const rePostComment = asyncHandler(async (req, res) => {
    const { commentId, postId } = req.body;
    const postedBy = req.user.id;

    const post = await Post.findById(postId).exec();
    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
    }

    let comment = post.comments.id(commentId);

    if (!comment) {
        comment = post.comments.comments.id(commentId);
    }

    const newPost = {
        content: comment.content,
        postedBy: postedBy,
        likes: [],
        comments: [],
        pinned: false,
        rePostedBy: [],
    };

    await Post.create(newPost).save();

    res.status(200).json({ message: 'Comment successfully re-posted' });
});

const myPosts = asyncHandler(async (req, res) => {
    const user = req.user.id;
    const findUser = await User.findById(user);
    if (!findUser) {
        return res.status(404).json({ message: 'User not found' });
    }

    const posts = await Post.find();
    const myPosts = posts.filter((post) => post.postedBy.toString() === findUser?._id.toString());

    if (myPosts.length === 0) {
        return res.status(404).json({ message: 'You have not posted anything yet' });
    }

    res.status(200).json(myPosts);
});

// Function to get trending topics
const getTrendingTopics = async () => {
  try {
    // Fetch recent tweets (you might want to add a time filter)
    const recentTweets = await Post.find().sort({ createdAt: -1 }).limit(100);

    // Count occurrences of hashtags
    const hashtagCounts = {};
    recentTweets.forEach((tweet) => {
      const hashtags = tweet.content.match(/#\w+/g) || [];
      hashtags.forEach((hashtag) => {
        const lowerCaseHashtag = hashtag.toLowerCase();
        hashtagCounts[lowerCaseHashtag] = (hashtagCounts[lowerCaseHashtag] || 0) + 1;
      });
    });

    // Convert to an array of objects for sorting
    const hashtagArray = Object.entries(hashtagCounts).map(([hashtag, count]) => ({ hashtag, count }));

    // Sort by count in descending order
    const sortedHashtags = hashtagArray.sort((a, b) => b.count - a.count);

    // Return the top N trending topics
    const trendingTopics = sortedHashtags.slice(0, 5).map((entry) => entry.hashtag);
    
    res.status(200).json(trendingTopics)
  } catch (error) {
    console.error('Error fetching trending topics:', error);
    return [];
  }
};




module.exports = {
    createPost,
    rePost,
    deletePost,
    likePost,
    commentPost,
    getAllPost,
    myPosts,
    deleteComment,
    likeComment,
    rePostComment,
    getTrendingTopics
};
