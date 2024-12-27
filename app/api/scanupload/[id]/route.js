import { NextResponse } from 'next/server';
import { connectToDB } from "@/utils/database";
import ScanUpload from "@models/scanUpload";

export async function GET(req, { params }) {
  try {
    const { id } = params;  // The ID parameter from the URL
    
    // Connect to the database
    await connectToDB();
    
    // Find the document by ID
    const document = await ScanUpload.findById(id);
    if (!document) {
      return NextResponse.json({ message: "File not found" }, { status: 404 });
    }
    
    // Prepare the file data
    const fileBuffer = Buffer.from(document.file.data, 'base64');
    const contentType = document.file.contentType || 'application/octet-stream';
    const fileName = document.file.name || 'file.pdf'; // Use file name here
  
    // Check if the request is for download or viewing
    const isDownload = req.headers.get('Content-Disposition') === 'attachment';
    const contentDisposition = isDownload
      ? `attachment; filename="${fileName}"`
      : 'inline';  // For viewing, use inline
   
    // Send the file as response
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': contentDisposition, // Either inline or attachment based on request
      },
    });
  } catch (error) {
    console.error("Error fetching document:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
