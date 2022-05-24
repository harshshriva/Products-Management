const express=require('express') 
const router= express.Router()
const userController=require('../Controller/userController')

router.post('/User',userController.createUser)

module.exports=router;