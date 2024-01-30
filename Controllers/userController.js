const User = require('../Models/UserModel')
const asyncHandler = require('express-async-handler')


const changeProfile = asyncHandler(async (req, res) => {
    const { firstName, lastName, ProfilePic, bio, banner, location } = req.body
    const userId = req.user.id
    console.log(userId)
    const user = await User.findById(userId).exec()

    if (!user) {
    return res.status(404).json({message:'user not found'})
    }
    const fieldsToUpdate = ['firstName', 'lastName', 'ProfilePic', 'bio', 'banner', 'location']
    
    fieldsToUpdate.forEach((field) => {
        if (req.body[field] !== undefined && req.body[field] !== user[field]) {
            user[field] = req.body[field]
        }
           
    })
    await user.save()
    res.status(200).json({message:'user profile updated successfully'})
    
})

const followers = asyncHandler(async (req, res) => {
    const userId = req.user.id

    const user = await User.findById(userId).exec()
    if (!user) {
        return res.status(404).json({message:'user not found'})
    }

    const whoFollowsMe = user?.followers || 0
      
    res.status(200).json(whoFollowsMe)

})

const following = asyncHandler(async (req, res) => {
    const userId = req.user.id
    const user = await User.findById(userId).exec()
    if (!user) {
        return res.status(404).json({message:'user not found'})
    }
    const whoIFollow = user?.following || 0
    res.status(200).json(whoIFollow)
})

const follow = asyncHandler(async (req, res) => {
    const {id} = req.body
    const userId = req.user.id
    const user = await User.findById(userId).exec()
    const targetUser = await User.findById(id)
    if (!user) {
        return res.status(404).json({message:'user not found'})
    }
    const amFollowing = user.following.includes(id)
    if (amFollowing) {
        user.following.pull(id)
        targetUser.followers.pull(userId)
    } else {
        user.following.addToSet(id)
        targetUser.followers.addToSet(userId)
    }

    await user.save()
    await targetUser.save()
    res.status(200).json({message:'followed'})
})


const deleteAccount = asyncHandler(async (req, res) => {
   const userId = req.user.id
    const user = await User.findById(userId).exec()
    if (!user) {
        return res.status(404).json({message:'user not found'})
    }
    await user.deleteOne()
     res.status(200).json({message:'user account deleted successfully'})
})

const viewProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id
    const user = await User.findById(userId).select('-password').exec()
    if (!user) {
        return res.status(404).json('user not found')
    }
    res.status(200).json(user)
})



module.exports = {changeProfile, followers,following, follow, deleteAccount, viewProfile}