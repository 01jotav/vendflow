import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const db = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@vendflow.com";
  const password = process.env.ADMIN_PASSWORD ?? "admin123";

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    if (existing.role !== "ADMIN") {
      await db.user.update({ where: { email }, data: { role: "ADMIN" } });
      console.log(`✅ Usuário ${email} promovido a ADMIN`);
    } else {
      console.log(`ℹ️  Admin ${email} já existe`);
    }
    return;
  }

  await db.user.create({
    data: {
      name: "Admin Vendflow",
      email,
      password: await hash(password, 12),
      role: "ADMIN",
    },
  });

  console.log(`✅ Admin criado: ${email} / ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
