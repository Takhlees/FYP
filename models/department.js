import { Schema, model, models } from "mongoose";

const DepartmentSchema = new Schema({
  name: { type: String, required: true },
  categories: [{ type: String }], // Array of category names
});

export default models.Department || model("Department", DepartmentSchema);
