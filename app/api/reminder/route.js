import ScanUpload from '@models/scanUpload';
import { NextResponse } from 'next/server' ;
import { connectToDB } from '@utils/database';

export async function GET(req, res) {
  if (req.method !== 'GET') {
    return NextResponse.json({ message: 'Only GET requests allowed' }, { status: 405 });
  }

  try { 
    await connectToDB();

    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000); 

    const overdueMails = await ScanUpload.find({
      status: { $in: ["open", "in-progress"] },
      createdAt: { $lt: threeDaysAgo }, 
      category: { $exists: true, $ne: null }
    }).exec();

    
    if (!overdueMails || overdueMails.length === 0) {
      return NextResponse.json({ message: 'No overdue mails found' }, { status: 200 });
    }

    return NextResponse.json({ overdueMails }, { status: 200 });

  } catch (error) {
    console.error('Error fetching overdue mails:', error); // Debugging line
    return NextResponse.json({ message: 'Failed to fetch overdue mails', error: error.message }, { status: 500 });
  }
}