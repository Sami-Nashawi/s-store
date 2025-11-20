// prisma/seed.js

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding started...");

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

  const permissionRecords = [];

  for (const name of permissions) {
    const p = await prisma.permission.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    permissionRecords.push(p);
  }

  function getPermId(name) {
    return permissionRecords.find((p) => p.name === name)?.id;
  }

  // --------------------------------------------
  // 2️⃣ Create Roles With Their Permissions
  // (IDs will be 1 = MANAGER, 2 = ENGINEER, 3 = STORE_KEEPER, 4 = FOREMAN)
  // --------------------------------------------
  const roles = [
    {
      id: 4, // force ID for FOREMAN
      name: "FOREMAN",
      perms: ["VIEW_DASHBOARD", "VIEW_MATERIALS", "UPDATE_MATERIAL"],
    },
    {
      id: 3, // STORE_KEEPER
      name: "STORE_KEEPER",
      perms: [
        "VIEW_DASHBOARD",
        "VIEW_MATERIALS",
        "ADD_MATERIAL",
        "UPDATE_MATERIAL",
      ],
    },
    {
      id: 2, // ENGINEER
      name: "ENGINEER",
      perms: ["VIEW_DASHBOARD", "VIEW_MATERIALS", "UPDATE_MATERIAL"],
    },
    {
      id: 1, // MANAGER
      name: "MANAGER",
      perms: permissions, // all permissions
    },
  ];

  const roleRecords = {};

  for (const role of roles) {
    const roleRec = await prisma.role.upsert({
      where: { id: role.id },
      update: {},
      create: { id: role.id, name: role.name },
    });

    roleRecords[role.name] = roleRec.id;

    // link permissions
    for (const perm of role.perms) {
      await prisma.rolePermission.upsert({
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
      });
    }
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
        roleId: roleRecords["MANAGER"], // ID = 1
      },
    });

    console.log("✅ Main Manager user created (fileNo: 1, pass: admin1234)");
  } else {
    console.log("ℹ️ Users already exist → skipping manager creation");
  }

  console.log("🌱 Seeding complete!");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error("❌ Seed error:", e);
    prisma.$disconnect();
    process.exit(1);
  });
