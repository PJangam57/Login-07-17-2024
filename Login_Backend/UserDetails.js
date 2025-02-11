import mongoose from 'mongoose';

const UserDetailsSchema = new mongoose.Schema({
    name: String,
    email: {type: String, unique: true},
    mobile: String,
    password: String,
},
{
    collection: "UserInfo",
}

);

const User = mongoose.model("UserInfo", UserDetailsSchema);

export default User;