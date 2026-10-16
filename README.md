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

### フロントエンド

```
cd frontend
npm run dev
```

### バックエンド (Express.js)

```
cd backend
npm run dev
```

### バックエンド (FastAPI)

```
cd ai
./venv/Scripts/activate
fastapi dev main.py
```

## 設計 （リンク）

アーキテクチャ設計：
https://excalidraw.com/#json=l6-Mq1zUY9A7S7m-Jv9Io,dIfsYm-TxRZ-TOO5egtecg

データベース設計：
https://dbdiagram.io/d/TOEICAL-699127c6bd82f5fce2bc1d01
