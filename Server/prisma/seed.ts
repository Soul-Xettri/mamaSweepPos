import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password', 10);
  await prisma.user.create({
    data: {
      name: 'Criss Karki',
      email: 'criss@gmail.com',
      password,
      role: Role.ADMIN,
      addedBy:"serverHead",
      updatedBy:"serverHead"
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
