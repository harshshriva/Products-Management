const mongoose=require('mongoose')
const { uploadFile } = require("../awsFile/aws")
const productModel = require("../models/productModel")
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
                obj.title = { $regex: title, $options: 'i' };//i defined case sensitive
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

const getProductById = async function(req, res) {//Go to valid js for validation
    try {
        let productId = req.params.productId

        if (productId.length < 24 || productId.length > 24) {
            return res.status(400).send({ status: false, msg: "Plz Enter Valid Length Of productId in Params" });
        }

        if (!validator.isValidObjectId(productId)) {
            return res.status(400).send({ status: false, message: "please provide valid productId" });
        }

        let bData = await productModel.findById(productId);
        if (!bData) {
            return res.status(404).send({ status: false, message: "Data Not Found" });
        }

        const searchProduct = await productModel.findOne({ _id: productId, isDeleted: false })
        if (!searchProduct) {
            return res.status(400).send({ status: false, msg: 'product does not exist with this prouct id or incorrect product id' })
        }
        res.status(200).send({ status: true, msg: 'sucess', data: searchProduct })
    } catch (err) {
        res.status(500).send({ status: false, Message: err.message })
    }
}

const updateProduct = async(req,res)=>{
      try{
         let productId = req.params.productId
        
         let product = await productModel.findOne({_id:productId,isDeleted:false})

         if(!product)    return res.status(400).send({status:false,message:"product dont exist"})


         //-----------------------------------------------------------------------------------------------------------------


         let data = req.body

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: 'no data given for updation' })
        }

        //title---------------------------------------------------------------------------------------------

        if (data.title) {
        
        const title = await productModel.findOne({ title: data.title })
        if (title) {
            return res.status(400).send({ status: false, message: "title already exists" })
        }
        product.title=data.title
    }

        //---------------------------------description ------------------------------------------------------------
        if (data.description) {
            product.description = data.description
        }

        //-----------------------------------------price--------------------------------------------------------
        if (data.price) {
        
        if(!Number.isInteger(Number(data.price)) ) {
             return res.status(400).send({ status: false, message: "price is number" })
        }
        if(Number(data.price)<=0)      return res.status(400).send({ status: false, message: "price must be greater than 0" })
      const price=await productModel.findOne({_id:productId})
      console.log(price)
        product.price = price
        console.log(price)
    }

        //------------------------------------currencyId-----------------------------------------------------------
        if(data.currencyId)  {   

        if(data.currencyId!='INR')      return res.status(400).send({ status: false, message: "currency id must be in INR" })
         
        product.currencyId = data.currencyId
        }

        //------------------------------------currency format--------------------------------------------------------
        if(data.currencyFormat)     {

        if(data.currencyFormat!='₹')      return res.status(400).send({ status: false, message: "currency format must be in ruppees" })
        product.currencyFormat=data.currencyFormat
        }
        //---------------------------------------isfreeshippinhg--------------------------------------------------
        if(data.isFreeShipping){
            if(!['true','false'].includes(data.isFreeShipping.trim())){
                return res.status(400).send({ status: false, message: "isFreeShipping must be boolean" })
            }
          product.isFreeShipping = data.isFreeShipping
        }
        //----------------------------------------image--------------------------------------------------------------
             //uploading cover photo in aws-------------------------------------------------------------------------
             let files= req.files
             if(files && files.length>0){
                 //upload to s3 and get the uploaded link
                 // res.send the link back to frontend/postman
                 let image = files[0].originalname.split(".")
                 if(!['png','jpg','pdf'].includes(image[image.length-1])){
                    return res.status(400).send({ status: false, message: "must be png , jpg and pdf" })

                 }
                 let uploadedFileURL= await uploadFile( files[0] )
                 product.productImage = uploadedFileURL
                 
         }

        //-------------------------------------------style---------------------------------------------------------
        if (data.style) {
            product.style = data.style
        }
        //------------------------------------------available sizes----------------------------------------------------
        if(data.availableSizes){
            let arr = ["S", "XS","M","X", "L","XXL", "XL"]
            let givenSizes = data.availableSizes.split(",")
    
            const contains = givenSizes.some(e => !arr.includes(e))
            
            if(contains)      return res.status(400).send({ status: false, message: 'must be ["S", "XS","M","X", "L","XXL", "XL"]' })

          
            product.availableSizes=givenSizes
        }


        //----------------------------------------installments-----------------------------
        if (data.installments) {
        
        if(!Number.isInteger(Number(data.installments))  )    return res.status(400).send({ status: false, message: "installments is number" })

        if(Number(data.installments)<=0)      return res.status(400).send({ status: false, message: "installments must be greater than 0" })

        product.installments = data.installments
        }


        product.save()
         //------------------------------------------------------------------------------------------------------------------

         return res.status(200).send({status:true,message:"product updation successful",data:product})
    }
    catch(err){
        res.status(500).send({status:false,message:err.message})
    }
}

//Product Delete

const deleteProduct = async function (req, res) {

    try {



        const productId = req.params.productId
        if (!validator.isObjectId(productId)) 
        return res.status(400).send({ status: false, msg: "you can pass only object id in path params" })


        const isProductPresent = await productModel.findById(productId)
        if (!isProductPresent)
         return res.status(404).send({ status: false, msg: "product not found" })


        if (isProductPresent.isDeleted === true) 
        return res.status(404).send({ status: false, msg: "product is already deleted" })
        const productDelete = await productModel.findByIdAndUpdate(productId,
            {
                $set: {
                    isDeleted: true,
                    deletedAt: Date.now()
                }
            }, { new: true })


        return res.status(200).send({ status: true, msg: "product deleted successfully", data: productDelete })


    }

    catch (err) {

        return res.status(500).send({ status: false, msg: err.message })

    }

}


module.exports = {createproducts,getProductBYQuery ,deleteProduct ,getProductById,updateProduct}
