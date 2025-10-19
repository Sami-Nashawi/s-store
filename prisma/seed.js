import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Check if any user exists
  const userCount = await prisma.user.count();
  if (userCount === 0) {
    // Create the first main Manager user
    const hashedPassword = await bcrypt.hash("admin1234", 10);

    await prisma.user.create({
      data: {
        fileNo: 1,
        name: "Sami Nashawi",
        password: hashedPassword,
        role: "MANAGER",
      },
    });

    console.log(
      "✅ Main Manager user created with fileNo 1 and default password 'admin1234'"
    );
  } else {
    console.log("ℹ️ Users already exist, skipping seeding.");
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
