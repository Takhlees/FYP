import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test basic functionality
    const testData = {
      message: 'Deployment test successful',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      hasDatabase: !!process.env.MONGODB_URI,
      hasSharp: typeof require !== 'undefined' && require('sharp'),
      hasTesseract: typeof require !== 'undefined' && require('tesseract.js'),
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
