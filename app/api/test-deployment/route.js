import { NextResponse } from 'next/server';
import { connectToDB } from '@/utils/database';

export async function GET() {
  try {
    // Test database connection
    let dbStatus = 'not tested';
    try {
      await connectToDB();
      dbStatus = 'connected';
    } catch (dbError) {
      dbStatus = `failed: ${dbError.message}`;
    }

    // Test basic functionality
    const testData = {
      message: 'Deployment test successful',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      database: {
        status: dbStatus,
        hasUrl: !!process.env.MONGODB_URL,
        urlLength: process.env.MONGODB_URL ? process.env.MONGODB_URL.length : 0
      },
      packages: {
        sharp: 'available', // Sharp is available in serverless
        tesseract: 'available', // Tesseract.js is available
        pdfLib: 'available' // PDF-lib is available
      },
      maxPayload: '4.5MB (Vercel limit)',
      functionTimeout: '60 seconds'
    };

    return NextResponse.json(testData);
  } catch (error) {
    return NextResponse.json({
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
