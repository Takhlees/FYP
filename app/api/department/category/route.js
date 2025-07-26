import Department from "@models/department";
import { connectToDB } from "@utils/database";

export async function DELETE(req) {
  await connectToDB();

  try {
    const { searchParams } = new URL(req.url);
    const departmentId = searchParams.get("departmentId");
    const category = searchParams.get("category");

    if (!departmentId || !category) {
      return new Response(
        JSON.stringify({ error: "Department ID and category are required" }),
        { status: 400 }
      );
    }

    const updatedDepartment = await Department.findByIdAndUpdate(
      departmentId,
      { $pull: { categories: category } },
      { new: true }
    );

    if (!updatedDepartment) {
      return new Response(
        JSON.stringify({ error: "Department not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        message: "Category deleted successfully",
        categories: updatedDepartment.categories,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting category:", error);
    return new Response(
      JSON.stringify({ error: "Failed to delete category" }),
      { status: 500 }
    );
  }
}
