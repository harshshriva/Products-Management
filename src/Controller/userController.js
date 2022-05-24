const bcrept= require('bcrypt')
const userModel = require("../models/userModel")
const { uploadFile } = require("../awsFile/aws")
const multer = require('multer');

const jwt = require("jsonwebtoken");

const isValidRequestBody = function (data) {
    return Object.keys(data).length > 0;
}


  const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

//User Registration
const createUser = async function (req, res) {
    try {
        let data = req.body
        //extracts params
        let { fname, lname,  email,profileImage, phone, password, address, billing } = data

        if (!isValidRequestBody(data)) {
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

          //address---------------------------------------------------------------------------------------------------
          if(!data.address ){
            return res.status(400).send({status:false,message:"address required"})
        }
        let userAdd = JSON.parse(data.address)

        if(!address.shipping  || !address.billing){
            return res.status(400).send({status:false,message:"shipping and billing address required"})

        }
//---------------------------------------------------------------------
        if(!address.shipping.street || !address.billing.street){
            return res.status(400).send({status:false,message:"street is  required "})

        }
        if(!address.shipping.city || !address.billing.city){
            return res.status(400).send({status:false,message:"city is  required"})

        }
        if(!address.shipping.pincode || !address.billing.pincode){
            return res.status(400).send({status:false,message:"pincode is  required "})

        }
        //-------------------------------------------------------------------
        let Sstreet = address.shipping.street
        let Scity = address.shipping.city
        let Spincode = parseInt(address.shipping.pincode)     //shipping
        if(Sstreet){
            let validateStreet = /^[a-zA-Z0-9]/
            if (!validateStreet.test(Sstreet)) {
                return res.status(400).send({ status: false, message: "enter valid street name in shipping" })
            }
        }

        if (Scity) {
            let validateCity = /^[a-zA-z',.\s-]{1,25}$/gm
            if (!validateCity.test(Scity)) {
                return res.status(400).send({ status: false, message: "enter valid city name in shipping" })
            }
        }
        if (Spincode) {
            let validatePincode = /^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/gm      //must not start with 0,6 digits and space(optional)
            if (!validatePincode.test(Spincode)) {
                return res.status(400).send({ status: false, message: "enter valid pincode in shipping" })
            }
        }


        let Bstreet = address.billing.street
        let Bcity = address.billing.city                             //billing
        let Bpincode = parseInt(address.billing.pincode)
        if(Bstreet){
            let validateStreet = /^[a-zA-Z0-9]/
            if (!validateStreet.test(Bstreet)) {
                return res.status(400).send({ status: false, message: "enter valid street name in shipping" })
            }
        }

        if (Bcity) {
            let validateCity = /^[a-zA-z',.\s-]{1,25}$/gm
            if (!validateCity.test(Bcity)) {
                return res.status(400).send({ status: false, message: "enter valid city name in shipping" })
            }
        }
        if (Bpincode) {
            let validatePincode = /^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/gm      //must not start with 0,6 digits and space(optional)
            if (!validatePincode.test(Bpincode)) {
                return res.status(400).send({ status: false, message: "enter valid pincode in shipping" })
            }
        }

        console.log(data)

        //uploading cover photo in aws-------------------------------------------------------------------------
        let files = req.files
        if (files && files.length > 0) {
            //upload to s3 and get the uploaded link
            // res.send the link back to frontend/postman
            let uploadedFileURL = await uploadFile(files[0])
            data.profileImage = uploadedFileURL
            console.log(2)
        } else {
             return res.status(400).send({message:"profile cover image not given"})
        }


        data.address = userAdd
        // //create user--------------------------------------------------------------------------------------------------
        const Newuser = await userModel.create(data)
        return res.status(201).send({ status: true, message: "success", data: Newuser })

    }
    catch (error) {
        return res.status(500).send(error.message)
    }
}

const userLogin = async function (req, res) {
    try {
        const requestBody = req.body;
        const userName = requestBody.email;
        const password = requestBody.password;

        const loginUser = await userModel.findOne({ email: userName.toLowerCase().trim(), password: password, });
        if (!loginUser) {
            return res.status(400).send({ status: false, message: "Plz Enter Valid Credentials" });
        }

        const userID = loginUser._id;
        const payLoad = { userId: userID };
        const secretKey = "userp51";
        const token = jwt.sign(payLoad, secretKey, { expiresIn: "6000000s" });

        res.status(200).send({ status: true, message: "Login successful", data: {token,userID} });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};




module.exports = {createUser , userLogin}
