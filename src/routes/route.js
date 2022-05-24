const express=require('express') 
const router= express.Router()
const userController=require('../Controller/userController')
const valid = require('../middleware/valid');

router.post('/User',userController.createUser)
router.post('/login', valid.validLogin , userController.userLogin)

module.exports=router;
