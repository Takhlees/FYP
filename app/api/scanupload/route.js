// import { PDFDocument } from 'pdf-lib';
// import ScanUpload from "@models/scanUpload";
// import { connectToDB } from "@utils/database";
// import { NextResponse } from 'next/server'; 
// import tesseract from 'tesseract.js';


// export async function POST(request) {
//   try {
//     await connectToDB();

//     const formData = await request.formData();
//     const type = formData.get('type');
//     const file = formData.get('file');
//     const diaryNo = formData.get('diaryNo');
//     const fileName = formData.get('fileName');
//     const date = formData.get('date');
//     const department = formData.get('department');
//     const category = formData.get('category');
//     let subject = formData.get('subject'); 
//     const status = formData.get('status');
//     const from = formData.get('from');
//     const disposal = formData.get('disposal');

//     // Validate required fields
//     if (!file || !fileName || !type || !diaryNo || !date || !department  || !subject || !status || !from || !disposal) {
//       console.error('Missing required fields:', {
//         type,
//         diaryNo,
//         date,
//         fileName,
//         department,
//         subject,
//         status,
//         from,
//         disposal,
//       });
//       return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
//     }

//     // Validate file type
//     if (file.type !== 'application/pdf') {
//       return NextResponse.json({ error: 'Only PDF files are allowed.' }, { status: 400 });
//     }

//     // Convert file to buffer
//     const fileBuffer = Buffer.from(await file.arrayBuffer());

//     // Validate the PDF
//     try {
//       const pdfDoc = await PDFDocument.load(fileBuffer);
//       // Optional: Process or manipulate the PDF as needed
//     } catch (error) {
//       console.error('Error processing PDF:', error);
//       return NextResponse.json({ error: 'Invalid PDF file.' }, { status: 400 });
//     }

//     // Extract text from the PDF
//     let extractedText;
//     try {
//       extractedText = await extractTextFromPdf(fileBuffer);
//     } catch (error) {
//       console.error('Error extracting text from PDF:', error);
//       extractedText = ''; // Fallback to an empty string if extraction fails
//     }

//     // Update the subject from extracted text if available
//     if (extractedText) {
//       const subjectMatch = extractedText.match(/(?:subject|subj)[:\-]?\s*(.+)/i);
//       if (subjectMatch && subjectMatch[1]) {
//         subject = subjectMatch[1].trim();
//       }
//     }

//     // Save data to the database
//     const newScan = new ScanUpload({
//       type,
//       diaryNo,
//       date,
//       department,
//       fileName,
//       category,
//       subject,
//       status,
//       from,
//       disposal,
//       file: {
//         data: fileBuffer,
//         contentType: file.type,
//         name: file.name,
//       },
//     });

//     await newScan.save();
//     console.log('Scan data saved successfully:', newScan);

//     return NextResponse.json({ message: 'Scan data saved successfully' }, { status: 200 });
//   } catch (error) {
//     console.error('Error in API route:', error);
//     return NextResponse.json({ error: 'Failed to save scan data.', details: error.message }, { status: 500 });
//   }
// }

// async function extractTextFromPdf(fileBuffer) {
//   // Placeholder for text extraction using Tesseract.js
//   // Replace this with logic using pdfjs-dist to render images if needed
//   const pdfDoc = await PDFDocument.load(fileBuffer);
//   const pages = pdfDoc.getPages();

//   const pageTextPromises = pages.map(async (page, index) => {
//     // Render the page to extract text - use pdfjs-dist here if required
//     const text = await performOcr(page.getTextContent());
//     console.log(`Page ${index + 1} text:`, text);
//     return text;
//   });

//   const pageTexts = await Promise.all(pageTextPromises);
//   return pageTexts.join(' '); // Join all the extracted texts from pages
// }

