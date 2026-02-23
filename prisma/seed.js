async function main() {
  const [{ PrismaClient }, bcryptModule] = await Promise.all([
    import("@prisma/client"),
    import("bcryptjs"),
  ]);
  const bcrypt = bcryptModule.default ?? bcryptModule;
  const prisma = new PrismaClient();

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
      accessStores: true,
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
      accessStores: true,
      accessSms: true,
      accessSettings: true,
    },
  });

  const clients = [
    { name: "Nimal Perera", mobile: "94718808854", tier: "GOLD" },
    { name: "Axar Patel", mobile: "94711234567", tier: "SILVER" },
    { name: "Ruwan Silva", mobile: "94770111222", tier: "BRONZE" },
    { name: "Dinesh Fernando", mobile: "94772223344", tier: "SILVER" },
    { name: "Kumari Jayasinghe", mobile: "94775556677", tier: "BRONZE" },
    { name: "Sanjaya Rathnayake", mobile: "94776677889", tier: "GOLD" },
    { name: "Thilini Perera", mobile: "94771112233", tier: "BRONZE" },
    { name: "Chamithra de Silva", mobile: "94772224455", tier: "SILVER" },
    { name: "Isuru Gunathilaka", mobile: "94773335566", tier: "BRONZE" },
    { name: "Pradeep Wijesinghe", mobile: "94774446677", tier: "GOLD" },
  ];

  for (const client of clients) {
    await prisma.client.upsert({
      where: { mobile: client.mobile },
      update: {
        name: client.name,
        tier: client.tier,
      },
      create: client,
    });
  }

  await prisma.$disconnect();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
