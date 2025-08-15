import Department from "@models/department";
import { connectToDB } from "@utils/database";

export async function GET(req) {
  await connectToDB();
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const query = type ? { type } : {};
  try {
  
    let departments ;
    
    if (type === "all") {
      departments = await Department.find(); 
    }
    else {
      departments = await Department.find(query); 
    }
    return new Response(JSON.stringify(departments), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch departments" }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  const body = await req.json(); 
  const { name , type } = body;

  if (!name || !type) {
    return new Response(JSON.stringify({ error: "Name and type is required" }), { status: 400 });
  }

  await connectToDB();

  try {
    const newDepartment = new Department({ name, type });
    await newDepartment.save();

    return new Response(JSON.stringify(newDepartment), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to create department" }), {
      status: 500,
    });
  }
}


export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response(JSON.stringify({ error: "Department ID is required" }), {
      status: 400,
    });
  }

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
