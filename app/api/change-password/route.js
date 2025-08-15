import { connectToDB } from "@utils/database";
import User from "@models/user";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


export async function PUT(req) {
//   This function should update the password in the database
try {
  const session = await getServerSession();

  if (!session){
    return NextResponse.json( 
      { message: "Not authenticated" },
      { status: 401 }
    );
}

  await connectToDB();
  const email = session.user.email;

  const user = await User.findOne({email})

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const body = await req.json();

    const { currentPassword, newPassword,confirmPassword} = body;
    

    // Validate password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);

    if (!isValidPassword) {
        return NextResponse.json(
          { message: "Invalid current password" }, // Use "message" consistently
          { status: 401 }
        );
      }
      


    if (newPassword !== confirmPassword) {
        return NextResponse.json(
          { msg: "New password and confirm password do not match" },
          { status: 400 }
        );
      }

    

  // Generate Reset Token
  const resetToken = crypto.randomBytes(20).toString("hex");
  const passwordResetToken = crypto
  .createHash("sha256")
  .update(resetToken)
  .digest("hex");
  const passwordResetExpires = Date.now() + 3600000;
  
  user.resetToken = passwordResetToken;
  user.resetTokenExpiry = passwordResetExpires;
  await user.save();
  

const hashedPassword = await bcrypt.hash(newPassword, 10);
user.password = hashedPassword;
await user.save();

} catch (error) {
    return NextResponse.json({ message: "An error occurred while changing the password. Please try again." }, { status: 500 });

    
}
return NextResponse.json({ message: "Password changed successfully" }, { status: 200 });

}


// import { connectToDB } from "@utils/database";
// import User from "@models/user";
// import bcrypt from "bcrypt";
// import { getServerSession } from "next-auth";
// import { NextResponse } from "next/server";


// export async function PUT(req) {
// //   This function should update the password in the database
//   try {
//     const session = await getServerSession();

//     if (!session) {
//       return NextResponse.json( 
//         { message: "Not authenticated" },
//         { status: 401 }
//       );
//     }

//     await connectToDB();
//     const email = session.user.email;

//     const user = await User.findOne({ email });

//     if (!user) {
//       return NextResponse.json({ message: "User not found" }, { status: 404 });
//     }

//     const body = await req.json();
//     console.log("Request received:", body);

//     const { currentPassword, newPassword, confirmPassword } = body;

//     // Validate password
//     const isValidPassword = await bcrypt.compare(currentPassword, user.password);

//     if (!isValidPassword) {
//       return NextResponse.json(
//         { message: "Invalid current password" },
//         { status: 401 }
//       );
//     }

//     if (newPassword !== confirmPassword) {
//       return NextResponse.json(
//         { message: "New password and confirm password do not match" },
//         { status: 400 }
//       );
//     }

//     // Hash new password
//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     // Update user password
//     user.password = hashedPassword;
//     // Remove any existing reset tokens
//     user.resetToken = undefined;
//     user.resetTokenExpiry = undefined;
//     // Save updated user to database
//     await user.save();

//     return NextResponse.json({ message: "Password changed successfully" }, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ message: `An error occurred while changing the password: ${error.message}` }, { status: 500 });
//   }
// }

