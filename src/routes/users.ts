import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import prisma from "../lib/prisma.js";

// ユーザールーターの作成
const usersRouter = new Hono();

// ユーザー作成のバリデーションスキーマ
const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  password: z.string().min(6),
});

// ユーザー更新のバリデーションスキーマ
const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
});

// ユーザー一覧の取得
usersRouter.get("/", async (c) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return c.json(users);
  } catch (error) {
    console.error("ユーザー一覧取得エラー:", error);
    return c.json({ error: "ユーザー一覧の取得に失敗しました" }, 500);
  }
});

// 特定のユーザーの取得
usersRouter.get("/:id", async (c) => {
  const id = parseInt(c.req.param("id"));

  if (isNaN(id)) {
    return c.json({ error: "無効なユーザーIDです" }, 400);
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        posts: {
          select: {
            id: true,
            title: true,
            published: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      return c.json({ error: "ユーザーが見つかりません" }, 404);
    }

    return c.json(user);
  } catch (error) {
    console.error("ユーザー取得エラー:", error);
    return c.json({ error: "ユーザーの取得に失敗しました" }, 500);
  }
});

// ユーザーの作成
usersRouter.post("/", zValidator("json", createUserSchema), async (c) => {
  const data = await c.req.json();

  try {
    const user = await prisma.user.create({
      data,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return c.json(user, 201);
  } catch (error) {
    console.error("ユーザー作成エラー:", error);
    return c.json({ error: "ユーザーの作成に失敗しました" }, 500);
  }
});

// ユーザーの更新
usersRouter.put("/:id", zValidator("json", updateUserSchema), async (c) => {
  const id = parseInt(c.req.param("id"));
  const data = await c.req.json();

  if (isNaN(id)) {
    return c.json({ error: "無効なユーザーIDです" }, 400);
  }

  try {
    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return c.json(user);
  } catch (error) {
    console.error("ユーザー更新エラー:", error);
    return c.json({ error: "ユーザーの更新に失敗しました" }, 500);
  }
});

// ユーザーの削除
usersRouter.delete("/:id", async (c) => {
  const id = parseInt(c.req.param("id"));

  if (isNaN(id)) {
    return c.json({ error: "無効なユーザーIDです" }, 400);
  }

  try {
    await prisma.user.delete({
      where: { id },
    });
    return c.json({ message: "ユーザーを削除しました" });
  } catch (error) {
    console.error("ユーザー削除エラー:", error);
    return c.json({ error: "ユーザーの削除に失敗しました" }, 500);
  }
});

export default usersRouter;
