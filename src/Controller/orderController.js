const orderModel=require("../models/orderModel")
const userModel = require("../models/userModel")
//const validator=require("../validator/validator")


const creatOrder=async function(req, res){
    let requestBody=req.body
//let {items,productId,quantity}=requestBody

    let user=req.userId
    let userId=req.params.userId
    let findUser = await userModel.findOne({ _id: userId })
    if (!findUser) {
        return res.status(400).send({ status: false, message: "UserId does not exits" })
    }

    if(userId != user){
        return res.status(400).send("Unathorized")
    }
  let cartDetails=await cartModel.find({items})
  return res.status(200).send({status:true,msg:"Cart data",data:cartDetails})
    

    let Order=await orderModel.create(requestBody)
        return res.status(200).send({ statuse:true,msg:"Order exicuted successfully", data:Order})
    
    
}


module.exports={creatOrder}

