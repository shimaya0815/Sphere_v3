# Sphere - 事業所総合管理システム

Sphereは事業所の業務を効率化する総合プラットフォームです。タスク管理、クライアント管理、時間管理、コミュニケーションを一元化し、業務の効率化と透明性を高めます。

## 主要機能

- **事業所管理**: 複数事業所の管理、メンバー招待、権限設定
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

- **開発環境**
  - Vite
  - Docker
  - ESLint
  - Prettier

## セットアップ

### 前提条件

- Node.js (v18以上)
- Docker Desktop

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/shimaya0815/Sphere_v3.git
cd Sphere_v3

# 依存パッケージをインストール
npm install

# 開発サーバーを起動
npm run dev
```

### Dockerを使用する場合

```bash
# Dockerコンテナを起動
docker compose up -d

# コンテナを停止
docker compose down
```

## 開発コマンド

```bash
# 開発サーバーを起動
npm run dev

# 型チェック
npm run typecheck

# lintチェック
npm run lint

# ビルド
npm run build

# ビルドしたアプリをプレビュー
npm run preview
```

## プロジェクト構成

```
Sphere_v3/
├── public/              # 静的ファイル
├── src/                 # ソースコード
│   ├── api/             # API関連
│   ├── components/      # コンポーネント
│   │   ├── auth/        # 認証関連コンポーネント
│   │   ├── common/      # 共通コンポーネント
│   │   └── layout/      # レイアウトコンポーネント
│   ├── context/         # コンテキスト
│   ├── hooks/           # カスタムフック
│   ├── pages/           # ページコンポーネント
│   │   ├── auth/        # 認証関連ページ
│   │   ├── business/    # 事業所管理ページ
│   │   ├── chat/        # チャットページ
│   │   ├── clients/     # クライアント管理ページ
│   │   ├── tasks/       # タスク管理ページ
│   │   ├── time/        # 時間管理ページ
│   │   └── wiki/        # Wikiページ
│   └── utils/           # ユーティリティ
├── .eslintrc.js         # ESLint設定
├── docker-compose.yml   # Docker Compose設定
├── Dockerfile           # Docker設定
├── index.html           # エントリーポイント
├── package.json         # パッケージ設定
├── tsconfig.json        # TypeScript設定
└── vite.config.ts       # Vite設定
```

## ライセンス

このプロジェクトは [MIT ライセンス](LICENSE) の下で公開されています。