const mongoose = require('mongoose')

const userSchema=new mongoose.Schema({
        fname: {type:String, required:true, trim:true},
        lname: {type:String, required:true, trim:true},
        email: {type: String, required:true,unique:true, lowercase:true,trim:true,
            validate: {
                validator: function (email) {
                    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
                }, message: 'Please fill a valid email address', isAsync: false
            }},
        profileImage: {type:String, required:true}, // s3 link
        phone: {type:String, unique:true, unique:true,
            validate: {
                validator: function (phone) {
                    return /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/.test(phone)
                }, message: 'Please fill a valid mobile number', isAsync: false
            }}, 
        password: {type: String, required:true,}, // encrypted password
        address: {
          shipping: {
            street: {type:String, required:true},
            city: {type:String, required:true},
            pincode: {type:Number, required:true}
          },
          billing: {
            street: {type:String, required:true},
            city: {type:String, required:true},
            pincode: {type:Number, required:true}
          }}
        },{timestamps:true})

        module.exports=mongoose.model('User',userSchema)