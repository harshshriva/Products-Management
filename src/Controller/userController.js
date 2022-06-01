const bcrypt = require('bcrypt')
const userModel = require("../models/userModel")
const { uploadFile } = require("../awsFile/aws")
const mongoose = require('mongoose')
const validator=require("../validator/validator")
//const cryptr=require('cryptr')
const jwt = require("jsonwebtoken");

const isValid = function(value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}


//User Registration

const createUser = async function(req, res) {
        try {

        let data = req.body
     
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "body is required" })
        }


        if (!isValid(data.fname)) {
            return res.status(400).send({ status: false, msg: "Enter FirstName " })
        }

        if (!isValid(data.lname)) {
            return res.status(400).send({ status: false, msg: "Enter LastName " })
        }
        if (!isValid(data.email)) {
            return res.status(400).send({ status: false, msg: "Enter email " })
        }
        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email.trim()))) {
            return res.status(400).send({ status: false, message: `Email should be a valid email address` })

        }
        const isemail = await userModel.findOne({ email: data.email })
        if (isemail) {
            return res.status(400).send({ status: false, msg: "Email.  is already used" })
        }

       
        if (!isValid(data.phone)) {
            return res.status(400).send({ status: false, msg: "Enter phone Number " })
        }

        if (!(/^[6-9]\d{9}$/.test(data.phone))) {
            return res.status(400).send({ status: false, message: `Phone number should be a valid number` })

        }

        const isphone = await userModel.findOne({ phone: data.phone })
        if (isphone) {
            return res.status(400).send({ status: false, msg: "Phone no.  is already used" })
        }

        if (!isValid(data.password.trim())) {
            return res.status(400).send({ status: false, msg: "Enter Password " })
        }
        if (!/^[a-zA-Z0-9!@#$%^&*]{8,15}$/.test(data.password.trim())) {
            return res.status(400).send({ status: false, msg: "password length Min.8 - Max. 15" })
            
        }

    const salt = await bcrypt.genSalt(10);
    const passwordhash=await bcrypt.hash(data.password,salt)
    data.password=passwordhash
    console.log(passwordhash)

        //address---------------------------------------------------------------------------------------------------
        if (!data.address) {
            return res.status(400).send({ status: false, message: "address required" })
        }
        let userAdd = JSON.parse(data.address)//parse convert the string data into object with help of parse
        console.log(userAdd)

        if (!userAdd.shipping || !userAdd.billing) {
            return res.status(400).send({ status: false, message: "shipping and billing address required" })

        }
        //---------------------------------------------------------------------
        if (!userAdd.shipping.street || !userAdd.billing.street) {
            return res.status(400).send({ status: false, message: "street is  required " })

        }
        if (!userAdd.shipping.city || !userAdd.billing.city) {
            return res.status(400).send({ status: false, message: "city is  required" })

        }
        if (!userAdd.shipping.pincode || !userAdd.billing.pincode) {
            return res.status(400).send({ status: false, message: "pincode is  required " })

        }
        //-------------------------------------------------------------------
        let Sstreet = userAdd.shipping.street
        let Scity = userAdd.shipping.city
        let Spincode = parseInt(userAdd.shipping.pincode) //parseInt convert string into integers/numbers
        if (Sstreet) {
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
            let validatePincode = /^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/gm //must not start with 0,6 digits and space(optional)
            if (!validatePincode.test(Spincode)) {
                return res.status(400).send({ status: false, message: "enter valid pincode in shipping" })
            }
        }


        let Bstreet = userAdd.billing.street
        let Bcity = userAdd.billing.city //billing
        let Bpincode = parseInt(userAdd.billing.pincode)
        if (Bstreet) {
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
            let validatePincode = /^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/gm //must not start with 0,6 digits and space(optional)
            if (!validatePincode.test(Bpincode)) {
                return res.status(400).send({ status: false, message: "enter valid pincode in shipping" })
            }
        }
        data.address = userAdd
        console.log(data.address)

        //uploading cover photo in aws-------------------------------------------------------------------------
        let files = req.files
        if (files && files.length > 0) {
            //upload to s3 and get the uploaded link
            // res.send the link back to frontend/postman
            let uploadedFileURL = await uploadFile(files[0])
            data.profileImage = uploadedFileURL
            console.log(2)
        } else {
            return res.status(400).send({ message: "profile cover image not given" })
        }



        // //create user--------------------------------------------------------------------------------------------------
        const Newuser = await userModel.create(data)
        return res.status(201).send({ status: true, message: "User created successfully", data: Newuser })

    }
    catch (error) {
        return res.status(500).send(error.message)
    }
}


