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

export async function POST(req) {
  const { token } = await req.json();
  await connectToDB();

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetToken: hashedToken,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return NextResponse.json({ error: "Token is invalid or expired" }, { status: 401 });
  }

  return NextResponse.json({ email: user.email }, { status: 200 });
}
