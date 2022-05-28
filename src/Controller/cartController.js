const validator = require('../validator/validator')
const productModel = require('../models/productModel')
const userModel = require('../models/userModel')
const cartModel = require('../models/cartModel')

const cartcreate = async function (req, res) {
    try {
        const userId = req.params.userId
        const requestBody = req.body;
        const { quantity, productId } = requestBody
        let userIdFromToken = req.userId;

        const findUser = await userModel.findById({ _id: userId })
        
        if (!findUser) {
            return res.status(400).send({ status: false, message: `User doesn't exist by ${userId}` })
        }

        // Authentication & authorization
        // if (findUser._id.toString() != userIdFromToken) {
        //     res.status(401).send({ status: false, message: `Unauthorized access! User's info doesn't match` });
        //     return
        // }

        const findProduct = await productModel.findOne({ _id: productId, isDeleted: false })
        
        if (!findProduct) {
            return res.status(400).send({ status: false, message: `Product doesn't exist by ${productId}` })
        }

        const findCartOfUser = await cartModel.findOne({ userId: userId })
        console.log(findCartOfUser)
        //finding cart related to user.
          //  cart exist for user
          // if not
        if (!findCartOfUser) {

            //destructuring for the response body.
            let cartData = {
                userId: userId,
                items: [{
                    productId: productId,
                    quantity: quantity,
                }],
                totalPrice: findProduct.price * quantity,
                totalItems: 1
            }
           
            const createCart = await cartModel.create(cartData)
           
            return res.status(201).send({ status: true, message: `Cart created successfully`, data: createCart })
        }

        if (findCartOfUser) {

            //updating price when products get added or removed.
            let price = findCartOfUser.totalPrice + (req.body.quantity * findProduct.price)
            
            let itemsArr = findCartOfUser.items
            console.log(itemsArr)

            //updating quantity.
            for (i in itemsArr) {
                if (itemsArr[i].productId.toString() === productId) {
                    itemsArr[i].quantity += quantity

                    let updatedCart = { items: itemsArr, totalPrice: price, totalItems: itemsArr.length }

                    let responseData = await cartModel.findOneAndUpdate({ _id: findCartOfUser._id }, updatedCart, { new: true })

                    return res.status(200).send({ status: true, message: `Product added successfully`, data: responseData })
                }
            }
            itemsArr.push({ productId: productId, quantity: quantity }) //storing the updated prices and quantity to the newly created array.

            let updatedCart = { items: itemsArr, totalPrice: price, totalItems: itemsArr.length }
           
            let responseData = await cartModel.findOneAndUpdate({ _id: findCartOfUser._id }, updatedCart, { new: true })
            

            return res.status(200).send({ status: true, message: `Product added successfully`, data: responseData })
        }
    } catch (err) {
        res.status(500).send({ status: false, data: err.message });
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