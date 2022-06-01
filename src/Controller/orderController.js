const orderModel=require("../models/orderModel")
const userModel = require("../models/userModel")
const cartModel=require("../models/cartModel")
//const validator=require("../validator/validator")
const mongoose=require('mongoose')

const creatOrder = async(req, res) => {
    try {
        const userId = req.params.userId;
        const requestBody = req.body;
        const userIdFromToken = req.userId;
        
        const {cartId,  cancellable, status } = requestBody;
        
        const searchUser = await userModel.findOne({ _id: userId });
        if (!searchUser) {
            return res.status(400).send({ status: false, message: `user doesn't exists for ${userId}`});
        }
        //Authentication & authorization
        if (searchUser._id.toString() != userIdFromToken) {
            return res.status(401).send({ status: false, message: `Unauthorized access! User's info doesn't match` });
     
         
        }
        

        //searching cart to match the cart by userId whose is to be ordered.
        const searchCartDetails = await cartModel.findOne({    _id: cartId,    userId: userId,});
       
        let totalQuantity = searchCartDetails.items.map((x) => x.quantity).reduce((previousValue, currentValue) =>previousValue + currentValue);

        //object destructuring for response body.
        const orderDetails = {
            userId: userId,
            items: searchCartDetails.items,
            totalPrice: searchCartDetails.totalPrice,
            totalItems: searchCartDetails.totalItems,
            totalQuantity: totalQuantity,
            cancellable,
            status,
        };
        const savedOrder = await orderModel.create(orderDetails)
        return res.status(200).send({ status: true, message: "Order placed.", data: savedOrder });
    
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
};


const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0;
}

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

const isValidObjectId = (orderId) => {
    return mongoose.Types.ObjectId.isValid(orderId)
}

const updateOrderDetail = async function(req, res) {
    try {
        let requestBody = req.body;
        const userId = req.params.userId
        //const jwtUserId = req.userId

        const { orderId,status } = requestBody

        //  authroization

        // if (!(userId == jwtUserId)) {
        //     return res.status(400).send({ status: false, msg: "unauthorized access" })
        // }

        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'Please provide Order details' });
            return;
        }
        if (!isValid(orderId)) {
            return res.status(400).send({ status: false, message: 'orderId is required in the request body' })
        }
        if (!isValidObjectId(orderId)) {
            return res.status(400).send({ status: false, message: `${orderId} is not a valid user id` })
        }

        if (!isValid(status)) {
            return res.status(400).send({ status: false, message: 'Status must be in enum' })
        }
        const checkOrder = await orderModel.findOne({ _id: orderId, isDeleted: false })
        if (!(checkOrder)) {
            return res.status(400).send({ status: false, message: 'order id not correct ' })
        }
        if (!(checkOrder.userId == userId)) {
            return res.status(400).send({ status: false, message: 'order not blongs to the user ' })
        }

        if (!(checkOrder.cancellable === true)) {
            return res.status(400).send({ status: false, message: 'order didnt have the cancellable policy ' })
        }
        let updateOrder = await orderModel.findOneAndUpdate({ _id: orderId  },{status:status}, { new: true })
        res.status(200).send({ status: true, msg: 'sucesfully updated', data: updateOrder })

    } catch (error) {
        res.status(500).send({ status: false, Message: error.message })
    }
}


module.exports={creatOrder,updateOrderDetail}

