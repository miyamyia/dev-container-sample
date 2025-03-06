# Dev Container サンプルプロジェクト

このプロジェクトは、VS Code Dev Containers を使用して開発環境を共有するためのサンプルプロジェクトです。Docker Compose を使用して、アプリケーションとデータベースの環境を簡単に構築できます。

## 技術スタック

- **バックエンド**: Node.js, TypeScript, Hono (Web フレームワーク)
- **データベース**: PostgreSQL, Prisma (ORM)
- **開発ツール**: Docker, VS Code Dev Containers, pnpm

## 前提条件

以下のツールがインストールされていることを確認してください：

- [Docker](https://www.docker.com/get-started/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [VS Code Dev Containers 拡張機能](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

## 開発環境のセットアップ

### 1. リポジトリのクローン

```bash
git clone https://github.com/miyamyia/dev-container-sample
cd dev-container-sample
```

### 2. Dev Container の起動

1. VS Code でプロジェクトを開きます
2. 左下の青色のアイコンをクリックします
3. 表示されるメニューから「Reopen in Container」を選択します
4. コンテナのビルドが完了するまで待ちます（初回は数分かかることがあります）

これにより、以下の環境が自動的に構築されます：

- Node.js 20 環境（アプリケーション用）
- PostgreSQL データベース
- 必要な開発ツール（git, curl, vim, postgresql-client）
- pnpm パッケージマネージャー

### 3. 依存関係のインストール

コンテナ内のターミナルで以下のコマンドを実行して、必要なパッケージをインストールします：

```bash
pnpm install
```

### 4. データベースの初期化

コンテナ内のターミナルで以下のコマンドを実行します：

```bash
npx prisma migrate dev
```

これにより、データベーススキーマが初期化されます。

## アプリケーションの起動方法

### 開発サーバーの起動

コンテナ内のターミナルで以下のコマンドを実行します：

```bash
pnpm dev
```

サーバーが起動すると、以下の URL でアプリケーションにアクセスできます：

- メイン API: http://localhost:3000
- ユーザー API: http://localhost:3000/api/users
- 投稿 API: http://localhost:3000/api/posts

### Prisma Studio の起動（オプション）

データベースを視覚的に操作するには、別のターミナルで以下のコマンドを実行します：

```bash
npx prisma studio
```

Prisma Studio が http://localhost:5555 で起動します。

## 主要機能と API エンドポイント

このサンプルアプリケーションは、ブログシステムのバックエンド API を提供します：

### ユーザー管理 (/api/users)

- **GET /api/users**: すべてのユーザーを取得

  ```bash
  curl http://localhost:3000/api/users
  ```

- **GET /api/users/:id**: 特定のユーザーを取得（関連する投稿も含む）

  ```bash
  curl http://localhost:3000/api/users/1
  ```

- **POST /api/users**: 新しいユーザーを作成

  ```bash
  curl -X POST http://localhost:3000/api/users \
    -H "Content-Type: application/json" \
    -d '{"email":"user@example.com","name":"テストユーザー","password":"password123"}'
  ```

- **PUT /api/users/:id**: ユーザー情報を更新

  ```bash
  curl -X PUT http://localhost:3000/api/users/1 \
    -H "Content-Type: application/json" \
    -d '{"name":"更新後の名前"}'
  ```

- **DELETE /api/users/:id**: ユーザーを削除
  ```bash
  curl -X DELETE http://localhost:3000/api/users/1
  ```

### 投稿管理 (/api/posts)

- **GET /api/posts**: すべての投稿を取得

  ```bash
  curl http://localhost:3000/api/posts
  ```

- **GET /api/posts/:id**: 特定の投稿を取得（作成者情報とコメントを含む）

  ```bash
  curl http://localhost:3000/api/posts/1
  ```

- **POST /api/posts**: 新しい投稿を作成

  ```bash
  curl -X POST http://localhost:3000/api/posts \
    -H "Content-Type: application/json" \
    -d '{"title":"テスト投稿","content":"これはテスト投稿です","authorId":1}'
  ```

- **PUT /api/posts/:id**: 投稿を更新

  ```bash
  curl -X PUT http://localhost:3000/api/posts/1 \
    -H "Content-Type: application/json" \
    -d '{"title":"更新後のタイトル","published":true}'
  ```

- **DELETE /api/posts/:id**: 投稿を削除
  ```bash
  curl -X DELETE http://localhost:3000/api/posts/1
  ```

## コンテナの停止

VS Code を閉じるか、左下の青色のアイコンをクリックして「Close Remote Connection」を選択します。
