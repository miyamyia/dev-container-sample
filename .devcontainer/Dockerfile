FROM node:20-bullseye

# 開発ツールのインストール
RUN apt-get update && apt-get install -y \
    git \
    curl \
    vim \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# pnpmのインストール
RUN npm install -g pnpm

# 作業ディレクトリの設定
WORKDIR /workspace

# コミット関連ツールのグローバルインストール
RUN npm install -g commitizen cz-conventional-changelog @commitlint/cli @commitlint/config-conventional

# デフォルトシェルをbashに設定
SHELL ["/bin/bash", "-c"]

# タイムゾーン設定
ENV TZ=Asia/Tokyo

# 作業ディレクトリの所有者をnodeユーザーに変更
USER root
RUN mkdir -p /workspace/node_modules && chown -R node:node /workspace

# 最終的にnodeユーザーに戻す
USER node

# コンテナ起動時のコマンド
CMD ["sleep", "infinity"]
