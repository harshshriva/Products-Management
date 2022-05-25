const userModel = require("../models/userModel")
const validator = require("../validator/Validator")

const authorization = async function (req, res, next) {

    try {
        let requestedUserId = req.userId;
        let paramsuserId = req.params.userId;
        if (paramsuserId.length < 24 || paramsuserId.length > 24) {
            return res.status(400).send({ status: false, msg: "Plz Enter Valid Length Of userId Params" });
        }
        
        const isuserPresent = await userModel.findById({ _id: paramsuserId });
        if (!isuserPresent) {
            return res.status(404).send({ status: false, msg: "user is not present" });
        }

        let presentedUserId = isuserPresent.userId
        if (requestedUserId === presentedUserId) {
            return res.status(201).send({ status: false, msg: "authorized" });
        }
        // if(requestedUserId != presentedUserId){
        //     return res.status(400).send({ status: false, msg: "Unauthorized" });   
        // }

 next()

    } catch (err) {
        res.status(500).send({ msg: "Internal Server Error", error: err.message });
    }
};





module.exports.authorization = authorization