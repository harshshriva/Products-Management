const cartModel = require("../models/cartModel");
const product = require("../models/product");
const userModel = require("../models/userModel");

const cartcreate = async function(req,res){
    try { 
        
   const { productId, quantity } = req.body;
  
    const userId =  await userModel.findById({_id:req.params.userId}).select({_id:1})
    console.log(userId)
     
      let cart = await cartModel.findById({userId:userId});
      console.log(cart)
  
      if (cart) {
        //cart exists for user
        let itemIndex = cart.items.findIndex(p => p.productId == productId);
        console.log(itemIndex)
        if (itemIndex > -1) {
          //product exists in the cart, update the quantity
          let productItem = cart.items[itemIndex];
          console.log(productItem)
          productItem.quantity = quantity;
          cart.items[itemIndex] = productItem;

          // const totalprice = quantity*totalItems
        } else {
          //product does not exists in cart, add new item
          let final =0
         let  result= final+1
         console.log(result)

          cart.items.push({ productId, quantity ,  totalItems:totalItems2 , totalPrice:totalPrice2
            });
         let  totalItems2 = result
         console.log(totalItems2)
          let totalPrice2 = await cartModel.findById(productId)
          console.log(totalPrice2)
        }

        cart = await cart.save();
        return res.status(201).send(cart);
      } else {
        //no cart for user, create new cart
         let totalItems1 = 1
         let totalPrice1 =await cartModel.findById(productId)
         console.log(totalPrice1)
        const newCart = await cartModel.create({
          userId,
          items: [{ productId, quantity 
            }],
            totalItems:totalItems1 , totalPrice:totalPrice1
        });
        console.log(newCart)
        return res.status(201).send(newCart);
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Something went wrong");
    }
  
}


// const cartcreate = 
// 3
const getCart = async function (req, res) {
  try {
      let data = await cartModel.find({ userId: req.params.userId, isDeleted: false })
      if (!data)
          return res.status(404).send({ status: false, message: "Cart not found." })
      return res.status(200).send({ status: true, message: "Cart details", data: data })
  } catch (error) {
      res.status(500).send({ status: false, message: error.message })
  }
}


//4
const deleteCart = async function (req, res) {
  try {
      let data = await cartModel.findOneAndUpdate({ userId: req.params.userId, isDeleted: false }, { isDeleted: true, deletedAt: new Date() })
      if (!data)
          return res.status(404).send({ status: false, message: "Cart not found." })
      return res.status(200).send({ status: true, message: "Cart deleted successfully" , data:data })
  } catch (error) {
      res.status(500).send({ status: false, message: error.message })
  }
}


module.exports = {cartcreate ,getCart , deleteCart}