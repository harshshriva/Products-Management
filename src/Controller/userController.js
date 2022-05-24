
const userModel = require("../models/userModel")

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0;
}


  const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

//User Registration
const createUser = async function (req, res) {
    try {
        let user = req.body
        //extracts params
        let { fname, lname,  email,profileImage, phone, password, address, billing } = user

        if (!isValidRequestBody(user)) {
            return res.status(400).send({ status: false, msg: "enter data in user body" })
        }
        if (!isValid(fname)) {
            return res.status(400).send({status: false, msg: "Enter FirstName " })
        }
        
        if (!isValid(lname)) {
            return res.status(400).send({status: false,  msg: "Enter LastName " })
        }
        if (!isValid(email)) {
            return res.status(400).send({ status: false, msg: "Enter email " })
        }
        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.trim()))) {
            return res.status(400).send({ status: false, message: `Email should be a valid email address` })
            
        }
        const isemail = await userModel.findOne({ email })
        if (isemail) {
            return res.status(400).send({status: false, msg: "Email.  is already used" })
        }

        if (!isValid(profileImage)) {
            return res.status(400).send({status: false, msg: "Enter profileImage " })
        }

        if (!isValid(phone)) {
            return res.status(400).send({status: false, msg: "Enter phone no. " })
        }

        if (!(/^[6-9]\d{9}$/.test(phone))) {
            return res.status(400).send({ status: false, message: `Phone number should be a valid number` })

        }
        
        const isphone = await userModel.findOne({ phone })
        if (isphone) {
            return res.status(400).send({status: false, msg: "Phone no.  is already used" })
        }
          
        if (!password) {
            return res.status(400).send({status: false, msg: "Password is required" })
        }
       
        if (!isValid(password.trim())) {
            return res.status(400).send({status: false, msg: "Enter Password " })
        }
        if (!(/^[a-zA-Z0-9!@#$%^&*]{8,15}$/.test(password.trim()))) {
            return res.status(400).send({status: false, msg: "password length Min.8 - Max. 15" })
        }

        if (!isValid(address)) {
            return res.status(400).send({status: false, msg: "Enter Address of User " })
        }

        if (!isValid(billing)) {
            return res.status(400).send({status: false, msg: "Enter billing address " })
        }
      

        const NewUsers = await userModel.create(user)
        return res.status(201).send({ Status: true, msg: "Data sucessfully Created", data: NewUsers })

    }
    catch (error) {
        return res.status(500).send(error.message)
    }
}


module.exports.createUser=createUser