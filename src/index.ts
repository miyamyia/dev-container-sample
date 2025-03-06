import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import usersRouter from "./routes/users.js";
import postsRouter from "./routes/posts.js";

// Prismaクライアントの初期化
import "./lib/prisma.js";

// メインアプリケーションの作成
const app = new Hono();

// ミドルウェアの設定
app.use("*", logger());
app.use("*", cors());

// ルートエンドポイント
app.get("/", (c) => {
  return c.json({
    message: "Hono + Prisma API Server",
    version: "1.0.0",
    endpoints: {
      users: "/api/users",
      posts: "/api/posts",
    },
  });
});

// APIルーターのマウント
app.route("/api/users", usersRouter);
app.route("/api/posts", postsRouter);

// サーバーの起動
serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
    console.log(`API endpoints:`);
    console.log(`- Users: http://localhost:${info.port}/api/users`);
    console.log(`- Posts: http://localhost:${info.port}/api/posts`);
  }
);