const userLogin=async function (req,res){
    try{
    let data=req.body


  let findUser = await userModel.findOne({ email:data.email})
  console.log(findUser)
      if (!findUser) return res.status(404).send({ status: false, message: "email or password is incorrect" })  
      
      const passwordDecrept=await bcrypt.compare(data.password, findUser.password)
      console.log(passwordDecrept)
      if (!passwordDecrept) return res.status(400).send({ status: false, message: " password is incorrect" })  
     
        const userID = findUser._id;
        const payLoad = { userId: userID };
        const secretKey = "userp51";
        const token = jwt.sign(payLoad, secretKey, { expiresIn: "10h" });

  
      res.status(200).send({ status: true, message: "User login successfully", data: { userID: findUser._id, token: token } })
    }catch (err) {
      res.status(500).send({ status: false, error: err.message })
    }
  
  }




const getuserById = async function (req, res) {
    try {
        //FETCH USERID FROM THE PARAMS-----
       // req.setHeader("x-api-key", token);

        const userIdInParams = req.params.userId
        console.log(userIdInParams)
        let decodedToken = req.userId
        console.log(decodedToken)
        if(decodedToken != userIdInParams){

            return res.status(403).send({status:false, message:"User Not authorized!" })
         }
         

        //MAKE BD CALL TO FIND USER DETAIL BY USERID----
        let userDetail = await userModel.findOne({_id:userIdInParams})
        res.status(200).send({ status: true,message: "User profile details",data:userDetail})
        
    } catch (err) {
        return res.status(500).send({ status: false, Message: err.Message })
}
}
//Update Profile //PUT /user/:userId/profile 

