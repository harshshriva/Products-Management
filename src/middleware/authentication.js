const jwt = require('jsonwebtoken');

const authentication = async function (req, res, next) {
    try {
        let token = req.headers["x-Api-key"];
        if (!token) token = req.headers["x-api-key"];
        if (!token) {
            return res.status(400).send({ status: false, msg: "Token required! Please login to generate token" });
        }

        let tokenValidity = jwt.decode(token, "userp51");
        let tokenTime = (tokenValidity.expiresIn) * 1000;
        let CreatedTime = Date.now()
        if (CreatedTime > tokenTime) {
            return res.status(400).send({ status: false, msg: "token is expired, login again" })
        }

        let decodedToken = jwt.verify(token, "userp51");
        if (!decodedToken) {
            return res.status(401).send({ status: false, msg: "token is invalid" });
        }
        req["userId"] = decodedToken.userId;

        next();
    } catch (err) {
        res.status(500).send({ msg: "Internal Server Error", error: err.message });
    }
};

module.exports = {authentication}