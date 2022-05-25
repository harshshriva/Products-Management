const express = require('express')
const router = express.Router()
const userController = require('../Controller/userController')
const valid = require('../middleware/valid');
const authentication = require('../middleware/auth')

router.post('/User', userController.createUser)
router.post('/login', valid.validLogin, userController.userLogin)
router.get("/user/:userId/profile", authentication.authentication, userController.getuserById);
module.exports = router;