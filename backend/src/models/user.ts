import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export type Usertype = {
    _id: string,
    email: string,
    mobile: string,
    password: string,
    firstName: string,
    lastName: string,
    isVerified: boolean,
}

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    isVerified: { type: Boolean, default: false }
});

userSchema.pre("save", async function (next) {
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
})

const User = mongoose.model<Usertype>("User", userSchema);

export default User;