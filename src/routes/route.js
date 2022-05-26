const express = require('express')
const router = express.Router()
const userController = require('../Controller/userController')
const valid = require('../middleware/valid');
const authenti= require('../middleware/authentication')
const authorize = require('../middleware/authorization');
const productController = require("../Controller/productController")

// User Api
router.post('/User', userController.createUser)
router.post('/login', valid.validLogin, userController.userLogin)
router.get("/user/:userId/profile", authenti.authentication, userController.getuserById);
router.put('/user/:userId/profile',authenti.authentication,authorize.authorization , userController.updateProfile);


// product api
router.post('/products', valid.validproduct , productController.createproducts)
router.delete('/products/:productId', productController.deleteProduct);

module.exports = router;
