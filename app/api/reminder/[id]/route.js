import { connectToDB } from "@utils/database";
import ScanUpload from "@models/scanUpload";
import { NextResponse } from "@node_modules/next/server";

export async function PUT(req,{params}) {
    
    try {
        const { id } = await params;

        if(!id){
            return NextResponse.json({ message: "Missing id parameter" },{status: 404});
        }

        const {status} = await req.json();
        
        await connectToDB();
      const updatedMail = await ScanUpload.findByIdAndUpdate(
        id,
        { status},
        { new: true }
      );

      if (!updatedMail) {
        return NextResponse.json({ message: "Mail not found" },{status: 404});
      }

      return NextResponse.json(updatedMail,{status: 200});
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to update mail", error: error.message },
            { status: 500 }
          );
    }

}