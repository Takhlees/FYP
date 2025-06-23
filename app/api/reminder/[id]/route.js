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



export async function GET(request, { params }) {
  const { id } = await params; 

  try {
    await connectToDB();
    const mail = await ScanUpload.findOne({ _id: id });

    if (!mail?.file?.data) {
      return NextResponse.json({ error: 'PDF not found' }, { status: 404 });
    }

    return new NextResponse(mail.file.data, {
      status: 200,
      headers: {
        'Content-Type': mail.file.contentType || 'application/pdf',
      },
    });
    
  } catch (error) {
    console.error('PDF fetch error:', error);
    return NextResponse.json({ error: 'Failed to load PDF' }, { status: 500 });
  }
}
