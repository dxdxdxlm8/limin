# limin

立民实业企业官网 - 前后端完整项目

## 项目结构

```
limin/
├── aliyun_code/          # 前端代码 (React + Vite + TypeScript)
│   ├── src/
│   │   ├── components/   # 组件
│   │   ├── pages/        # 页面
│   │   ├── lib/          # 工具库
│   │   └── ...
│   ├── package.json
│   └── ...
├── backend/              # 后端代码 (Node.js + Express + Prisma)
│   ├── prisma/           # 数据库模型
│   ├── uploads/          # 上传文件
│   ├── index.ts          # 主入口
│   └── ...
└── README.md
```

## 技术栈

### 前端
- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui

### 后端
- Node.js
- Express
- Prisma ORM
- SQLite

## 安装与运行

### 前端
```bash
cd aliyun_code
pnpm install
pnpm dev
```

### 后端
```bash
cd backend
pnpm install
pnpm dev
```
