import { connectToDB } from "@utils/database";
import ScanUpload from "@models/scanUpload";

export async function GET(request, { params }) {
  try {
    await connectToDB();
    const { id } = await params;
    const mail = await ScanUpload.findById(id).select("file subject");

    if (!mail?.file?.data) {
      return new Response("PDF not found in database", {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(mail.file.data, {
      headers: {
        "Content-Type": mail.file.contentType || "application/pdf",
        "Content-Disposition": `inline; filename="${
          mail.file.name || mail.subject || "document"
        }.pdf"`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("File serve error:", error);
    return new Response(JSON.stringify({ error: "Failed to retrieve PDF" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
