import { PrismaClient } from "@prisma/client";

// PrismaClientのグローバルインスタンスを作成
const prisma = new PrismaClient();

export default prisma;
