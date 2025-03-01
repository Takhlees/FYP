import ScanUpload from '@models/scanUpload';
import { connectToDB } from '@utils/database';


export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Only GET requests allowed' });
  }

  // Connect to MongoDB  
  connectToDB();

  // Calculate the date 3 days ago
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000); 

  try {
    // Find mails that are open and older than 3 days
    const overdueMails = await ScanUpload
      .find({
        status: 'open', 
        createdAt: { $lte: threeDaysAgo },
      })
      .toArray();

    res.status(200).json({ overdueMails });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch overdue mails', error });
  } finally {
    await client.close();
  }
}