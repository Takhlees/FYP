// import { NextResponse } from 'next/server';
// import { connectToDB } from "@/utils/database";
// import ScanUpload from "@models/scanUpload";

// export async function GET(req, { params }) {
//   try {
//     const { id } = await params;  // The ID parameter from the URL
    
//     // Connect to the database
//     await connectToDB();
    
//     // Find the document by ID
//     const document = await ScanUpload.findById(id);
//     if (!document) {
//       return NextResponse.json({ message: "File not found" }, { status: 404 });
//     }
    
//     // Prepare the file data
//     const fileBuffer = Buffer.from(document.file.data, 'base64');
//     const contentType = document.file.contentType || 'application/octet-stream';
//     const fileName = document.file.name || 'file.pdf'; // Use file name here
  
//     // Check if the request is for download or viewing
//     const isDownload = req.headers.get('Content-Disposition') === 'attachment';
//     const contentDisposition = isDownload
//       ? `attachment; filename="${fileName}"`
//       : 'inline';  // For viewing, use inline
   
//     // Send the file as response
//     return new NextResponse(fileBuffer, {
//       status: 200,
//       headers: {
//         'Content-Type': contentType,
//         'Content-Disposition': contentDisposition, // Either inline or attachment based on request
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching document:", error);
//     return NextResponse.json(
//       { message: "Internal Server Error", error: error.message },
//       { status: 500 }
//     );
//   }
// }


// export async function PUT(req, { params }) {
  
//   const { id } = await params; 
//   await connectToDB();
//   try {
//     const formData = await req.formData();
    
//     if (!id) {
//       return NextResponse.json({ error: "File ID is required for updating" }, { status: 400 });
//     }

//     const updateData = {
//       type: formData.get("type"),
//       department: formData.get("department"),
//       category: formData.get("category"),
//       fileName: formData.get("fileName"),
//       subject: formData.get("subject"),
//       date: formData.get("date"),
//       diaryNo: formData.get("diaryNo"),
//       from: formData.get("from"),
//       disposal: formData.get("disposal"),
//       status: formData.get("status"),
//     };

//     if (formData.has("file")) {
//       const file = formData.get("file");
//     }

//     const updatedFile = await ScanUpload.findByIdAndUpdate(id, updateData, { new: true });

//     if (!updatedFile) {
//       return NextResponse.json({ error: "File not found" }, { status: 404 });
//     }

//     return NextResponse.json({ message: "File updated successfully", file: updatedFile }, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }



import { NextResponse } from 'next/server';
import { connectToDB } from "@/utils/database";
import ScanUpload from "@models/scanUpload";
import { PDFDocument } from 'pdf-lib';

// Helper function to extract subject from OCR text
function extractSubjectFromText(text) {
  try {
    // Method 1: Look for explicit "Subject:" patterns
    const subjectPatterns = [
      /(?:subject|subj)[:\-\s]*(.+)/i,
      /(?:re|regarding)[:\-\s]*(.+)/i,
      /(?:matter|topic)[:\-\s]*(.+)/i
    ];

    for (const pattern of subjectPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        let extractedSubject = match[1].trim();
        // Clean up the extracted subject
        extractedSubject = extractedSubject.split('\n')[0]; // Take first line only
        extractedSubject = extractedSubject.replace(/[^\w\s\-.,]/g, ''); // Remove special chars
        if (extractedSubject.length > 10 && extractedSubject.length < 200) {
          return extractedSubject;
        }
      }
    }

    // Method 2: If no explicit subject found, look for prominent text (first meaningful line)
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    for (const line of lines) {
      // Skip headers, dates, addresses, etc.
      if (line.length > 15 && line.length < 150 && 
          !/^\d+/.test(line) && // Not starting with numbers
          !/date|from|to|dear|sir|madam/i.test(line) && // Not common letter headers
          !/^\w+\s*:/.test(line)) { // Not a field label
        return line;
      }
    }

    return null;
  } catch (error) {
    console.error('Error extracting subject from text:', error);
    return null;
  }
}


