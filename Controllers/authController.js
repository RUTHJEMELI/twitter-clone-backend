const User = require('../Models/UserModel')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const register = asyncHandler(async (req, res) => {
    const { username, firstName, lastName, gender, password, email,ProfilePic,bio,banner, dateOfBirth , location, followers, following } = req.body

    if (!username || !firstName || !lastName || !gender || !password || !email ) {
       return  res.status(400).json({message:'All Fields are required!'})
    }

    const duplicate = await User.findOne({ username }).exec()
    if (duplicate) {
        return res.status(409).json({message:'username is already taken'})
    }
    
    const hashedPwd = await bcrypt.hash(password, 4)
    const user = {
        username,
        followers: [],
        following: [],
        ProfilePic,
        bio,
        location,
        firstName,
        lastName,
        email,
        gender,
        password:hashedPwd
    }
     
    const newUser = await User.create(user)
    
    res.status(200).json({message:`Account created successfully ${newUser.username}`})

    
})

const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body
    if (!username || !password) {
        return res.status(400).json({message:'Username and password are required!'})
    }
    const user =  await User.findOne({ username }).lean().exec()
    if (!user) {
        return res.status(400).json({message:'user not found!'})
    }
    const comparePassword = await bcrypt.compare(password, user.password)
    if (!comparePassword) {
        return res.status(400).json({message:'wrong password or username'})
    }

    const payload = {
       username: user.username,
        id: user._id
    }
        const token = await jwt.sign({username:user.username, id:user._id} , process.env.SECRET_KEY, { expiresIn: '59m' })
        
        const refreshToken = await jwt.sign({payload}, process.env.SECRET_KEY, { expiresIn: '3d' })
        
        res.cookie('refresh_token', refreshToken,{
            httpOnly: true,
            secure: true,
            maxAge: 24*60*60*1000,
        
        })
         res.status(200).json({ token: token })
    

})
const refreshToken = asyncHandler(async (req, res) => {
    const cookies = req.cookies
    if (!cookies?.refresh_token) {
        return res.status(401).json({message:'unauthorized'})
    }
    const refreshToken = cookies.refresh_token

    const findUser = User.findOne({refreshToken }).exec()
    if (!findUser) {
        return res.status(403).json({message:'forbidden'})
    }
    const payload = {
        username: findUser.username,
        id: findUser._id
    }
    await jwt.verify(refreshToken, process.env.SECRET_KEY, (err, decoded) => {
        if (err || findUser.username !== decoded.username) {
           return res.status(403).json({message:'forbidden'})
        }
        const accessToken =  jwt.sign({ payload}, process.env.SECRET_KEY, { expiresIn: '15m' })
        res.status(200).json({accessToken:accessToken})
    })
})


module.exports ={register, login, refreshToken}