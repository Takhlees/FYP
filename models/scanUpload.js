import mongoose from 'mongoose'

const ScanUploadSchema = new mongoose.Schema({
  diaryNo: {
    type: String,
    required: [true, 'Diary number is required'],
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: ['open', 'in-progress', 'closed'],
  },
  from: {
    type: String,
    required: [true, 'From field is required'],
  },
  disposal: {
    type: String,
    required: [true, 'Disposal is required'],
  },
//   file: {
//     data: Buffer,
//     contentType: String,
//     name: String
//   }
}, { timestamps: true })

const ScanUpload = mongoose.models.ScanUpload || mongoose.model('ScanUpload', ScanUploadSchema)

export default ScanUpload

