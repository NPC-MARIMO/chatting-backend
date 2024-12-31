const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        name : {
            type : String,
        },
        email: {
            type: String,
            required: true, 
            unique: true,
        },
        password: {
          type: String,
          required: true,
        },
        pfp : {
            type: String,
        },
        bio : {
            type: String
        },
        post : [{
            type : mongoose.Schema.Types.ObjectId,
            ref: "",
        }],
        follower : [{
            type : mongoose.Schema.Types.ObjectId,
            ref: "",
        }],
        following : [{
            type : mongoose.Schema.Types.ObjectId,
            ref: "",
        }],
        chats : [{
            type : mongoose.Schema.Types.ObjectId,
            ref: "",
        }]
    }
)

const User = mongoose.model("User", UserSchema);
module.exports = User;
