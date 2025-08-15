import { PDFDocument } from 'pdf-lib';
import ScanUpload from "@models/scanUpload";
import { connectToDB } from "@utils/database";
import { NextResponse } from 'next/server';

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


    let fileBuffer;
    let fileDataForStorage;
    try {
      const arrayBuffer = await file.arrayBuffer();
      fileBuffer = Buffer.from(arrayBuffer);
      fileDataForStorage = fileBuffer.toString('base64');

    } catch (error) {
      console.error('Error converting file:', error);
      return NextResponse.json({ error: 'Failed to process file.' }, { status: 400 });
    }

    // Validate PDF
    try {
      const pdfDoc = await PDFDocument.load(fileBuffer);

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