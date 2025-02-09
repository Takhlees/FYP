import { NextResponse } from "@node_modules/next/server";
import { connectToDB } from "@utils/database";

export async function GET(req, res) {
  if (req.method !== "GET") {
    return NextResponse.json({ msg: "method not supported" }, { status: 404 });
  }

  try {
    const { query } = req.query;
    console.log("Query", query);

    const client = await connectToDB();

    const documents = await client
      .db("fyp")
      .collection("scanUpload")
      .find(query)
      .toArray();

      res.json(documents);
      
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json({ msg: "error fetching documents" },{ status: 500 });
  }
}
