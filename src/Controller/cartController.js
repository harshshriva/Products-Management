const cartModel = require("../models/cartModel");
const product = require("../models/product");
const userModel = require("../models/userModel");

const cartcreate = async function(req,res){
  // try {
    const userId = "628e0bb2371ca83ff38c65f4";
    let cart = await cartModel.findOne({ userId });
    console.log(cart)
    const { productId, quantity} = req.body;
      let totalItems = 1

   let totalPrice = await product.findOne({_id:productId}).select({price:1})
       console.log(totalPrice)
    if (cart) {
      //cart exists for user
      let itemIndex = cart.items.findIndex(p => p.productId === productId);
      console.log(itemIndex)
      if (itemIndex > -1) {
        //product exists in the cart, update the quantity
        
        let productItem = cart.items[itemIndex];
        console.log(productItem)
        productItem.quantity = quantity;
        cart.items[itemIndex] = productItem;

        
      } else {
        //product does not exists in cart, add new item
        cart.items.push({ productId, quantity})
        totalItems = totalItems+1,
        totalPrice
     
      }
      cart = await cart.save();
      return res.status(201).send(cart);
      // 1st case
    } else {
      // //no cart for user, create new cart
      let  totalItems = 1
      let totalPrice = await product.findOne({_id:productId}).select({price:1})
      const newCart = await cartModel.create({
        userId,
        items: [{ productId, quantity }],
        totalPrice : totalPrice, totalItems: totalItems
      });
      console.log(newCart)
      return res.status(201).send(newCart);
    }
  // } catch (err) {
  //   console.log(err);
  //   res.status(500).send("Something went wrong");
  // }
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