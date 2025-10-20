import { PrismaClient } from "../prisma/generated/client";

const prisma = new PrismaClient();

export const disconnectDB = async () => {
  await prisma.$disconnect();
};

export default prisma;
export type { Prisma } from "../prisma/generated/client";
