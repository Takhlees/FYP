import { PDFDocument } from 'pdf-lib';
import ScanUpload from "@models/scanUpload";
import { connectToDB } from "@utils/database";
import { NextResponse } from 'next/server'; 
import tesseract from 'tesseract.js';


export async function POST(request) {
  try {
    await connectToDB();

    const formData = await request.formData();
    const file = formData.get('file');
    const diaryNo = formData.get('diaryNo');
    const date = formData.get('date');
    const department = formData.get('department');
    const category = formData.get('category');
    let subject = formData.get('subject'); // Use `let` since this might be updated
    const status = formData.get('status');
    const from = formData.get('from');
    const disposal = formData.get('disposal');

    // Validate required fields
    if (!file || !diaryNo || !date || !department || !category || !subject || !status || !from || !disposal) {
      console.error('Missing required fields:', {
        diaryNo,
        date,
        department,
        category,
        subject,
        status,
        from,
        disposal,
      });
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are allowed.' }, { status: 400 });
    }

    // Convert file to buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Validate the PDF
    try {
      const pdfDoc = await PDFDocument.load(fileBuffer);
      // Optional: Process or manipulate the PDF as needed
    } catch (error) {
      console.error('Error processing PDF:', error);
      return NextResponse.json({ error: 'Invalid PDF file.' }, { status: 400 });
    }

    // Extract text from the PDF
    let extractedText;
    try {
      extractedText = await extractTextFromPdf(fileBuffer);
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      extractedText = ''; // Fallback to an empty string if extraction fails
    }

    // Update the subject from extracted text if available
    if (extractedText) {
      const subjectMatch = extractedText.match(/(?:subject|subj)[:\-]?\s*(.+)/i);
      if (subjectMatch && subjectMatch[1]) {
        subject = subjectMatch[1].trim();
      }
    }

    // Save data to the database
    const newScan = new ScanUpload({
      diaryNo,
      date,
      department,
      category,
      subject,
      status,
      from,
      disposal,
      file: {
        data: fileBuffer,
        contentType: file.type,
        name: file.name,
      },
    });

    await newScan.save();
    console.log('Scan data saved successfully:', newScan);

    return NextResponse.json({ message: 'Scan data saved successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: 'Failed to save scan data.', details: error.message }, { status: 500 });
  }
}

async function extractTextFromPdf(fileBuffer) {
  // Placeholder for text extraction using Tesseract.js
  // Replace this with logic using pdfjs-dist to render images if needed
  const pdfDoc = await PDFDocument.load(fileBuffer);
  const pages = pdfDoc.getPages();

  const pageTextPromises = pages.map(async (page, index) => {
    // Render the page to extract text - use pdfjs-dist here if required
    const text = await performOcr(page.getTextContent());
    console.log(`Page ${index + 1} text:`, text);
    return text;
  });

  const pageTexts = await Promise.all(pageTextPromises);
  return pageTexts.join(' '); // Join all the extracted texts from pages
}

async function performOcr(imageBuffer) {
  try {
    const { data: { text } } = await tesseract.recognize(imageBuffer, 'eng', {
      logger: (m) => console.log(m), // Optional logging
    });
    return text;
  } catch (error) {
    console.error('Error during OCR:', error);
    throw new Error('OCR failed.');
  }
}

export async function GET(req) {
  try {
    // Extract query parameters from the request URL
    const { searchParams } = new URL(req.url); // req.url contains the full URL
    const department = searchParams.get('department');
    const category = searchParams.get('category') || "All"; // Default category to "all" if not provided

    // Check if department is provided
    if (!department) {
      return NextResponse.json({ message: "Department is required" }, { status: 400 });
    }

    // Connect to the database
    await connectToDB();

    // Build the query for fetching files
    let query = { department };

    // Only add category to the query if it's not "all"
    if (category && category !== "All") {
      query.category = category; // Filter by category if not "all"
    }

    const documents = await ScanUpload.find(query); // Fetch documents matching the query

    // Return the documents if found
    return NextResponse.json(documents, { status: 200 });
  } catch (error) {
    // Log the error and return a response with an error message
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
