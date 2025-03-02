# Sphere - 事業所総合管理システム

Sphereは事業所の業務を効率化する総合プラットフォームです。タスク管理、クライアント管理、時間管理、コミュニケーションを一元化し、業務の効率化と透明性を高めます。

## 主要機能

- **会社管理**: 会社単位でのデータ分離、メンバー招待、権限設定
- **タスク管理**: タスクの作成、割り当て、進捗管理、ドラッグ＆ドロップでの並び替え
- **クライアント管理**: クライアント情報の一元管理、契約管理、決算期設定
- **時間管理**: タスクの作業時間の記録、自動集計、レポート作成
- **チャット**: チーム内でのリアルタイムコミュニケーション、メンション機能、ファイル共有
- **Wiki**: ナレッジの蓄積と共有、バージョン管理、検索機能

## 技術スタック

- **フロントエンド**
  - React (TypeScript)
  - React Router
  - React Query
  - React Hook Form
  - TailwindCSS + DaisyUI
  - Socket.IO Client
  - Axios

- **バックエンド**
  - Node.js + Express
  - Sequelize ORM
  - JWT認証
  - PostgreSQL

- **開発環境**
  - Vite
  - Docker
  - ESLint
  - Prettier

## セットアップ

### 前提条件

- Docker Desktop

### Dockerを使用したセットアップ（推奨）

```bash
# リポジトリをクローン
git clone https://github.com/shimaya0815/Sphere_v3.git
cd Sphere_v3

# Dockerコンテナを起動（フロントエンド、バックエンド、データベース全て）
docker compose up -d

# コンテナを停止
docker compose down
```

### 手動セットアップ（個別に起動する場合）

```bash
# リポジトリをクローン
git clone https://github.com/shimaya0815/Sphere_v3.git
cd Sphere_v3

# フロントエンド
npm install
npm run dev

# バックエンド
cd server
npm install
npm run dev

# データベース（PostgreSQLが必要）
# .envファイルでデータベース接続設定を行う
```

## アクセス方法

- フロントエンド: http://localhost:3000
- バックエンドAPI: http://localhost:4000/api
- データベース: PostgreSQL (localhost:5432)
  - ユーザー: postgres
  - パスワード: postgres
  - データベース名: sphere

## 開発コマンド

```bash
# フロントエンド開発サーバーを起動
npm run dev

# 型チェック
npm run typecheck

# lintチェック
npm run lint

# ビルド
npm run build
```

## アーキテクチャと実装の特徴

### 会社単位のアクセス制御

- 一社一サイト型のアーキテクチャを採用
- 会社IDに基づくデータ分離により、他社のデータにアクセスできない設計
- 招待ベースのユーザー登録システム（ビジネスコード + 招待コード）

### 認証・認可

- JWTベースの認証
- ロールベースのアクセス制御（admin, manager, user）
- 安全なパスワード管理（bcryptによるハッシュ化）

### データベース設計

- PostgreSQLによるリレーショナルデータベース
- Sequelize ORMによるモデル管理
- トランザクション処理によるデータ整合性の確保

## プロジェクト構成

```
Sphere_v3/
├── public/              # 静的ファイル
├── src/                 # フロントエンドソースコード
│   ├── api/             # API連携クライアント
│   ├── components/      # UIコンポーネント
│   ├── context/         # Reactコンテキスト
│   ├── pages/           # ページコンポーネント
│   └── utils/           # ユーティリティ関数
├── server/              # バックエンドソースコード
│   ├── src/             # サーバーコード
│   │   ├── config/      # 設定ファイル
│   │   ├── controllers/ # APIコントローラー
│   │   ├── middleware/  # ミドルウェア
│   │   ├── models/      # データモデル
│   │   ├── routes/      # APIルート
│   │   └── utils/       # ユーティリティ関数
│   └── package.json     # バックエンド依存関係
├── docker-compose.yml   # Docker Compose設定
├── Dockerfile.frontend  # フロントエンドのDockerfile
├── package.json         # フロントエンド依存関係
└── tsconfig.json        # TypeScript設定
```

## 今後の開発予定

- タスク管理機能の実装
- クライアント管理機能の実装
- チャットシステムの実装
- Wikiシステムの実装
- データ分析ダッシュボードの実装

## ライセンス

このプロジェクトは [MIT ライセンス](LICENSE) の下で公開されています。