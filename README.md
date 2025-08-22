# 银途工厂管理系统 MVP

库存优化与生产计划管理平台，专为银途工厂设计的MVP版本。

## 功能特性

### 1. 库龄分析模块
- 📊 实时库龄分布图表
- ⚠️ 呆滞物料自动识别（>90天标红）
- 📋 Excel报表导出
- 🔍 追溯真实库龄（排除调拨影响）

### 2. BOM智能匹配
- 🎯 呆滞料与成品BOM自动匹配
- 💡 生产方案智能推荐
- 📦 缺料清单自动生成
- 🏆 按利润率和呆滞价值排序

### 3. 生产看板
- 📅 看板式订单管理
- 📈 实时生产进度追踪
- 🕐 生产时间线
- 🎯 每日生产目标监控

### 4. 成本差异分析
- 💰 BOM成本 vs 实际成本对比
- 📊 成本结构可视化
- 📝 实际成本录入界面
- 🔍 差异预警机制

## 快速开始

### 方式一：Docker一键启动（推荐）
```bash
# 克隆项目
git clone <repository-url>
cd factory-yintu

# 启动所有服务
docker-compose up -d

# 访问应用
# 前端: http://localhost:3000
# 后端API: http://localhost:8000
```

### 方式二：本地开发环境

#### 后端启动
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

#### 前端启动
```bash
cd frontend  
npm install
npm start
```

## 系统架构

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   前端 React    │────│  后端 FastAPI   │────│  数据库 SQLite  │
│   Ant Design    │    │   + Pandas      │    │   + Redis       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 数据导入

### 支持的数据格式
- **库存数据**: Excel (.xlsx, .xls)
- **BOM数据**: Excel (.xlsx, .xls) 
- **SQL Server备份**: .bak文件（预留功能）

### 示例数据文件
- `7--SP货仓原材料-半成品库存明细--彭周全2025-8-.xlsx`
- `20--半年以上呆料报告--彭周全2025-8-19.xlsx`
- `P5033-J01-C1202成本250822.xlsx`

## 核心算法

### 库龄计算
```python
# 真实库龄计算（排除调拨）
真实入库日 = 追溯第一次入库记录（非调拨）
实际库龄 = 今天 - 真实入库日
```

### BOM匹配优先级
```python
优先级评分 = 呆滞料价值 * 0.4 + 成品利润率 * 0.6
```

### 库龄分类
- **正常**: 0-30天
- **关注**: 30-90天  
- **呆滞**: 90-180天
- **严重呆滞**: >180天

## API文档

启动后端服务后访问：`http://localhost:8000/docs`

## 技术栈

### 后端
- **FastAPI**: Web框架
- **SQLAlchemy**: ORM
- **Pandas**: 数据处理
- **Celery**: 异步任务
- **Redis**: 缓存

### 前端  
- **React**: 前端框架
- **Ant Design**: UI组件库
- **ECharts**: 图表库
- **Axios**: HTTP客户端

## 部署说明

### 最小化部署
```bash
# 仅启动核心功能
docker-compose up backend frontend
```

### 生产环境
- 配置.env环境变量
- 使用PostgreSQL替换SQLite
- 启用HTTPS
- 配置反向代理

## 开发计划

### ✅ Phase 1 - 已完成
- 项目架构搭建
- 核心功能开发
- 基础UI界面

### 🔄 Phase 2 - 进行中
- SQL Server备份文件导入
- 真实数据测试
- 性能优化

### 📋 Phase 3 - 待开发
- 用户权限管理
- 移动端适配
- 高级分析功能

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 技术支持

如有问题或建议，请联系开发团队。

---

**银途工厂管理系统 MVP v1.0** - 让库存管理更智能，让生产计划更高效！