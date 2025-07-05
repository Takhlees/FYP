// import ScanUpload from "@models/scanUpload";
// import { NextResponse } from "@node_modules/next/server";
// import { connectToDB } from "@utils/database";

// export async function PUT(req,{params}) {
//   try {
//     const {id} = await params;
    
//     if(!id){
//       return NextResponse.json()
//     }
    
//     const status = await req.body()
//     await connectToDB();

        
//         const updatedMail = await ScanUpload.findByIdAndUpdate(
//             id,
//             {status},
//             {new:true}
//         )

//         if(!updatedMail){
//             return new NextResponse.json({message: "Mail not found"},{status:404})
//         }

//         return NextResponse.json(updatedMail,{status:200})
        
//     } catch (error) {
//         return NextResponse.json(
//             { message: "Failed to update mail", error: error.message },
//             { status: 500 }
//           );
//     }
// }



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

import ScanUpload from "@models/scanUpload";
import { NextResponse } from "next/server";
import { connectToDB } from "@utils/database";

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ message: "Missing id parameter" }, { status: 400 });
    }
    
    // Fix: Use req.json() instead of req.body()
    const { status } = await req.json();
    
    await connectToDB();
        
    const updatedMail = await ScanUpload.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedMail) {
      // Fix: Remove 'new' keyword before NextResponse.json
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

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "ID is required" }, 
        { status: 400 }
      );
    }

    await connectToDB();
    const mail = await ScanUpload.findById(id);

    if (!mail) {
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

    // Check if file exists and has data
    if (!mail.file || !mail.file.data) {
      return NextResponse.json(
        { error: 'PDF file not found in this mail' }, 
        { status: 404 }
      );
    }

    // Ensure we have the correct content type
    const contentType = mail.file.contentType || 'application/pdf';
    
    // Create response with proper headers
    return new NextResponse(mail.file.data, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${mail.subject || 'document'}.pdf"`,
        'Cache-Control': 'no-cache',
      },
    });
    
  } catch (error) {
    console.error('PDF fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to load PDF', details: error.message }, 
      { status: 500 }
    );
  }
}