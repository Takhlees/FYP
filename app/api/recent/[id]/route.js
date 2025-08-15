import ScanUpload from "@models/scanUpload";
import { NextResponse } from "next/server";
import { connectToDB } from "@utils/database";

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ message: "Missing id parameter" }, { status: 400 });
    }
    
    const { status } = await req.json();
    
    await connectToDB();
        
    const updatedMail = await ScanUpload.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedMail) {
      return NextResponse.json({ message: "Mail not found" }, { status: 404 });
    }

    return NextResponse.json(updatedMail, { status: 200 });
        
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update mail", error: error.message },
      { status: 500 }
    );
  }
}

// export async function GET(req, { params }) {
//   try {
//     const { id } = await params;

//     if (!id) {
//       return NextResponse.json(
//         { error: "ID is required" }, 
//         { status: 400 }
//       );
//     }

//     await connectToDB();
//     const mail = await ScanUpload.findById(id);

//     if (!mail) {
//       return NextResponse.json(
//         { error: 'Mail not found' }, 
//         { status: 404 }
//       );
//     }

//     // If the request wants mail details (not PDF), return mail data
//     const url = new URL(req.url);
//     if (url.searchParams.get('details') === 'true') {
//       return NextResponse.json({
//         _id: mail._id,
//         subject: mail.subject,
//         status: mail.status,
//         category: mail.category,
//         department: mail.department,
//         createdAt: mail.createdAt
//       }, { status: 200 });
//     }

//     // Check if file exists and has data
//     if (!mail.file || !mail.file.data) {
//       return NextResponse.json(
//         { error: 'PDF file not found in this mail' }, 
//         { status: 404 }
//       );
//     }

//     // Ensure we have the correct content type
//     const contentType = mail.file.contentType || 'application/pdf';
    
//     // Create response with proper headers
//     return new NextResponse(mail.file.data, {
//       status: 200,
//       headers: {
//         'Content-Type': contentType,
//         'Content-Disposition': `inline; filename="${mail.subject || 'document'}.pdf"`,
//         'Cache-Control': 'no-cache',
//       },
//     });
    
//   } catch (error) {
//     console.error('PDF fetch error:', error);
//     return NextResponse.json(
//       { error: 'Failed to load PDF', details: error.message }, 
//       { status: 500 }
//     );
//   }
// }


export async function GET(req, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      console.error('No ID provided');
      return NextResponse.json(
        { error: "ID is required" }, 
        { status: 400 }
      );
    }

    await connectToDB();
    const mail = await ScanUpload.findById(id);

    if (!mail) {
      console.error('Mail not found for ID:', id);
      return NextResponse.json(
        { error: 'Mail not found' }, 
        { status: 404 }
      );
    }

    // If the request wants mail details (not PDF), return mail data
    const url = new URL(req.url);
    if (url.searchParams.get('details') === 'true') {
      return NextResponse.json({
        _id: mail._id,
        subject: mail.subject,
        status: mail.status,
        category: mail.category,
        department: mail.department,
        createdAt: mail.createdAt
      }, { status: 200 });
    }

    if (!mail.file || !mail.file.data) {
      console.error('PDF file not found in mail:', {
        hasFile: !!mail.file,
        hasData: !!(mail.file?.data),
        fileKeys: mail.file ? Object.keys(mail.file) : []
      });
      return NextResponse.json(
        { error: 'PDF file not found in this mail' }, 
        { status: 404 }
      );
    }

    // Convert data to Buffer if it isn't already
    let fileData = mail.file.data;
    if (!Buffer.isBuffer(fileData)) {
      if (typeof fileData === 'string') {
        // If it's a base64 string, decode it
        try {
          fileData = Buffer.from(fileData, 'base64');
        } catch (e) {
          // If not base64, try UTF-8
          fileData = Buffer.from(fileData, 'utf-8');
        }
      } else if (fileData instanceof Uint8Array) {
        fileData = Buffer.from(fileData);
      } else {
        console.error('Unknown file data type:', typeof fileData);
        return NextResponse.json(
          { error: 'Invalid file data format' }, 
          { status: 500 }
        );
      }
    }

    // Validate that it's a PDF by checking the header
    const pdfHeader = fileData.slice(0, 4).toString();
    if (pdfHeader !== '%PDF') {
      console.error('File does not appear to be a valid PDF. Header:', pdfHeader);
      return NextResponse.json(
        { error: 'File is not a valid PDF document' }, 
        { status: 400 }
      );
    }

    // Ensure we have the correct content type
    const contentType = mail.file.contentType || 'application/pdf';

    return new NextResponse(fileData, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline`,
        'Content-Length': fileData.length.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
    
  } catch (error) {
    console.error('PDF fetch error:', error);
    
    // More detailed error response
    return NextResponse.json(
      { 
        error: 'Failed to load PDF', 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }, 
      { status: 500 }
    );
  }
}