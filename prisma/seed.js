import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // --------------------------------------------
  // 1️⃣ Create Permissions
  // --------------------------------------------
  const permissions = [
    "VIEW_DASHBOARD",
    "VIEW_MATERIALS",
    "ADD_MATERIAL",
    "UPDATE_MATERIAL",
    "VIEW_USERS",
    "MODIFY_USERS",
  ];

  const permissionRecords = await Promise.all(
    permissions.map((p) =>
      prisma.permission.upsert({
        where: { name: p },
        update: {},
        create: { name: p },
      })
    )
  );

  function getPermId(name) {
    return permissionRecords.find((p) => p.name === name)?.id;
  }

  // --------------------------------------------
  // 2️⃣ Create Roles With Their Permissions
  // --------------------------------------------
  const roles = [
    {
      name: "FOREMAN",
      perms: ["VIEW_DASHBOARD", "VIEW_MATERIALS", "UPDATE_MATERIAL"],
    },
    {
      name: "STORE_KEEPER",
      perms: [
        "VIEW_DASHBOARD",
        "VIEW_MATERIALS",
        "ADD_MATERIAL",
        "UPDATE_MATERIAL",
      ],
    },
    {
      name: "ENGINEER",
      perms: ["VIEW_DASHBOARD", "VIEW_MATERIALS", "UPDATE_MATERIAL"],
    },
    {
      name: "MANAGER",
      perms: permissions, // all permissions
    },
  ];

  const roleRecords = {};

  for (const role of roles) {
    const roleRec = await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: { name: role.name },
    });

    roleRecords[role.name] = roleRec.id;

    // link permissions
    await Promise.all(
      role.perms.map((perm) =>
        prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId: roleRec.id,
              permissionId: getPermId(perm),
            },
          },
          update: {},
          create: {
            roleId: roleRec.id,
            permissionId: getPermId(perm),
          },
        })
      )
    );
  }

  console.log("✅ Roles & Permissions seeded");

  // --------------------------------------------
  // 3️⃣ Create Main Manager User (only if no users)
  // --------------------------------------------
  const userCount = await prisma.user.count();

  if (userCount === 0) {
    const hashedPassword = await bcrypt.hash("admin1234", 10);

    await prisma.user.create({
      data: {
        fileNo: 1,
        name: "Sami Nashawi",
        password: hashedPassword,
        roleId: roleRecords["MANAGER"], // Assign manager role!
      },
    });

    console.log(
      "✅ Main Manager user created with fileNo 1 and password 'admin1234'"
    );
  } else {
    console.log("ℹ️ Users already exist, skipping manager creation.");
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
