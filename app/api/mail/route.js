import ScanUpload from '@models/scanUpload';
import { NextResponse } from 'next/server';
import { connectToDB } from '@utils/database';

export async function GET(req) {
  try {
    await connectToDB();
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

    const overdueMails = await ScanUpload.find({
      status: 'open',
      createdAt: { $lt: threeDaysAgo },
    })
    .select('_id subject status file')
    .lean();

    // Add hasFile flag instead of trying to access URLs
    const formattedMails = overdueMails.map(mail => ({
      ...mail,
      hasFile: !!mail.file?.data,
      fileName: mail.file?.name || 'document.pdf'
    }));

    return NextResponse.json({ overdueMails: formattedMails });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch overdue mails' },
      { status: 500 }
    );
  }
}