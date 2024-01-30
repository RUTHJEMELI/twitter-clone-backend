const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique:true
    },
    firstName: {
        type: String,
        required: true,
        trim:true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique:true
    },
    gender: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        default:'/images/ProfilePic.png'
    },
    roles: [{
        type: String,
        default: 'user'
    }],
    active: {
        type: Boolean,
        default: false
    },
    lastActiveAt: {
        type: Date,
        default: null
    },
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    dateOfBirth: {
        type: Date,
    
    },
    bio: String,
    banner: String,
    dateOfJoining: {
        type: Date,
    },
    location:String

})
module.exports = mongoose.model('User', userSchema)