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
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ error: "Document ID is required for updating" }, { status: 400 });
    }

    await connectToDB();
    
    // Check if document exists
    const existingDocument = await ScanUpload.findById(id);
    if (!existingDocument) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    const formData = await req.formData();
    
    // Extract form data matching your schema
    const type = formData.get("type");
    const department = formData.get("department");
    const category = formData.get("category");
    const fileName = formData.get("fileName");
    let subject = formData.get("subject");
    const date = formData.get("date");
    const diaryNo = formData.get("diaryNo");
    const from = formData.get("from");
    const disposal = formData.get("disposal");
    const status = formData.get("status");
    const extractedText = formData.get("extractedText"); // Get OCR text to improve subject
    const file = formData.get("file");

    // Validate required fields based on your schema
    if (!type || !department || !subject || !date || !diaryNo || !from || !disposal || !status || !fileName) {
      return NextResponse.json({ error: "All required fields must be provided" }, { status: 400 });
    }

    // Validate enum values
    if (!['uni', 'admin'].includes(type)) {
      return NextResponse.json({ error: 'Type must be either "uni" or "admin".' }, { status: 400 });
    }

    if (!['open', 'closed'].includes(status)) {
      return NextResponse.json({ error: 'Status must be either "open" or "closed".' }, { status: 400 });
    }

    // Use extracted text ONLY to improve subject if available
    let finalSubject = subject;
    if (extractedText && extractedText.trim()) {
      const extractedSubject = extractSubjectFromText(extractedText);
      if (extractedSubject && extractedSubject.length > finalSubject.length) {
        finalSubject = extractedSubject;
        console.log('Subject improved from OCR during update:', extractedSubject);
      }
    }

    // Prepare update data matching your schema structure
    const updateData = {
      type,
      department,
      category: category || '', // Optional field
      fileName,
      subject: finalSubject, // Use the refined subject
      date: new Date(date),
      diaryNo,
      from,
      disposal,
      status
      // updatedAt will be handled by timestamps: true
    };

    // Handle file update if new file is provided
    if (file && file.size > 0) {
      // Validate file type
      if (file.type !== 'application/pdf') {
        return NextResponse.json({ error: 'Only PDF files are allowed.' }, { status: 400 });
      }

      try {
        // Validate file size
        if (file.size === 0) {
          return NextResponse.json({ error: 'File is empty.' }, { status: 400 });
        }
        
        if (file.size > 50 * 1024 * 1024) { // 50MB limit
          return NextResponse.json({ error: 'File size too large. Maximum 50MB allowed.' }, { status: 400 });
        }

        // Convert file to base64 for storage
        const arrayBuffer = await file.arrayBuffer();
        const fileBuffer = Buffer.from(arrayBuffer);
        const fileDataForStorage = fileBuffer.toString('base64');
        console.log('File buffer created for update, size:', fileBuffer.length);
        
        // Validate PDF
        const pdfDoc = await PDFDocument.load(fileBuffer);
        console.log('Updated PDF validated successfully, pages:', pdfDoc.getPageCount());

        updateData.file = {
          data: fileDataForStorage, // Store as base64 string
          contentType: file.type,
          name: fileName
        };

      } catch (error) {
        console.error('Error processing updated PDF:', error);
        return NextResponse.json({ error: 'Invalid PDF file or processing error.' }, { status: 400 });
      }
    }

    // Update the document
    const updatedDocument = await ScanUpload.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    );

    if (!updatedDocument) {
      return NextResponse.json({ error: "Failed to update document" }, { status: 500 });
    }

    console.log('Document updated successfully with ID:', updatedDocument._id);

    // Return updated document metadata (matching your schema)
    const responseData = {
      _id: updatedDocument._id,
      type: updatedDocument.type,
      diaryNo: updatedDocument.diaryNo,
      date: updatedDocument.date,
      department: updatedDocument.department,
      fileName: updatedDocument.fileName,
      category: updatedDocument.category,
      subject: updatedDocument.subject, // This is the refined subject
      status: updatedDocument.status,
      from: updatedDocument.from,
      disposal: updatedDocument.disposal,
      createdAt: updatedDocument.createdAt,
      updatedAt: updatedDocument.updatedAt
    };

    return NextResponse.json({ 
      message: "Document updated successfully", 
      document: responseData,
      subjectImproved: finalSubject !== subject
    }, { status: 200 });

  } catch (error) {
    console.error('Error in PUT route:', error);
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validationErrors 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      error: "Failed to update document", 
      details: error.message 
    }, { status: 500 });
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

    console.log('Document deleted successfully with ID:', id);

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