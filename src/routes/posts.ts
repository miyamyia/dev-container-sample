import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import prisma from "../lib/prisma.js";

// 投稿ルーターの作成
const postsRouter = new Hono();

// 投稿作成のバリデーションスキーマ
const createPostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  published: z.boolean().optional(),
  authorId: z.number().int().positive(),
});

// 投稿更新のバリデーションスキーマ
const updatePostSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  published: z.boolean().optional(),
});

// 投稿一覧の取得
postsRouter.get("/", async (c) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    return c.json(posts);
  } catch (error) {
    console.error("投稿一覧取得エラー:", error);
    return c.json({ error: "投稿一覧の取得に失敗しました" }, 500);
  }
});

// 特定の投稿の取得
postsRouter.get("/:id", async (c) => {
  const id = parseInt(c.req.param("id"));

  if (isNaN(id)) {
    return c.json({ error: "無効な投稿IDです" }, 400);
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!post) {
      return c.json({ error: "投稿が見つかりません" }, 404);
    }

    return c.json(post);
  } catch (error) {
    console.error("投稿取得エラー:", error);
    return c.json({ error: "投稿の取得に失敗しました" }, 500);
  }
});

// 投稿の作成
postsRouter.post("/", zValidator("json", createPostSchema), async (c) => {
  const data = await c.req.json();

  try {
    const post = await prisma.post.create({
      data,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    return c.json(post, 201);
  } catch (error) {
    console.error("投稿作成エラー:", error);
    return c.json({ error: "投稿の作成に失敗しました" }, 500);
  }
});

// 投稿の更新
postsRouter.put("/:id", zValidator("json", updatePostSchema), async (c) => {
  const id = parseInt(c.req.param("id"));
  const data = await c.req.json();

  if (isNaN(id)) {
    return c.json({ error: "無効な投稿IDです" }, 400);
  }

  try {
    const post = await prisma.post.update({
      where: { id },
      data,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    return c.json(post);
  } catch (error) {
    console.error("投稿更新エラー:", error);
    return c.json({ error: "投稿の更新に失敗しました" }, 500);
  }
});

// 投稿の削除
postsRouter.delete("/:id", async (c) => {
  const id = parseInt(c.req.param("id"));

  if (isNaN(id)) {
    return c.json({ error: "無効な投稿IDです" }, 400);
  }

  try {
    await prisma.post.delete({
      where: { id },
    });
    return c.json({ message: "投稿を削除しました" });
  } catch (error) {
    console.error("投稿削除エラー:", error);
    return c.json({ error: "投稿の削除に失敗しました" }, 500);
  }
});

export default postsRouter;
