# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**儿童教育平台** - 一个面向0-6岁儿童的互动式在线教育平台

### 核心定位
- **主打互动，内容为辅**：80%互动游戏 + 20%学习内容
- **目标用户**：主打0-3岁和3-6岁儿童
- **差异化**：与宝宝巴士不同，我们强调主动参与而非被动观看

### 技术栈
- **后端**：Golang 1.22+ + Gin + MySQL 8.0 + Redis 7 + 腾讯云COS
- **前端**：Vue 3.4+ + TypeScript 5+ + Vite 5+ + Pinia + Element Plus
- **部署**：Docker + Docker Compose + Nginx

### 架构特点
- **前后端分离**：后端提供RESTful API，前端负责所有交互逻辑
- **游戏关卡前端化**：游戏配置、关卡设计、进度管理都在前端代码中
- **内容后台管理**：学习内容（动物、水果等）通过管理后台上传
- **简化数据库**：只有8张核心表，专注于用户、内容、星星、成就

## Development Commands

### 后端开发

```bash
# 进入后端目录
cd backend

# 安装依赖（首次）
go mod download

# 运行开发服务器
go run cmd/api/main.go

# 构建
go build -o main cmd/api/main.go

# 运行测试
go test ./...
```

### 前端开发

```bash
# 进入前端目录
cd frontend

# 安装依赖（首次）
npm install

# 运行开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

### Docker部署

```bash
# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止所有服务
docker-compose down

# 重新构建并启动
docker-compose up -d --build
```

### 数据库管理

```bash
# 初始化数据库（首次）
docker exec -it kids-edu-mysql mysql -u root -p kids_education < backend/migrations/001_init.sql

# 连接数据库
docker exec -it kids-edu-mysql mysql -u kidsuser -p kids_education
```

## Architecture

### 目录结构

```
education/
├── backend/                 # 后端Go项目
│   ├── cmd/
│   │   ├── api/            # API服务入口
│   │   └── migrate/        # 数据库迁移工具
│   ├── internal/
│   │   ├── api/            # API层（handler、middleware、router）
│   │   ├── model/          # 数据模型
│   │   ├── service/        # 业务逻辑层
│   │   ├── repository/     # 数据访问层
│   │   └── pkg/            # 内部公共包
│   ├── pkg/                # 外部公共包（storage、cache、database）
│   ├── config/             # 配置文件
│   ├── migrations/         # 数据库迁移脚本
│   └── Dockerfile
│
├── frontend/               # 前端Vue3项目
│   ├── src/
│   │   ├── modules/        # 模块化设计
│   │   │   ├── block1/    # 板块1（宝宝启蒙）
│   │   │   └── common/    # 通用模块
│   │   ├── router/         # 路由配置
│   │   ├── stores/         # Pinia状态管理
│   │   ├── api/            # API调用
│   │   └── assets/         # 静态资源
│   ├── nginx.conf
│   └── Dockerfile
│
├── docs/                   # 文档
│   └── DESIGN.md          # 完整设计文档
│
├── docker-compose.yml      # Docker编排
└── CLAUDE.md              # 本文件
```

### 数据库设计（简化版）

**8张核心表**：
1. `users` - 用户表
2. `learning_contents` - 学习内容表
3. `user_learning_records` - 学习记录表
4. `user_stars` - 星星积分表
5. `star_transactions` - 星星交易记录表
6. `achievements` - 成就表
7. `user_achievements` - 用户成就表
8. `admins` - 管理员表

**注意**：游戏关卡、进度等数据由前端管理，不存储在数据库中。

### API接口规范

- **Base URL**: `/api/v1`
- **认证方式**: JWT Token (Header: `Authorization: Bearer <token>`)
- **响应格式**: 统一JSON格式

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 前端游戏配置

游戏关卡配置在前端代码中：
- 位置：`frontend/src/config/games.ts`
- 包含：游戏类型、关卡配置、星星奖励规则、成就定义
- 进度管理：localStorage + 后端同步

## Development Guidelines

### 代码规范

**后端（Go）**：
- 遵循Go官方代码规范
- 使用`gofmt`格式化代码
- 错误处理：明确返回错误，不要panic
- 命名：驼峰命名法

**前端（Vue3 + TypeScript）**：
- 使用Composition API
- 组件命名：PascalCase
- 文件命名：kebab-case
- 类型定义：优先使用interface

### Git工作流

- 主分支：`main`
- 功能分支：`feature/xxx`
- 修复分支：`fix/xxx`
- 提交信息：使用中文，简洁明了

### 注意事项

1. **游戏逻辑在前端**：不要在后端实现游戏规则和关卡配置
2. **资源使用COS**：所有图片、音频上传到腾讯云COS
3. **儿童友好设计**：大按钮、柔和色彩、即时反馈
4. **性能优化**：图片懒加载、音频预加载、60fps动画
5. **安全性**：敏感信息加密、SQL注入防护、XSS防护

## Quick Start

### 首次启动

```bash
# 1. 克隆项目
git clone <repo-url>
cd education

# 2. 启动Docker服务
docker-compose up -d

# 3. 等待服务启动（约30秒）
docker-compose logs -f

# 4. 访问应用
# 前端：http://localhost
# 后端API：http://localhost:8080
# MySQL：localhost:3306
# Redis：localhost:6379
```

### 本地开发

```bash
# 终端1：启动后端
cd backend
go run cmd/api/main.go

# 终端2：启动前端
cd frontend
npm run dev

# 访问：http://localhost:5173
```

## Resources

- **完整设计文档**：`docs/DESIGN.md`
- **数据库脚本**：`backend/migrations/001_init.sql`
- **API文档**：待补充
- **部署文档**：待补充

## Contact

如有问题，请查看设计文档或联系项目负责人。
