import { NextResponse } from 'next/server'
import { connectToDB } from "@/utils/database"
import ScanUpload from "@/models/scanUpload"

export async function POST(request) {
  try {
    await connectToDB()

    const formData = await request.formData()
   // const file = formData.get('file')
    const diaryNo = formData.get('diaryNo')
    const date = formData.get('date')
    const department = formData.get('department')
    const category = formData.get('category')
    const subject = formData.get('subject')
    const status = formData.get('status')
    const from = formData.get('from')
    const disposal = formData.get('disposal')

    // Validate required fields
    if ( !diaryNo || !date || !department || !category || !subject || !status || !from || !disposal) {
      console.error("Missing required fields:", {diaryNo, date, department, category, subject, status, from, disposal })
      return NextResponse.json({ error: "All fields are required." }, { status: 400 })
    }

    // Convert file to buffer
    //const fileBuffer = Buffer.from(await file.arrayBuffer())

    // Save the new scan data with file buffer
    const newScan = new ScanUpload({
      diaryNo,
      date,
      department,
      category,
      subject,
      status,
      from,
      disposal,
    //   file: {
    //     data: fileBuffer,
    //     contentType: file.type,
    //     name: file.name
    //   }
    })

    await newScan.save()
    console.log("Scan data saved successfully:", newScan)

    return NextResponse.json({ message: "Scan data saved successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error in API route:", error)
    return NextResponse.json({ error: "Failed to save scan data.", details: error.message }, { status: 500 })
  }
}
