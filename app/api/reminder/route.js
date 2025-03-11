import ScanUpload from '@models/scanUpload';
import { NextResponse } from 'next/server';
import { connectToDB } from '@utils/database';

export async function GET(req, res) {
  if (req.method !== 'GET') {
    return NextResponse.json({ message: 'Only GET requests allowed' }, { status: 405 });
  }

  try {
    // Connect to MongoDB  
    await connectToDB();

    // Calculate the date 3 days ago
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000); // Change to 30 if you want 30 days

    // Find mails that are open and older than 3 days
    const overdueMails = await ScanUpload.find({
      status: 'open',
      createdAt: { $lt: threeDaysAgo }, 
    }).exec();

    console.log('Overdue Mails:', overdueMails); // Debugging line

    // Check if overdueMails is empty or undefined
    if (!overdueMails || overdueMails.length === 0) {
      return NextResponse.json({ message: 'No overdue mails found' }, { status: 200 });
    }

    return NextResponse.json({ overdueMails }, { status: 200 });

  } catch (error) {
    console.error('Error fetching overdue mails:', error); // Debugging line
    return NextResponse.json({ message: 'Failed to fetch overdue mails', error: error.message }, { status: 500 });
  }
}