const express = require('express')
const router = express.Router()
const userController = require('../Controller/userController')
const valid = require('../middleware/valid');
const productController = require("../Controller/productController")
const authentication = require("../middleware/auth")



router.post('/User', userController.createUser)
router.post('/login', valid.validLogin, userController.userLogin)
router.get("/user/:userId/profile", authentication.authentication, userController.getuserById);


// feature 2
router.post('/products', productController.createproducts)

module.exports = router;