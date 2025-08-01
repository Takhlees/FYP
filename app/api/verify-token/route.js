// import User from "@models/user";
// import { NextResponse } from "next/server";
// import { connectToDB } from "@utils/database";
// import crypto from "crypto";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//     // Parse request
//     const { token } = await req.json();
//     await connectToDB();

//     const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

//     const user = await User.findOne({
//         resetToken: hashedToken,
//         resetTokenExpiry: { $gt: Date.now() },
//     })

//     if(!user){
//         return NextResponse.json({ msg: "Token is invalid or expired" }, { status: 401 })
//     }

//     return new NextResponse.json(user, { status:200})


// }




import User from "@models/user";
import { NextResponse } from "next/server";
import { connectToDB } from "@utils/database";
import crypto from "crypto";

// export async function POST(req) {
//   const { token } = await req.json();
//   await connectToDB();

//   const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

//   const user = await User.findOne({
//     resetToken: hashedToken,
//     resetTokenExpiry: { $gt: Date.now() },
//   });

//   if (!user) {
//     return NextResponse.json({ error: "Token is invalid or expired" }, { status: 401 });
//   }

//   return NextResponse.json({ email: user.email }, { status: 200 });
// }



export async function POST(req) {
  try {
    const { token } = await req.json();
    
    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    await connectToDB();

    // Hash the received token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Check ALL users with reset tokens
    const allUsersWithTokens = await User.find({ 
      resetToken: { $exists: true, $ne: null } 
    }).select('email resetToken resetTokenExpiry');
    
    
    allUsersWithTokens.forEach((u, index) => {
      const isExpired = u.resetTokenExpiry < Date.now();
      const tokenMatches = u.resetToken === hashedToken;

    });

    // Now search with both conditions
    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpiry: { $gt: Date.now() }
    });

    const userWithToken = await User.findOne({ resetToken: hashedToken });
    
    if (!user) {
      return NextResponse.json({ error: "Token is invalid or expired" }, { status: 400 });
    }

    return NextResponse.json({ email: user.email }, { status: 200 });

  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}

