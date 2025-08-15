import Department from "@models/department";
import { connectToDB } from "@utils/database";

export async function GET(req, { params }) {
  const { id } = await params; 
  await connectToDB(); 
  
  try {
    const department = await Department.findById(id);

    if (!department) {
      return new Response(
        JSON.stringify({ error: "Department not found" }),
        { status: 404 }
      );
    }
    return new Response(
      JSON.stringify({
        department: department.name,
        type: department.type,
        categories: department.categories, 
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch department" }),
      { status: 500 }
    );
  }
}

// PUT request handler for adding a category to a department or edit department
export async function PUT(req, { params }) {
    const { id } = await params; 
    const body = await req.json(); 
  
    await connectToDB();
  
    try {
      let updatedDepartment;
  
      if (body.name && body.type) {
        updatedDepartment = await Department.findByIdAndUpdate(
          id,
          { name: body.name ,
           type: body.type},
          { new: true } 
        );
      } else if (body.category) {
        updatedDepartment = await Department.findByIdAndUpdate(
          id,
          { $push: { categories: body.category } }, 
          { new: true }
        );
      }
  
      if (!updatedDepartment) {
        return new Response(JSON.stringify({ error: "Department not found" }), {
          status: 404,
        });
      }
  
      return new Response(JSON.stringify(updatedDepartment), { status: 200 });
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Failed to update department" }),
        { status: 500 }
      );
    }
  }
  

export async function DELETE(req, { params }) {
  const { id } = await params; 
  await connectToDB();

  try {
    // Only allow category deletion, not department deletion
    // First check if we have a category to delete in the request body
    const body = await req.json();
    
    if (!body.category) {
      return new Response(
        JSON.stringify({ error: "Category deletion requires a category name" }), 
        { status: 400 }
      );
    }

    // Update the department by removing the specified category
    const updatedDepartment = await Department.findByIdAndUpdate(
      id,
      { $pull: { categories: body.category } },
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
        categories: updatedDepartment.categories 
      }), 
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to delete category" }), 
      { status: 500 }
    );
  }
}
