# 21點計分器 Poker Scorer

一個優雅的 21 點遊戲計分器，適用於紙牌遊戲和桌遊。

## 功能特色

- 🎴 精準計分，遊戲勝敗一目了然
- 🏆 排行榜功能，榮譽與榮耀的見證
- 📜 遊戲記錄，每一刻輝煌都被保存
- 👥 玩家管理，開局打人名
- 🏠 自動計分，輕鬆遊戲無憂慮
- 🔄 重置系統，從頭開始

## 技術棧

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Zustand
- React Router

## 本地開發

```bash
# 安裝依賴
pnpm install

# 啟動開發服務器
pnpm dev

# 打開瀏覽器訪問 http://localhost:5173/
```

## 部署到 GitHub Pages

### 前置條件

1. 在 GitHub 上創建一個名為 `Poker` 的倉庫（注意大小寫）
2. 確保已安裝 Git 和 pnpm

### 部署步驟

#### 1. 第一次設置

```bash
# 添加所有文件
git add .

# 提交更改
git commit -m "Initial commit"

# 添加遠程倉庫（替換 YOUR_USERNAME 為您的 GitHub 用戶名）
git remote add origin https://github.com/YOUR_USERNAME/Poker.git

# 推送代碼
git push -u origin main
```

#### 2. 首次部署

```bash
# 構建並部署
pnpm deploy
```

#### 3. 以後的部署

每次有新的更改時，只需：

```bash
# 提交更改
git add .
git commit -m "Your commit message"
git push

# 部署到 GitHub Pages
pnpm deploy
```

### 訪問您的網站

部署成功後，您的網站將在以下地址可訪問：

```
https://YOUR_USERNAME.github.io/Poker/
```

（替換 YOUR_USERNAME 為您的 GitHub 用戶名）

## 遊戲規則

### 計分方式

- **+2 分**：玩家獲得 21 點
- **+1 分**：玩家贏過莊家
- **-1 分**：玩家輸給莊家或莊家獲得 21 點
- **-2 分**：玩家超過 21 點

### 特別規則

- 當莊家獲得 21 點時，所有玩家都獲得 -1 分
- 開始遊戲前必須先選擇一位玩家作為莊家
- 莊家的分數是所有玩家分數總和的相反數

## 項目結構

```
Poker/
├── src/
│   ├── pages/       # 頁面組件
│   │   ├── Home.tsx
│   │   ├── Game.tsx
│   │   ├── Leaderboard.tsx
│   │   └── History.tsx
│   ├── App.tsx      # 路由配置
│   ├── main.tsx     # 應用入口
│   ├── store.ts     # 狀態管理
│   └── index.css    # 全局樣式
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## 授權

MIT
