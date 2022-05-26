const { uploadFile } = require("../awsFile/aws")
const productModel = require("../models/product")
const {
    isValid, 
    isValidRequestBody, 
    isValidObjectId,
    isStrictString,
    isObjectId,
    isValidEmail,
    isValidPhone,
    isValidPassword,
    isValidAddress,
    isValidPincode}=require("../validator/validator")



const createproducts = async function(req, res) {

    let data = req.body

    let files = req.files
    if (files && files.length > 0) {
        //upload to s3 and get the uploaded link
        // res.send the link back to frontend/postman
        let uploadedFileURL = await uploadFile(files[0])
        data.productImage = uploadedFileURL
       
    } else {
        return res.status(400).send({ message: "profile cover image not given" })
    }
   
    const Newproduct = await productModel.create(data)
    return res.status(201).send({ status: true, message: "Product created successfully", data: Newproduct })


}

module.exports = {createproducts}
