import { connectToDB } from "@utils/database";
import User from "@models/user";
import bcrypt from "bcrypt";


export async function PUT(req){
    // This function should update the password in the database
    const {currentPassword , newPassword,confirmPassword } = req.body;
    await connectToDB();
    // const user = await User.findOne({_id: req.user._id});
    
    // Validate password
    const isValidPassword = await bcrypt.compare(currentPassword, User.password);
    

    if (!isValidPassword) {
        return new NextResponse.json({msg: "Invalid current password"}, {status: 401});
    }
    // Check if new password and confirm password match
    if (newPassword!== confirmPassword) {
        return new NextResponse.json({msg: "Passwords do not match"}, {status: 400});
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update user password
    // user.password = hashedPassword;
    
    // Save updated user to database
    // await user.save();
    
    // Return updated user data
    // return new NextResponse.json(user);
    
    // Additional requirements:
    // - Implement password strength validation
    // - Use environment variables for storing sensitive data like JWT secret key
    // - Use JWT for authentication and authorization
    // - Implement password reset token expiration time
    // - Add password reset link to email verification process
    // const

} 