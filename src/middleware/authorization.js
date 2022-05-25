
const validator = require("../validator/Validator")
const userModel = require("../models/userModel")

const authorization = async function (req, res, next) {

    try {


        const decodedToken = req.decodedToken;
        let userId = req.params.userId


        if (!validator.isObjectId(userId)) return res.status(400).send({ status: false, msg: "you can pass only object id in path params" })
        let isPresentUser = await userModel.findById(userId)


        if (!isPresentUser) return res.status(404).send({ status: false, msg: "User not found" })
        if (userId != decodedToken.userId) return res.status(401).send({ status: false, msg: "unauthorize access " })


        next()

    } catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, msg: "error occure for more information move on console", error: err.message })
    }
}



module.exports.authorization = authorization