const updateProfile = async function (req, res) {
    try {

        const requestBody = req.body
      const headers=req.userId
      const params = req.params.userId
      if (headers  != params) {
          return res.status(400).send({statuse:false, message:"Unuthorized"})
      }
        if (!validator.isValidRequestBody(requestBody)) return res.status(400).send({ status: false, msg: "please provide user updation details in form data of request body" })
        let { fname, lname, email, phone, password, address } = requestBody
        


        const user = await userModel.findById(req.params.userId)
        let updateUserData = {}


        if ('fname' in req.body) {

            if (!validator.isValid(fname)) return res.status(400).send({ status: false, message:  "fname, You can pass only a to z OR A to Z." })
          
            if (!validator.isStrictString(fname)) return res.status(400).send({ status: false, message:"fname, You can pass only a to z OR A to Z." })

            if (!('$set' in updateUserData)) updateUserData["$set"] = {};
            updateUserData['$set']['fname'] = fname

        }


        if ('lname' in req.body) {


            if (!validator.isValid(lname)) return res.status(400).send({ status: false, message: "lname, You can pass only a to z OR A to Z." })
          
            if (!validator.isStrictString(lname)) return res.status(400).send({ status: false, message: "lname, You can pass only a to z OR A to Z."})

            if (!('$set' in updateUserData)) updateUserData["$set"] = {};
            updateUserData['$set']['lname'] = lname

        }


        if ('email' in req.body) {


            if (!validator.isValid(email)) return res.status(400).send({ status: false, message:" email, You can pass only a valid email." })
           
            if (!validator.isValidEmail(email)) return res.status(400).send({ status: false, message: "email, You can pass only a valid email." })


            let duplicateEmail = await userModel.findOne({ email: email })
            if (duplicateEmail) return res.status(400).send({ status: false, message: `Email Already Present. Take another email` });


            if (!('$set' in updateUserData)) updateUserData["$set"] = {};
            updateUserData['$set']['email'] = email

        }


        if (req.files && req.files.length > 0) {


            const profileImage = await awsConnection.uploadProfileImage(req.files)
            if (!profileImage) return res.status(400).send({ status: false, message: "there is an error to upload profile image. for more details move on console" })


            if (!('$set' in updateUserData)) updateUserData["$set"] = {};
            updateUserData['$set']['profileImage'] = profileImage

        }


        if ('phone' in req.body) {


            if (!validator.isValid(phone)) return res.status(400).send({ status: false, message: "phone, You can pass only a valid Indian Mobile No." })
         
            if (!validator.isValidPhone(phone)) return res.status(400).send({ status: false, message:  "phone, You can pass only a valid Indian Mobile No." })


            let duplicatePhone = await userModel.findOne({ phone: phone })
            if (duplicatePhone) return res.status(400).send({ status: false, message: `Phone Already Present. Take another Phone Number` });


            if (!('$set' in updateUserData)) updateUserData["$set"] = {};
            updateUserData['$set']['phone'] = phone

        }


        if ('password' in req.body) {


            if (!validator.isValid(password)) return res.status(400).send({ status: false, message:  "password, You can pass only a valid password more than 8 character and less than 15 character." })
           
            if (!validator.isValidPassword(password)) return res.status(400).send({ status: false, message:" password, You can pass only a valid password more than 8 character and less than 15 character."})
            const encryptedPassword = await setEncription.setEncription(password)


            if (!('$set' in updateUserData)) updateUserData["$set"] = {};
            updateUserData['$set']['password'] = encryptedPassword

        }


        if ('address' in req.body) {


            const addressSuggestData = { "shipping": { "street": "abc road", "city": "indb", "pincode": 777777 }, "billing": { "street": "def road", "city": "indb", "pincode": 999979 } }


            const addressData = await validator.isValidAddress(address)
           
            if (!addressData) return res.status(400).send({ status: false, msg: "please provide address in object form.", addressSuggestData: addressSuggestData })


            address = JSON.stringify(user.address)
            const schemaAddress = await validator.isValidAddress(address)


            if (!('$set' in updateUserData)) updateUserData["$set"] = {};
            updateUserData['address'] = schemaAddress


            const { shipping, billing } = addressData;


            if ('shipping' in addressData) {


                const { street, city, pincode } = shipping


                if ('street' in shipping) {
                    if (!validator.isValid(street)) return res.status(400).send({ status: false, msg: "please provide 'street' key in billing address." })


                    if (!('$set' in updateUserData)) updateUserData["$set"] = {};
                    updateUserData['address']['shipping']['street'] = street

                }


                if ('city' in shipping) {


                    if (!validator.isValid(city)) return res.status(400).send({ status: false, msg: "please provide 'city' key in shipping address." })
                  
                    if (!validator.isStrictString(city)) return res.status(400).send({ status: false, message: "city, You can pass only a to z OR A to Z." })


                    if (!('$set' in updateUserData)) updateUserData["$set"] = {};
                    updateUserData['address']['shipping']['city'] = city

                }

                if ('pincode' in shipping) {
                    if (!validator.isValid(pincode)) return res.status(400).send({ status: false, message: "pincode, You can pass only 0 to 9 digit." })
                    
                    if (!validator.isValidPincode(pincode)) return res.status(400).send({ status: false, message:  "pincode, You can pass only 0 to 9 digit."})


                    if (!('$set' in updateUserData)) updateUserData["$set"] = {};
                    updateUserData['address']['shipping']['pincode'] = pincode

                }

            }

            if ('billing' in addressData) {

                const { street, city, pincode } = billing

                if ('street' in shipping) {

                    if (!validator.isValid(street)) return res.status(400).send({ status: false, msg: "please provide 'street' key in billing address." })

                    if (!('$set' in updateUserData)) updateUserData["$set"] = {};
                    updateUserData['address']['billing']['street'] = street

                }

                if ('city' in shipping) {

                    if (!validator.isValid(city)) return res.status(400).send({ status: false, msg: "please provide 'city' key in billing address." })
                   
                    if (!validator.isStrictString(city)) return res.status(400).send({ status: false, message: "city, You can pass only a to z OR A to Z." })

                    if (!('$set' in updateUserData)) updateUserData["$set"] = {};
                    updateUserData['address']['billing']['city'] = city

                }

                if ('pincode' in shipping) {


                    if (!validator.isValid(pincode)) return res.status(400).send({ status: false, message: "pincode, You can pass only 0 to 9 digit." })
                   
                    if (!validator.isValidPincode(pincode)) return res.status(400).send({ status: false, message: "pincode, You can pass only 0 to 9 digit."})


                    if (!('$set' in updateUserData)) updateUserData["$set"] = {};
                    updateUserData['address']['billing']['pincode'] = pincode

                }

            }

        }


       // console.log("updateUserData", updateUserData)

        const updatedData = await userModel.findOneAndUpdate({ _id: req.params.userId }, updateUserData, { new: true })
        return res.status(200).send({ status: true, message: "User profile updated", data: updatedData })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


module.exports = { createUser, userLogin, getuserById, updateProfile }


