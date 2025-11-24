import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/getUser";
import cloudinary from "@/lib/cloudinary";
import { ROLE_PERMISSIONS } from "@/shared/roles-permissions";

// ========================================
// 🔹 GET — Fetch Materials (Requires "materials" permission)
// ========================================
export async function GET(req: Request) {
  const user: any = await getUser(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized Action" }, { status: 401 });
  }

  // 🔐 Permission check
  const canAccess = ROLE_PERMISSIONS[user.role.name]?.includes("materials");
  if (!canAccess) {
    return NextResponse.json(
      { error: "You do not have permission to view materials" },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "0", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "20", 10);
  const sortField = searchParams.get("sortField") || "id";
  const sortOrder = searchParams.get("sortOrder") || "asc";

  const filters = searchParams.get("filters")
    ? JSON.parse(searchParams.get("filters")!)
    : {};

  const where: any = {};

  // filters builder
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

// ========================================
// 🔹 POST — Add Material (Requires "addMaterial" permission)
// ========================================
export async function POST(req: Request) {
  const user: any = await getUser(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized Action" }, { status: 401 });
  }

  // 🔐 Permission check
  const canCreate = ROLE_PERMISSIONS[user.role.name]?.includes("addMaterial");
  if (!canCreate) {
    return NextResponse.json(
      { error: "You do not have permission to add materials" },
      { status: 403 }
    );
  }

  try {
    const formData = await req.formData();

    const description = formData.get("description") as string;
    const quantity = Number(formData.get("quantity"));
    const unit = formData.get("unit") as string;
    const photoFile = formData.get("photo") as File | null;
    const notes = formData.get("notes") as string | null;

    if (!description || !quantity || !unit) {
      return NextResponse.json(
        { error: "Please fill all required fields." },
        { status: 400 }
      );
    }

    let photoUrl: string | null = null;

    // 🔹 Upload photo to Cloudinary (optional)
    if (photoFile) {
      const bytes = await photoFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadResult = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "materials", resource_type: "image" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        stream.end(buffer);
      });

      photoUrl = uploadResult.secure_url;
    }

    // 🔹 Save Material
    const material = await prisma.material.create({
      data: {
        description,
        quantity,
        unit,
        photoUrl,
        notes,
        events: {
          create: {
            type: "RECEIVE",
            quantity,
            userId: Number(user.id),
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
