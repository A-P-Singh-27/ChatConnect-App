const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    pic:{
        type:String,
        required:true,
        default:"https://upload.wikimedia.org/wikipedia/commons/b/bc/Unknown_person.jpg"
    },
},{
    timestamps:true
});

const user = mongoose.model("User",userSchema);
module.exports = user;