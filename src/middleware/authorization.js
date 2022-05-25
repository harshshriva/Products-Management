const userModel = require("../models/userModel")
const validator = require("../validator/Validator")

const authorization = async function (req, res, next) {

    try {
        let requestedUserId = req.userId;
        let paramsBookId = req.params.userId;
        if (paramsBookId.length < 24 || paramsBookId.length > 24) {
            return res.status(400).send({ status: false, msg: "Plz Enter Valid Length Of BookId Params" });
        }
        
        const isBookPresent = await userModel.findById({ _id: paramsBookId });
        if (!isBookPresent) {
            return res.status(404).send({ status: false, msg: "user is not present" });
        }

        let presentedUserId = isBookPresent.userId.toString().replace(/ObjectId\("(.*)"\)/, "$1");
        if (requestedUserId !== presentedUserId) {
            return res.status(401).send({ status: false, msg: "Unauthorized" });
        }

        next();
    } catch (err) {
        res.status(500).send({ msg: "Internal Server Error", error: err.message });
    }
};





module.exports.authorization = authorization