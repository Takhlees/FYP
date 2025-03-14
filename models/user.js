import mongoose, { models } from "mongoose";

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    date: {
        type: Date,
        default: Date.now(),
    },
    resetToken: {
        type: String,
        required: false,
    },
    resetTokenExpiry: {
        type: Date,
        required: false,
    },
})

const User = models.User || mongoose.model("User", UserSchema);
export default User;
