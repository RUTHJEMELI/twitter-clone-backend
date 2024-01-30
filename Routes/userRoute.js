const express = require('express')

const router = express.Router()

const { followers, following, follow, changeProfile, deleteAccount, viewProfile } = require('../Controllers/userController')
const verifyToken = require('../Middleware/verifyToken')

router.put('/change-profile', verifyToken,  changeProfile)
router.get('/followers', verifyToken, followers)
router.get('/following', verifyToken,  following)
router.put('/follow', verifyToken,  follow)
router.delete('/delete-account', verifyToken, deleteAccount)
router.get('/view-profile', verifyToken,  viewProfile)


module.exports = router