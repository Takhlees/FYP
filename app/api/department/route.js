import Department from "@models/department";
import { connectToDB } from "@utils/database";

// GET all departments
export async function GET() {
  await connectToDB();

  try {
    const departments = await Department.find();
    return new Response(JSON.stringify(departments), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch departments" }), {
      status: 500,
    });
  }
}

// POST new department
export async function POST(req) {
  const body = await req.json(); // Parse the request body
  const { name } = body;

  if (!name) {
    return new Response(JSON.stringify({ error: "Name is required" }), { status: 400 });
  }

  await connectToDB();

  try {
    const newDepartment = new Department({ name });
    await newDepartment.save();

    return new Response(JSON.stringify(newDepartment), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to create department" }), {
      status: 500,
    });
  }
}


// DELETE department
export async function DELETE(req, { params }) {
  const { id } = params; // Get the department id from URL params

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
