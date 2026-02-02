const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const username = "SuperAdmin@DOB";
  const password = "DOB@2026";
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { username },
    update: {
      displayName: "Super Admin",
      passwordHash,
      role: "SUPER_ADMIN",
      profileImageId: 1,
    },
    create: {
      username,
      displayName: "Super Admin",
      passwordHash,
      role: "SUPER_ADMIN",
      profileImageId: 1,
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
