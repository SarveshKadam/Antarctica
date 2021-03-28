const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const validator =  require('validator')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
dotenv.config({path : '../config.env'});


const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        trim:true
    },
    lastname:{
        type: String,
        required: true,
        trim:true
    },
    email :{
        required: true,
        unique:true,
        type: String,
        trim:true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Provide a proper email address")
            }
        }
    },
    password:{
        required: true,
        type: String,
        trim: true
    },
    employeeID:{
        required:true,
        type:String,
        trim:true,
        unique:true
    },
    organization:{
        type: mongoose.Schema.Types.ObjectId,
        required : true,
        ref: 'Employee'
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
},{
    timestamps:true
});

userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    return userObject
}

userSchema.methods.generateAuthToken = async function(){
    const user = this

    const token = jwt.sign({id : user._id.toString()},process.env.SECRET_TOKEN)

    user.tokens = await user.tokens.concat({token})

    await user.save()

    return token
}

userSchema.statics.checkCredentials = async(email,password)=>{
    const user = await User.findOne({email})

    if(!user){
        throw new Error('Unable to login')
    }

    const isValid = await bcrypt.compare(password,user.password)
    if(!isValid){
        throw new Error("Credentials are not valid")
    }

    return user;
}

userSchema.pre('save',async function(next){
    const user =  this;
    if(user.isModified('password')){
        const hashedPassword = await bcrypt.hash(user.password,8)
        user.password = hashedPassword
    }
    next()
})

const User = mongoose.model('User', userSchema)

module.exports =  User