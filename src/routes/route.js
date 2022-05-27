const express = require('express')
const router = express.Router()
const userController = require('../Controller/userController')
const valid = require('../middleware/valid');
const authenti= require('../middleware/authentication')
const productController = require("../Controller/productController");
const cartController = require("../Controller/cartController");


// User Api
router.post('/User', userController.createUser)
router.post('/login', valid.validLogin, userController.userLogin)
router.get("/user/:userId/profile", authenti.authentication, userController.getuserById);
router.put('/user/:userId/profile',authenti.authentication, userController.updateProfile);


// product api
router.post('/products', valid.validproduct , productController.createproducts)
router.get("/products",productController.getProductBYQuery)
router.get("/deleteProduct", productController.getProductBYQuery);
router.get("/query", productController.getProductById);

router.delete('/products/:productId', productController.deleteProduct);

// feature 3
router.post('/cart/:userId' , cartController.cartcreate)
router.get("/query", cartController.getCart);

router.delete('/cart/:userId', cartController.deleteCart);

module.exports = router;
