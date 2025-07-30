import Department from "@models/department";
import ScanUpload from "@models/scanUpload";
import { connectToDB } from "@utils/database";

export async function PUT(req) {
  await connectToDB();

  try {
    const { searchParams } = new URL(req.url);
    const departmentId = searchParams.get("departmentId");
    const oldCategory = searchParams.get("oldCategory");
    const newCategory = searchParams.get("newCategory");

    if (!departmentId || !oldCategory || !newCategory) {
      return new Response(
        JSON.stringify({ error: "Department ID, old category, and new category are required" }),
        { status: 400 }
      );
    }

    // Check if the new category name already exists
    const department = await Department.findById(departmentId);
    if (!department) {
      return new Response(
        JSON.stringify({ error: "Department not found" }),
        { status: 404 }
      );
    }

    if (department.categories.includes(newCategory) && oldCategory !== newCategory) {
      return new Response(
        JSON.stringify({ error: "Category name already exists" }),
        { status: 400 }
      );
    }

    // Update the category name in the department
    const updatedDepartment = await Department.findByIdAndUpdate(
      departmentId,
      { 
        $set: { 
          categories: department.categories.map(cat => 
            cat === oldCategory ? newCategory : cat
          ) 
        } 
      },
      { new: true }
    );

    // Update all documents that reference the old category name
    const updateResult = await ScanUpload.updateMany(
      { 
        department: departmentId,
        category: oldCategory 
      },
      { 
        $set: { category: newCategory } 
      }
    );

    return new Response(
      JSON.stringify({
        message: "Category updated successfully",
        categories: updatedDepartment.categories,
        documentsUpdated: updateResult.modifiedCount
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating category:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update category" }),
      { status: 500 }
    );
  }
}

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
