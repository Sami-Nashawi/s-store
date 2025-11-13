import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getUser } from "@/lib/getUser";
import cloudinary from "@/lib/cloudinary"; // ✅ new import for image uploads

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

// ✅ GET: Fetch materials with filters/pagination
export async function GET(req: Request) {
  const user: any = await getUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized Action" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "0");
  const pageSize = parseInt(searchParams.get("pageSize") || "20");
  const sortField = searchParams.get("sortField") || "id";
  const sortOrder = searchParams.get("sortOrder") || "asc";
  const filters = searchParams.get("filters")
    ? JSON.parse(searchParams.get("filters")!)
    : {};

  const where: any = {};

  for (const [key, value] of Object.entries(filters)) {
    if (!value) continue;

    const numericFields = ["quantity", "unitPrice", "id"];
    if (numericFields.includes(key)) {
      const numberValue = parseFloat(value as string);
      if (!isNaN(numberValue)) {
        where[key] = { equals: numberValue };
      }
    } else {
      where[key] = { contains: value, mode: "insensitive" };
    }
  }

  try {
    const [rows, total] = await Promise.all([
      prisma.material.findMany({
        where,
        skip: page * pageSize,
        take: pageSize,
        orderBy: { [sortField]: sortOrder },
      }),
      prisma.material.count({ where }),
    ]);

    return NextResponse.json({ rows, total });
  } catch (error) {
    console.error("❌ Prisma Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ✅ POST: Add new material (with optional photo upload to Cloudinary)
export async function POST(req: Request) {
  const user: any = await getUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized Action" }, { status: 401 });
  }

  console.log("📥 Creating new material...");
  try {
    const formData = await req.formData();
    const description = formData.get("description") as string;
    const quantity = Number(formData.get("quantity"));
    const unit = formData.get("unit") as string;
    const photoFile = formData.get("photo") as File | null;
    console.log("📝 Form Data:", { description, quantity, unit, photoFile });
    if (!description || !quantity || !unit) {
      return NextResponse.json(
        { error: "Please fill all required fields." },
        { status: 400 }
      );
    }

    let photoUrl: string | null = null;

    // ✅ If a photo is provided, upload to Cloudinary
    if (photoFile) {
      const bytes = await photoFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadResult = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "materials",
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(buffer);
      });

      photoUrl = uploadResult.secure_url;
    }

    // ✅ Save to database
    const material = await prisma.material.create({
      data: {
        description,
        quantity,
        unit,
        photoUrl,
        events: {
          create: {
            type: "RECEIVE",
            quantity,
            userId: parseInt(user.id),
            note: "Initial stock",
          },
        },
      },
      include: { events: true },
    });

    return NextResponse.json(
      { ...material, message: "Material created successfully" },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("❌ Error creating material:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to create material" },
      { status: 500 }
    );
  }
}
