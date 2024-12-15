import mongoose from "mongoose";

const DepartmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  categories: [{ type: String }], // Array of category names
});

const Department = mongoose.models.Department || mongoose.model('Department', DepartmentSchema)

export default Department

