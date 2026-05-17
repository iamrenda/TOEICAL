# TOEICAL

TOEICから始める英語学習アプリ

https://github.com/user-attachments/assets/3c192f98-d20b-4c28-b39c-1ce6341715bc

## 機能

- リーディングモード: TOEICの問題をランダムに出題し、解答後に正解と解説を表示します。また問題一覧を見ることもできます。

## 進捗

- [x] フロントエンドの基本的な画面構成とナビゲーションの実装
- [x] バックエンドのAPI設計と実装
- [x] フロントエンドとバックエンドの統合
- [x] リーディングモードの実装
- [ ] ライティングモードの実装 (現在進行中)
- [ ] スピーキングモードの実装

## 技術スタック

フロントエンド

- React Native (Expo)
- React Native StyleSheet
- React Navigation
- TypeScript
- Zustand

バックエンド (Express.js x FastAPI)

- Node.js
- Express.js
- Zod
- TypeScript
- PostgreSQL
- Python
- FastAPI
- GenAI API

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
https://excalidraw.com/#json=mCtq7xazp-BYQ3ysaGOAI,gcZ4M6etazrvDM3q0izzQA

データベース設計：
https://dbdiagram.io/d/TOEICAL-699127c6bd82f5fce2bc1d01