// async function performOcr(imageBuffer) {
//   try {
//     const { data: { text } } = await tesseract.recognize(imageBuffer, 'eng', {
//       logger: (m) => console.log(m), // Optional logging
//     });
//     return text;
//   } catch (error) {
//     console.error('Error during OCR:', error);
//     throw new Error('OCR failed.');
//   }
// }

// export async function GET(req) {
//   try {
//     // Extract query parameters from the request URL
//     const { searchParams } = new URL(req.url); // req.url contains the full URL
//     const department = searchParams.get('department');
//     const category = searchParams.get('category') || "All"; // Default category to "all" if not provided

//     // Check if department is provided
//     if (!department) {
//       return NextResponse.json({ message: "Department is required" }, { status: 400 });
//     }

//     // Connect to the database
//     await connectToDB();

//     // Build the query for fetching files
//     let query = { department };

//     // Only add category to the query if it's not "all"
//     if (category && category !== "All") {
//       query.category = category; // Filter by category if not "all"
//     }

//     const documents = await ScanUpload.find(query); // Fetch documents matching the query

//     // Return the documents if found
//     return NextResponse.json(documents, { status: 200 });
//   } catch (error) {
//     // Log the error and return a response with an error message
//     console.error("Error fetching documents:", error);
//     return NextResponse.json(
//       { message: "Internal Server Error", error: error.message },
//       { status: 500 }
//     );
//   }
// }

import { PDFDocument } from 'pdf-lib';
import ScanUpload from "@models/scanUpload";
import { connectToDB } from "@utils/database";
import { NextResponse } from 'next/server';

// POST function for creating new documents
export async function POST(request) {
  try {
    await connectToDB();

    const formData = await request.formData();
    const type = formData.get('type');
    const file = formData.get('file');
    const diaryNo = formData.get('diaryNo');
    const fileName = formData.get('fileName');
    const date = formData.get('date');
    const department = formData.get('department');
    const category = formData.get('category');
    let subject = formData.get('subject'); 
    const status = formData.get('status');
    const from = formData.get('from');
    const disposal = formData.get('disposal');
    const extractedText = formData.get('extractedText');

    console.log('POST request received with data:', {
      type, diaryNo, fileName, date, department, subject, status, from, disposal,
      fileSize: file?.size,
      hasExtractedText: !!extractedText
    });

    // Validate required fields
    if (!file || !fileName || !type || !diaryNo || !date || !department || !subject || !status || !from || !disposal) {
      console.error('Missing required fields:', {
        type: !!type, diaryNo: !!diaryNo, date: !!date, fileName: !!fileName,
        department: !!department, subject: !!subject, status: !!status,
        from: !!from, disposal: !!disposal, file: !!file
      });
      return NextResponse.json({ error: 'All required fields must be provided.' }, { status: 400 });
    }

    // Validate enums
    if (!['uni', 'admin'].includes(type)) {
      return NextResponse.json({ error: 'Type must be either "uni" or "admin".' }, { status: 400 });
    }

    if (!['open', 'closed'].includes(status)) {
      return NextResponse.json({ error: 'Status must be either "open" or "closed".' }, { status: 400 });
    }

    // Validate file
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are allowed.' }, { status: 400 });
    }

    if (file.size === 0) {
      return NextResponse.json({ error: 'File is empty.' }, { status: 400 });
    }
    
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size too large. Maximum 50MB allowed.' }, { status: 400 });
    }

    console.log('File validation passed, processing...');

    // Convert file to base64 for storage
    let fileBuffer;
    let fileDataForStorage;
    try {
      const arrayBuffer = await file.arrayBuffer();
      fileBuffer = Buffer.from(arrayBuffer);
      fileDataForStorage = fileBuffer.toString('base64');
      console.log('File converted to base64, size:', fileBuffer.length);
    } catch (error) {
      console.error('Error converting file:', error);
      return NextResponse.json({ error: 'Failed to process file.' }, { status: 400 });
    }

    // Validate PDF
    try {
      const pdfDoc = await PDFDocument.load(fileBuffer);
      console.log('PDF validated successfully, pages:', pdfDoc.getPageCount());
    } catch (error) {
      console.error('Error validating PDF:', error);
      return NextResponse.json({ error: 'Invalid PDF file.' }, { status: 400 });
    }

    // Improve subject from OCR if available
    let finalSubject = subject;
    if (extractedText && extractedText.trim()) {
      const extractedSubject = extractSubjectFromText(extractedText);
      if (extractedSubject && extractedSubject.length > finalSubject.length) {
        finalSubject = extractedSubject;
        console.log('Subject improved from OCR:', extractedSubject);
      }
    }

    // Save to database
    const newScan = new ScanUpload({
      type,
      diaryNo,
      date: new Date(date),
      department,
      fileName,
      category: category || '',
      subject: finalSubject,
      status,
      from,
      disposal,
      file: {
        data: fileDataForStorage,
        contentType: file.type,
        name: fileName
      }
    });

    const savedDocument = await newScan.save();
    console.log('Document saved successfully with ID:', savedDocument._id);

    return NextResponse.json({ 
      message: 'Document saved successfully',
      documentId: savedDocument._id,
      finalSubject: finalSubject,
      subjectImproved: finalSubject !== subject
    }, { status: 200 });

  } catch (error) {
    console.error('Error in POST route:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validationErrors 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to save document.', 
      details: error.message 
    }, { status: 500 });
  }
}


