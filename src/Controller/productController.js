const { uploadFile } = require("../awsFile/aws")
const productModel = require("../models/product")
const validator=require("../validator/validator")



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
const getProductBYQuery = async function(req, res) {

    try {
        if (req.query.size || req.query.name || req.query.priceGreaterThan || req.query.priceLessThan) {
            let availableSizes = req.query.size
            let title = req.query.name
            let priceGreaterThan = req.query.priceGreaterThan
            let priceLessThan = req.query.priceLessThan
            obj = {}
            if (availableSizes) {
                obj.availableSizes = availableSizes
            }
            if (title) {
                obj.title = { $regex: title, $options: " " }
            }
            if (priceGreaterThan) {
                obj.price = { $gt: priceGreaterThan }
            }
            if (priceLessThan) {
                obj.price = { $lt: priceLessThan }
            }
            obj.isDeleted = false
            obj.deletedAt = null

            if (req.query.sort === -1) {
                const getProductsList = await productModel.find(obj).sort({ price: -1 })

                if (!getProductsList || getProductsList.length == 0) {
                    res.status(400).send({ status: false, message: `product is not available right now.` })
                } else {
                    res.status(200).send({ status: true, message: 'Success', data: getProductsList })
                }

            } else {
                const getProductsList = await productModel.find(obj).sort({ price: 1 })

                if (!getProductsList || getProductsList.length == 0) {
                    res.status(400).send({ status: false, message: `product is not available right now.` })
                } else {
                    res.status(200).send({ status: true, message: 'Success', data: getProductsList })
                }
            }


        } else {
            if (req.query.sort === -1) {
                const getListOfProducts = await productModel.find({ isDeleted: false, deletedAt: null }).sort({ price: -1 })
                res.status(200).send({ status: true, message: 'Success', data: getListOfProducts })
            } else {
                const getListOfProducts = await productModel.find({ isDeleted: false, deletedAt: null }).sort({ price: 1 })
                res.status(200).send({ status: true, message: 'Success', data: getListOfProducts })
            }
        }
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }

}

module.exports = {createproducts,getProductBYQuery}
