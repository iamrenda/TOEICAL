# TOEICAL

TOEICから始める英語学習アプリ

https://github.com/user-attachments/assets/558e2190-7c66-4006-a122-a3de88bf74d2

## 機能

- リーディングモード: TOEICの問題をランダムに出題し、解答後に正解と解説を表示します。また問題一覧を見ることもできます。
- ライティングモード: ユーザがテーマを選び、AIが様々な観点から採点をしてくれます。またAIが考えた模範解答も見れます。

## 補足

- **特定のデータはスクレイピングによって取得しました。よってデータベースはローカル環境のみに構築しており、外部に公開する予定はありません。**
- UIデザイン・レビューのみ Claude Code を使用しています。

## 進捗

- [x] フロントエンドの基本的な画面構成とナビゲーションの実装
- [x] バックエンドのAPI設計と実装
- [x] フロントエンドとバックエンドの統合
- [x] リーディングモードの実装
- [x] ライティングモードの実装
- [x] テストの実装
- [ ] Rate limit の実装

## 技術スタック

フロントエンド

- React Native (Expo)
- React Native StyleSheet
- React Navigation
- TypeScript
- Zustand

バックエンド

- Node.js
- Express.js
- TypeScript
- Zod
- PostgreSQL
- Python
- FastAPI
- GenAI API
- Pino
- Jest
- Supertest
- Express Rate Limit

## セットアップ方法

### 前提条件

- Node.js 22.18 以上
- PostgreSQL
- Python 3
- Gemini API キー

### 1. 依存関係のインストール

`frontend` / `backend` / `shared` は npm workspaces です。リポジトリのルートで一度だけ実行してください。

```
npm install
```

AI サービス (Python) は別途セットアップします。

```
cd ai
python -m venv venv
./venv/Scripts/activate        # macOS / Linux: source venv/bin/activate
pip install -r requirements.txt
```

### 2. 環境変数の設定

各サービスの `.env.example` を `.env` にコピーして値を設定します。

| サービス    | ファイル                          | 主な変数                                                                                                      |
| ----------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `backend/`  | `.env` (`.env.example`)           | `NODE_ENV`, `PORT`, `DATABASE_URL`, `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`, `FASTAPI_URL`, `LOG_LEVEL` |
| `backend/`  | `.env.test` (`.env.test.example`) | テスト用。開発用とは別のデータベースを指定してください                                                        |
| `frontend/` | `.env` (`.env.example`)           | `EXPO_PUBLIC_API_HOST`, `EXPO_PUBLIC_PORT`（未設定でも Metro のホストから自動解決されます）                   |
| `ai/`       | `.env` (`.env.example`)           | `GEMINI_KEY`                                                                                                  |

### 3. データベースの作成

PostgreSQL にデータベースを作成し、`backend/sql/init.sql` でテーブルを作成します。`init.sql` は `\i` で同じディレクトリのファイルを読み込むため、**`backend/sql` に移動してから** 実行してください。

```
createdb toeical
cd backend/sql
psql "$DATABASE_URL" -f init.sql
```

- `backend/sql/` にはスキーマと少量のサンプルデータが入っています。
- スクレイピングで取得した全データは `backend/sql/full/` に置く想定です（Git 管理外）。
- テスト用データベースも同様に作成してください（`backend/.env.test` の `DATABASE_URL` を指定）。

### 4. 各サービスの起動

それぞれ別のターミナルで起動します。

```
# AI (FastAPI)
cd ai
./venv/Scripts/activate
fastapi dev main.py

# バックエンド (Express.js)
cd backend
npm run dev

# フロントエンド (Expo)
cd frontend
npm run dev
```

フロントエンドが通信するのはバックエンドのみです。FastAPI はバックエンドからのみ呼び出されます。

### その他のコマンド

```
npm run typecheck      # 全 workspace の型チェック（ルートで実行）
npm run format         # prettier で整形（ルートで実行）
cd backend && npm test # バックエンドのテスト（.env.test を使用）
cd frontend && npm run lint
```

## 設計 （リンク）

アーキテクチャ設計：
https://excalidraw.com/#json=l6-Mq1zUY9A7S7m-Jv9Io,dIfsYm-TxRZ-TOO5egtecg

データベース設計：
https://dbdiagram.io/d/TOEICAL-699127c6bd82f5fce2bc1d01