export async function GET(req) {
  try {
    console.log('GET request received');
    
    const { searchParams } = new URL(req.url);
    const department = searchParams.get('department');
    const category = searchParams.get('category') || "All";
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;

    await connectToDB();

    let query = {
      $or: [
        { isDeleted: { $exists: false } }, 
        { isDeleted: false }               
      ]
    };

    // Add existing filters
    if (department) query.department = department;
    if (type && ['uni', 'admin'].includes(type)) query.type = type;
    if (status && ['open', 'closed'].includes(status)) query.status = status;
    if (category && category !== "All") query.category = category;

    if (search) {
      query = {
        $and: [
          query, // Existing query with isDeleted filter
          {
            $or: [
              { subject: { $regex: search, $options: 'i' } },
              { from: { $regex: search, $options: 'i' } },
              { diaryNo: { $regex: search, $options: 'i' } },
              { disposal: { $regex: search, $options: 'i' } }
            ]
          }
        ]
      };
    }

    const skip = (page - 1) * limit;

    const documents = await ScanUpload.find(query)
      .select('-file.data')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalDocuments = await ScanUpload.countDocuments(query);
    const totalPages = Math.ceil(totalDocuments / limit);

    console.log(`GET request completed, found ${documents.length} documents`);

    return NextResponse.json({
      documents,
      pagination: {
        currentPage: page,
        totalPages,
        totalDocuments,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Error in GET route:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}

function extractSubjectFromText(text) {
  try {
    const subjectPatterns = [
      /(?:subject|subj)[:\-\s]*(.+)/i,
      /(?:re|regarding)[:\-\s]*(.+)/i,
      /(?:matter|topic)[:\-\s]*(.+)/i
    ];

    for (const pattern of subjectPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        let extractedSubject = match[1].trim();
        extractedSubject = extractedSubject.split('\n')[0];
        extractedSubject = extractedSubject.replace(/[^\w\s\-.,]/g, '');
        if (extractedSubject.length > 10 && extractedSubject.length < 200) {
          return extractedSubject;
        }
      }
    }

    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    for (const line of lines) {
      if (line.length > 15 && line.length < 150 && 
          !/^\d+/.test(line) && 
          !/date|from|to|dear|sir|madam/i.test(line) && 
          !/^\w+\s*:/.test(line)) {
        return line;
      }
    }

    return null;
  } catch (error) {
    console.error('Error extracting subject from text:', error);
    return null;
  }
}