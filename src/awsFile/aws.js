const aws = require("aws-sdk")
// s3 and cloud stodare
//  step1: multer will be used to get access to the file in nodejs( from previous session learnings)
//  step2:[BEST PRACTISE]:- always write s2 upload function separately- in a separate file/function..exptect it to take file as input and return the uploaded file as output
// step3: aws-sdk install - as package
// step4: Setupconfig for aws authenticcation- use code below as plugin keys that are given to you
//  step5: build the uploadFile funciton for uploading file- use code below and edit what is marked HERE only


//PROMISES:-
// -you can never use await on callback..if you awaited something , then you can be sure it is within a promise
// -how to write promise:- wrap your entire code inside: "return new Promise( function(resolve, reject) { "...and when error - return reject( err )..else when all ok and you have data, return resolve (data)


aws.config.update({
    region: "ap-south-1",
    apiVersion: '2006-03-01',
    credentials: {
        accessKeyId: "AKIAY3L35MCRUJ6WPO6J",
        secretAccessKey: "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",
    }
})

let uploadFile = async (file) => {
    return new Promise(function (resolve, reject) {
        // this function will upload file to aws and return the link
        let s3 = new aws.S3(); // we will be using the s3 service of aws

        var uploadParams = {
            ACL: "public-read",
            Bucket: "classroom-training-bucket",  //HERE
            Key: "abc/" + file.originalname, //HERE 
            Body: file.buffer
        }
        s3.upload(uploadParams, function (err, data) {
            if (err) {
                return reject({ "error": err })
                 //upload to s3 and get the uploaded link
            // res.send the link back to frontend/postman
            }
            return resolve(data.Location)
        })
    })
}

module.exports = { uploadFile }