export async function GET(req, { params }) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ message: "Document ID is required" }, { status: 400 });
    }
    
    await connectToDB();
    
    const document = await ScanUpload.findById(id);
    if (!document) {
      return NextResponse.json({ message: "File not found" }, { status: 404 });
    }
    
    const url = new URL(req.url);
    const download = url.searchParams.get('download') === 'true';
    const preview = url.searchParams.get('preview') === 'true';
    
    if (download || preview) {
      // Return file data for download or preview
      let fileBuffer;
      try {
        if (typeof document.file.data === 'string') {
          // Data is stored as base64 string
          let base64Data = document.file.data;
          if (base64Data.startsWith('data:')) {
            base64Data = base64Data.split(',')[1];
          }
          fileBuffer = Buffer.from(base64Data, 'base64');
        } else {
          // Data is stored as Buffer (fallback for old records)
          fileBuffer = Buffer.from(document.file.data);
        }
      } catch (error) {
        console.error('Error converting file data:', error);
        return NextResponse.json({ message: "Error processing file data" }, { status: 500 });
      }
      
      const contentType = document.file.contentType || 'application/pdf';
      const fileName = document.file.name || document.fileName || 'document.pdf';
      
      // KEY CHANGE: Different Content-Disposition for preview vs download
      const disposition = download ? 'attachment' : 'inline';
      
      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `${disposition}; filename="${fileName}"`,
          'Content-Length': fileBuffer.length.toString(),
        },
      });
    } else {
      // Return document metadata (matching your exact schema fields)
      const documentData = {
        _id: document._id,
        type: document.type,
        diaryNo: document.diaryNo,
        date: document.date,
        department: document.department,
        fileName: document.fileName,
        category: document.category,
        subject: document.subject,
        status: document.status,
        from: document.from,
        disposal: document.disposal,
        createdAt: document.createdAt,
        updatedAt: document.updatedAt,
        fileInfo: {
          contentType: document.file.contentType,
          name: document.file.name,
          size: typeof document.file.data === 'string' ?
                 Buffer.from(document.file.data, 'base64').length :
                 (document.file.data ? document.file.data.length : 0)
        }
      };
      
      return NextResponse.json(documentData, { status: 200 });
    }
    
  } catch (error) {
    console.error("Error fetching document:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}



export async function PUT(req, { params }) {
  try {
    await connectToDB();
    const { id } =await params;

    // Check Content-Type to determine how to parse the request
    const contentType = req.headers.get("content-type");
    
    if (contentType && contentType.includes("application/json")) {
      // Handle JSON requests (like delete operations)
      const body = await req.json();
      
      if (body.action === "soft_delete") {
        // Handle soft delete
        const updatedDocument = await ScanUpload.findByIdAndUpdate(
          id,
          {
            isDeleted: body.isDeleted,
            deletedAt: body.deletedAt
          },
          { new: true }
        );

        if (!updatedDocument) {
          return NextResponse.json(
            { error: "Document not found" },
            { status: 404 }
          );
        }

        return NextResponse.json({
          message: "Document deleted successfully",
          document: updatedDocument
        });
      }
      
      // Handle other JSON-based updates here if needed
      return NextResponse.json(
        { error: "Unknown action" },
        { status: 400 }
      );
      
    } else if (contentType && contentType.includes("multipart/form-data")) {
      // Handle form data requests (like file updates)
      const formData = await req.formData();

      // Extract form data matching your schema
      const type = formData.get("type");
      const department = formData.get("department");
      const category = formData.get("category");
      const subject = formData.get("subject");
      const date = formData.get("date");
      const diaryNo = formData.get("diaryNo");
      const from = formData.get("from");
      const disposal = formData.get("disposal");
      const status = formData.get("status");
      const extractedText = formData.get("extractedText");
      const fileName = formData.get("fileName");
      const replaceFile = formData.get("replaceFile") === "true";

      // Prepare update data
      const updateData = {
        type,
        department,
        category,
        subject,
        date: date ? new Date(date) : undefined,
        diaryNo,
        from,
        disposal,
        status,
        extractedText,
        fileName,
        updatedAt: new Date()
      };

      // Remove undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined || updateData[key] === "") {
          delete updateData[key];
        }
      });

      // Handle file replacement if needed
      if (replaceFile) {
        const file = formData.get("file");
        if (file && file.size > 0) {
          try {
            // Find existing document to get current file path
            const existingDoc = await ScanUpload.findById(id);
            if (!existingDoc) {
              return NextResponse.json(
                { error: "Document not found" },
                { status: 404 }
              );
            }

            // Delete old file if it exists
            if (existingDoc.filePath) {
              const oldFilePath = path.join(process.cwd(), "public", existingDoc.filePath);
              try {
                await fs.unlink(oldFilePath);
              } catch (err) {
                console.warn("Could not delete old file:", err.message);
              }
            }

            // Save new file
            const buffer = Buffer.from(await file.arrayBuffer());
            const filename = `${Date.now()}_${file.name}`;
            const filepath = path.join(process.cwd(), "public/uploads", filename);
            
            await fs.mkdir(path.dirname(filepath), { recursive: true });
            await fs.writeFile(filepath, buffer);
            
            updateData.filePath = `/uploads/${filename}`;
            updateData.fileName = fileName || file.name;
          } catch (fileError) {
            console.error("File handling error:", fileError);
            return NextResponse.json(
              { error: "File upload failed" },
              { status: 500 }
            );
          }
        }
      }

      // Update the document
      const updatedDocument = await ScanUpload.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );

      if (!updatedDocument) {
        return NextResponse.json(
          { error: "Document not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        message: "Document updated successfully",
        document: updatedDocument
      });
      
    } else {
      return NextResponse.json(
        { error: "Unsupported content type" },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error("Error in PUT route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ error: "Document ID is required" }, { status: 400 });
    }

    await connectToDB();
    
    // Find and delete the document
    const deletedDocument = await ScanUpload.findByIdAndDelete(id);
    
    if (!deletedDocument) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }



    return NextResponse.json({ 
      message: "Document deleted successfully",
      deletedId: id 
    }, { status: 200 });

  } catch (error) {
    console.error('Error in DELETE route:', error);
    return NextResponse.json({ 
      error: "Failed to delete document", 
      details: error.message 
    }, { status: 500 });
  }
}