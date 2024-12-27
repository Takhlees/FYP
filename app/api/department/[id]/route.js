import Department from "@models/department";
import { connectToDB } from "@utils/database";

// GET request handler
export async function GET(req, { params }) {
  const { id } = await params; // Extract the ID from the route parameters
  await connectToDB(); // Ensure your DB connection is established before querying
  
  try {
    // Fetch the department using the provided id
    const department = await Department.findById(id);

    if (!department) {
      return new Response(
        JSON.stringify({ error: "Department not found" }),
        { status: 404 }
      );
    }
    // Return both the department details and its categories
    return new Response(
      JSON.stringify({
        department: department.name,
        type: department.type,
        categories: department.categories, // Return the categories
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

// PATCH request handler for adding a category to a department
export async function PUT(req, { params }) {
    const { id } = await params; // Extract the department ID from the route parameters
    const body = await req.json(); // Parse the request body
  
    await connectToDB();
  
    try {
      let updatedDepartment;
  
      if (body.name && body.type) {
        // Update department name
        updatedDepartment = await Department.findByIdAndUpdate(
          id,
          { name: body.name ,
           type: body.type},
          { new: true } // Return the updated department
        );
      } else if (body.category) {
        // Add category to the department
        updatedDepartment = await Department.findByIdAndUpdate(
          id,
          { $push: { categories: body.category } }, // Use $push to add the new category
          { new: true } // Return the updated department
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
  

// DELETE request handler
export async function DELETE(req, { params }) {
  const { id } = await params; // Extract the ID from the route parameters
  await connectToDB();

  try {
    const deletedDepartment = await Department.findByIdAndDelete(id);

    if (!deletedDepartment) {
      return new Response(JSON.stringify({ error: "Department not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ message: "Department deleted successfully" }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to delete department" }), {
      status: 500,
    });
  }
}
