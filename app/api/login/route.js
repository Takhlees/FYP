import User from "../../../models/user";
import { connectToDB } from "../../../utils/database";
import { NextResponse } from "next/server";
// import bcrypt from "bcrypt";



export const POST = async (req, res) =>{
  try {
    await connectToDB()
    const {email} = await req.json();
    const user = await User.findOne({ email }).select("_id");
    console.log("User", user);
    return new NextResponse.json({user})
    
  } catch (error) {
    return new NextResponse.json({message:"an error occured while searching the user", error},{status:500})
  }
}