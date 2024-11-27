const mongoose = require("mongoose");
const validator = require("validator");
const { default: isEmail } = require("validator/lib/isEmail");
const bcrypt = require("bcrypt"); 

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true, 'Name is required']
    },
    email:{
        type:String,
        required: [true, 'Email is required'],
        unique:true,
        validate: validator.isEmail,
        lowercase:true
    },
    password:{
        type:String,
        required: [true, 'Password is required'],
        minlength: 8
    },
    confirmPassword:{
        type:String,
        required: [true, 'Password is required'],
        validate:{
            validator: function(){
                return this.password === this.confirmPassword;
            },
            message: "password doesn't match"
        }
    }
    
},
{
    timestamps:true
})

userSchema.methods.comparePassword = async (pswd,pswdb)=>{
    return await bcrypt.compare(pswd,pswdb)
} 

userSchema.pre("save", async function(next){
    this.password = await bcrypt.hash(this.password,12)
    this.confirmPassword = undefined
    next()
})

const User = mongoose.model("user",userSchema)

module.exports = User;
// hashing -== encrypt