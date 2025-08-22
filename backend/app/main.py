from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import inventory, bom, cost, production, data_import
from app.core.config import settings

app = FastAPI(
    title="银途工厂管理系统",
    description="库存优化与生产计划管理平台",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(data_import.router, prefix="/api/import", tags=["数据导入"])
app.include_router(inventory.router, prefix="/api/inventory", tags=["库存管理"])
app.include_router(bom.router, prefix="/api/bom", tags=["BOM管理"])
app.include_router(cost.router, prefix="/api/cost", tags=["成本分析"])
app.include_router(production.router, prefix="/api/production", tags=["生产管理"])

@app.get("/")
async def root():
    return {"message": "银途工厂管理系统 API", "version": "1.0.0"}