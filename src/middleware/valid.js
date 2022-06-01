const mongoose = require('mongoose')
const userModel = require("../models/userModel")


const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0;
}


  const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

const isValidenum = function (title) {
    return ["S", "XS","M","X", "L","XXL", "XL"].indexOf(title) !== -1
};

const isValidemail = function (email) {
    const regexForemail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regexForemail.test(email);
};

// const isObjectId = function (ObjectId) {
//     return  mongoose.isValidObjectId(ObjectId)
//     }
const isValidObjectId = (ObjectId) => {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}

const validLogin =  function (req, res, next) {
    try {
        const queryParams = req.query;
        if (isValidRequestBody(queryParams)) {
            return res.status(400).send({ status: false, message: "invalid request" });
        }

        const requestBody = req.body;
        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: "please provide input credentials" });
        }

        const userName = requestBody.email;
        if (!isValid(userName)) {
            return res.status(400).send({ status: false, message: "email is required" });
        }
        if (!isValidemail(userName)) {
            return res.status(400).send({ status: false, message: "please enter a valid email address" });
        }

        const password = requestBody.password;
        if (!isValid(password)) {
            return res.status(400).send({ status: false, message: "password is required" });
        }
        if (!/^[a-zA-Z0-9!@#$%^&*]{8,15}$/.test(password)) {
            return res.status(400).send({ status: false, message: "password should be: 8 to 15 characters, at least one letter and one number " });
        }

        next();
    }
    catch (err) {
        res.status(500).send({ error: err.message });
    }
};


const validproduct =  function(req,res,next){
    const requestBody = req.body;
    if (!isValidRequestBody(requestBody)) {
        return res.status(400).send({ status: false, message: "please provide input credentials" });
    }
       
    const  {title,description,price,currencyId,currencyFormat,isFreeShipping,productImage,style,availableSizes,installments} = requestBody

    if (!isValid(title)) {
        return res.status(400).send({ status: false, message: "please provide title credentials" });
    }


    if (!isValid(description)) {
        return res.status(400).send({ status: false, message: "please provide description credentials" });
    }


    if (!isValid(currencyId)) {
        return res.status(400).send({ status: false, message: "please provide currencyid credentials" });
    }

    if (!isValid(currencyFormat)) {
        return res.status(400).send({ status: false, message: "please provide currencyformat credentials" });
    }

    if (!isValid(style)) {
        return res.status(400).send({ status: false, message: "please provide style credentials" });
    }

     if (!isValidenum(availableSizes)) {
        return res.status(400).send({ status: false, message: "please provide valid avalable size" });
    }
     next()

}
     const getcartvalid =  function(req,res,next){
        const requestBody = req.body;
        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: "please provide input credentials" });
        }
           
        const  {userId,totalPrice,totalItems,items} = requestBody
         
        if (!isValid(userId)) {
            return res.status(400).send({ status: false, message: "please provide description credentials" });
        }

        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "please provide description credentials" });
        }
        
        if (!/^\d{1,8}(?:\.\d{1,4})?$/.test(totalPrice)) {
            return res.status(400).send({ status: false, message: "total price should be valid" });
        }

        if (!/^\d[1-70]?$/.test(totalItems)) {
            return res.status(400).send({ status: false, message: "Totalitem should be valid" });
        }
        next()
     }

     const postcart = function(req,res,next){

         const requestBody = req.body;
         if (!isValidRequestBody(requestBody)) {
             return res.status(400).send({ status: false, message: "Please provide valid request body" })
            }
            
        const  {userId,productId,quantity} = requestBody
        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Please provide valid User Id" })
        }
        if (!isValidObjectId(productId) || !validator.isValid(productId)) {
            return res.status(400).send({ status: false, message: "Please provide valid Product Id" })
        }

        if (!isValid(quantity)) {
            return res.status(400).send({ status: false, message: "Please provide valid quantity & it must be greater than zero." })
        }
        next()
     }

     const updateProduct=function(req, res, next){
       
        const requestBody = req.body;
        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: "Please provide valid request body" })
           }

           //const  {productId} = requestBody
           let params= req.params.productId
        
           if (!isValidObjectId (params)) {
            return res.status(400).send({ status: false, message: "product Id is Not Valid" });

            
        }

        
        next()
     }

     const creatOrder =  function(req,res,next){
        const requestBody = req.body;
        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: "please provide input credentials" });
        }
           
        const  {cartId,totalPrice,totalItems} = requestBody
         
        if (!isValid(cartId)) {
            return res.status(400).send({ status: false, message: "please provide description credentials" });
        }

        if (!isValidObjectId(cartId)) {
            return res.status(400).send({ status: false, message: "please provide description credentials" });
        }
        
        if (!/^\d{1,8}(?:\.\d{1,4})?$/.test(totalPrice)) {
            return res.status(400).send({ status: false, message: "total price should be valid" });
        }

        if (!/^\d[1-70]?$/.test(totalItems)) {
            return res.status(400).send({ status: false, message: "Totalitem should be valid" });
        }
        next()
     }


    

module.exports = {validLogin , validproduct ,postcart, getcartvalid,updateProduct,creatOrder}
