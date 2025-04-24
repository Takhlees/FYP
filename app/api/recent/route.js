import { connectToDB } from "../../../utils/database";
import ScanUpload from "../../../models/scanUpload";

export async function GET(req) {
  try {
    await connectToDB();
    
    const recentMails = await ScanUpload.find({ status: 'open' })
      .sort({ createdAt: -1 })
      .limit(3)
      .exec();

    return new Response(JSON.stringify(recentMails), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    console.error("Failed to fetch recent mails:", error);
    return new Response(JSON.stringify({
      message: "Failed to fetch recent mails",
      error: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }
}

// Optionally add other HTTP methods
export async function POST() {
  return new Response(JSON.stringify({ message: "Method not allowed" }), {
    status: 405
  });
}