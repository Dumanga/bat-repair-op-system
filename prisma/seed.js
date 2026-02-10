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
      system: "BOTH",
      storeId: null,
      profileImageId: 1,
      accessDashboard: true,
      accessRepairs: true,
      accessClients: true,
      accessBrands: true,
      accessUsers: true,
      accessSms: true,
      accessSettings: true,
    },
    create: {
      username,
      displayName: "Super Admin",
      passwordHash,
      role: "SUPER_ADMIN",
      system: "BOTH",
      storeId: null,
      profileImageId: 1,
      accessDashboard: true,
      accessRepairs: true,
      accessClients: true,
      accessBrands: true,
      accessUsers: true,
      accessSms: true,
      accessSettings: true,
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
