import { PDFDocument } from 'pdf-lib';
//import mammoth from 'mammoth';
//import puppeteer from 'puppeteer';
//import sharp from 'sharp'; 
import ScanUpload from "@models/scanUpload";
import { connectToDB } from "@utils/database";
import { NextResponse } from 'next/server'; 
import tesseract from 'tesseract.js';

export async function POST(request) {
  try {
    await connectToDB()

    const formData = await request.formData()
    const file = formData.get('file')
    const diaryNo = formData.get('diaryNo')
    const date = formData.get('date')
    const department = formData.get('department')
    const category = formData.get('category')
    const subject = formData.get('subject')
    const status = formData.get('status')
    const from = formData.get('from')
    const disposal = formData.get('disposal')

    // Validate required fields
    if ( !file || !diaryNo || !date || !department || !category || !subject || !status || !from || !disposal) {
      console.error("Missing required fields:", {diaryNo, date, department, category, subject, status, from, disposal })
      return NextResponse.json({ error: "All fields are required." }, { status: 400 })
    }


     // Validate file type
     if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: "Only PDF files are allowed." }, { status: 400 })
    }

    // Convert file to buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer())

    // Use pdf-lib to validate and potentially manipulate the PDF
    try {
      const pdfDoc = await PDFDocument.load(fileBuffer)
      // Here you can manipulate the PDF if needed
      // For example, you could add a watermark, merge pages, etc.
      
      // If you've made changes, get the modified PDF as a buffer
      
      const modifiedPdfBytes = await pdfDoc.save()
      const modifiedBuffer = Buffer.from(modifiedPdfBytes)
      
      // For now, we'll just use the original buffer
    } catch (error) {
      console.error("Error processing PDF:", error)
      return NextResponse.json({ error: "Invalid PDF file." }, { status: 400 })
    }
    let ocrSubject = "";
    if (extractedText) {
      const subjectMatch = extractedText.match(/(?:subject|subj)[:\-]?\s*(.+)/i);
      if (subjectMatch && subjectMatch[1]) {
        ocrSubject = subjectMatch[1].trim();
      }
    }
    const newScan = new ScanUpload({
      diaryNo,
      date,
      department,
      category,
      subject: ocrSubject || subject,
      status,
      from,
      disposal,
      file: {
        data: fileBuffer,
        contentType: file.type,
        name: file.name
      }
    })

    await newScan.save()
    console.log("Scan data saved successfully:", newScan)

    return NextResponse.json({ message: "Scan data saved successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error in API route:", error)
    return NextResponse.json({ error: "Failed to save scan data.", details: error.message }, { status: 500 })
  }
} 
async function extractTextFromPdf(pdfBuffer) {
  const pdfDoc = await PDFDocument.load(pdfBuffer);
  const pages = pdfDoc.getPages();
  
  const pageTextPromises = pages.map(async (page) => {
    const image = await page.render();
    const imageBuffer = await image.toBuffer();
    return await performOcr(imageBuffer);
  });

  const pageTexts = await Promise.all(pageTextPromises);
  return pageTexts.join(" "); // Join all the extracted texts from pages
}

// Function to perform OCR using Tesseract.js
async function performOcr(imageBuffer) {
  return new Promise((resolve, reject) => {
    tesseract.recognize(
      imageBuffer,
      'eng',
      {
        logger: (m) => console.log(m), // Optional logging
      }
    ).then(({ data: { text } }) => {
      resolve(text);
    }).catch((error) => {
      reject(error);
    });
  });
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
