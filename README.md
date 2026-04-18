# openUI

CardTie 設計系統元件庫。以 Storybook 作為元件目錄，Tailwind CSS v4 + shadcn/ui 風格 token 作為樣式基礎。

---

## 🎨 給設計師：怎麼啟動 Storybook

Storybook 是一個能夠即時預覽所有 UI 元件的網頁工具。你可以在上面瀏覽、調整、測試每個元件。

### 一、第一次使用：環境準備

1. **安裝 Node.js 20**

   前往 https://nodejs.org/zh-tw 下載並安裝 **LTS 版本**。

   安裝好後打開「終端機」（Terminal，Mac 可用 Spotlight 搜尋 Terminal），確認版本：
   ```bash
   node --version
   ```
   預期看到類似 `v20.xx.x` 的輸出。

2. **下載這個 repo**（若還沒有）
   ```bash
   git clone <此 repo 的網址>
   cd openUI
   ```

3. **安裝套件**
   ```bash
   npm install
   ```
   第一次會比較久（可能 3-5 分鐘），之後就會很快。

---

### 二、每次開發：啟動 Storybook

```bash
npm run storybook
```

稍等幾秒，瀏覽器會自動打開 http://localhost:6006 ，就能看到所有元件。

**要關閉：** 回到終端機，按 `Ctrl + C`。

---

### 三、常見問題

| 問題 | 解決方法 |
|------|----------|
| `npm: command not found` | 重新安裝 Node.js 並重啟終端機 |
| 網頁沒有自動打開 | 手動打開 http://localhost:6006 |
| 改了程式碼，畫面沒更新 | Storybook 通常會自動熱重載；若沒反應，請重新整理瀏覽器 |

遇到其他狀況，請找 linyi（xup6easier@gmail.com）。

---

## 🎯 設計原則（工程師 / design engineer 看）

- **Semantic token 優先**：元件裡應寫 `bg-primary text-primary-foreground`，**不要**寫 `bg-blue-500` 這種原始色階 — 這樣未來調整品牌色只要改 `src/index.css` 的 `:root`，全部元件自動跟上。
- **Utility 優先**：新元件只用 Tailwind utility class，不另建 `.css` 檔。
- **Token 架構採 shadcn/ui 慣例**：使用 shadcn 官方的 token 名（background、foreground、primary、secondary、muted、accent、destructive、border 等）— 設計師可直接參考 [shadcn/ui 文件](https://ui.shadcn.com) 的慣例與範例。

---

## 📁 目錄結構

```
openUI/
├── .storybook/
│   ├── main.ts           ← Storybook config（含 Tailwind viteFinal）
│   └── preview.ts        ← 全域 CSS import
├── src/
│   ├── components/
│   │   └── Button/
│   │       ├── Button.tsx
│   │       ├── Button.stories.tsx
│   │       └── index.ts
│   ├── index.css         ← Tailwind 入口 + shadcn token
│   └── index.ts          ← 對外 export barrel
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.*.json
```

---

## 🧩 如何新增一個元件（以 `Card` 為例）

1. 建立目錄 `src/components/Card/`
2. 寫 `Card.tsx`：
   ```tsx
   import React from "react";

   export interface CardProps extends React.ComponentProps<"div"> {}

   export function Card({ className, ...props }: CardProps) {
     const classes = [
       "rounded-lg border border-border bg-card text-card-foreground shadow-sm",
       className,
     ]
       .filter(Boolean)
       .join(" ");
     return <div className={classes} {...props} />;
   }
   ```
3. 寫 `Card.stories.tsx`（照 `Button.stories.tsx` 的模式）
4. 寫 `index.ts`：
   ```ts
   export { Card } from "./Card";
   export type { CardProps } from "./Card";
   ```
5. 更新 barrel `src/index.ts`：
   ```ts
   export * from "./components/Card";
   ```

重新整理瀏覽器，左側就會看到新的元件。

---

## 🎨 如何調整 design tokens

全部 token 都在 `src/index.css` 裡，分三個區塊：

| 區塊 | 調整什麼 |
|------|----------|
| `:root { ... }` | **light 模式**的色值、圓角（`--radius`） |
| `.dark { ... }` | **dark 模式**的色值 |
| `@theme inline { ... }` | 映射 CSS 變數給 Tailwind；通常不用動，除非要新增 utility 類別 |

**改品牌主色舉例**：
```css
:root {
  --primary: oklch(0.55 0.22 250);        /* 原本 oklch(0.205 0 0) */
  --primary-foreground: oklch(0.985 0 0); /* 對比色保持白 */
}
```
儲存檔案，Storybook 會自動刷新 — 所有使用 `bg-primary` 的元件跟著換色。

> **提醒**：本專案用 [OKLCH 色彩空間](https://oklch.com/)（可用 https://oklch.com 線上工具挑色）。

---

## 🚀 常用指令

```bash
# 本地預覽
npm run storybook

# 匯出 Storybook 靜態站（部署用）
npm run build-storybook
# → 產出 storybook-static/

# 打包成 lib（給外部 app 消費）
npm run build
```

---

## 🌐 部署到 Cloudflare Pages

`npm run build-storybook` 產出的 `storybook-static/` 是純靜態站，可直接部署。

**Git-connected 自動部署設定**（Cloudflare Pages Dashboard → Create project → Connect to Git）：

| 欄位 | 值 |
|------|----|
| Framework preset | None |
| Build command | `npm install && npm run build-storybook` |
| Build output directory | `storybook-static` |
| Root directory | `/` |
| Environment variables | `NODE_VERSION=20` |

之後每次 push 到 production branch 自動重建。Custom domain 可到 Pages → Custom domains 綁 `storybook.cardtie.com`（或其他子域）。

---

## 📚 相關資源

- [Tailwind CSS v4 文件](https://tailwindcss.com/docs)
- [shadcn/ui 文件](https://ui.shadcn.com/) — token 命名慣例參考
- [Storybook 文件](https://storybook.js.org/docs)
- [OKLCH 色彩工具](https://oklch.com/)
