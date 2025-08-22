from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List, Dict
import pandas as pd
from app.services.data_processor import DataProcessor
from app.schemas.inventory import InventoryAgingResponse, StagnantItemResponse
import os
from datetime import datetime

router = APIRouter()
processor = DataProcessor()

@router.post("/aging/analyze")
async def analyze_inventory_aging(file: UploadFile = File(...)):
    """分析库存库龄"""
    try:
        temp_file = f"temp_{datetime.now().timestamp()}.xlsx"
        with open(temp_file, "wb") as f:
            content = await file.read()
            f.write(content)
        
        df = processor.process_excel_inventory(temp_file)
        df = processor.calculate_real_aging(df)
        report = processor.generate_aging_report(df)
        
        os.remove(temp_file)
        
        return {
            "status": "success",
            "data": report
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/aging/distribution")
async def get_aging_distribution():
    """获取库龄分布数据"""
    mock_data = {
        "categories": ["0-30天", "30-90天", "90-180天", ">180天"],
        "counts": [2000, 3000, 2000, 1000],
        "values": [500000, 800000, 600000, 400000]
    }
    return mock_data

@router.get("/stagnant/list")
async def get_stagnant_items(threshold_days: int = 90):
    """获取呆滞物料清单"""
    mock_items = [
        {
            "item_code": "RM001",
            "item_name": "原材料A",
            "quantity": 1000,
            "value": 50000,
            "aging_days": 120,
            "warehouse": "SP01",
            "suggested_action": "生产成品"
        },
        {
            "item_code": "RM002",
            "item_name": "原材料B",
            "quantity": 500,
            "value": 30000,
            "aging_days": 200,
            "warehouse": "SP02",
            "suggested_action": "清理销毁"
        }
    ]
    return {"items": mock_items, "total_value": 80000}

@router.post("/export/excel")
async def export_aging_report():
    """导出库龄分析Excel报表"""
    try:
        file_name = f"aging_report_{datetime.now().strftime('%Y%m%d')}.xlsx"
        file_path = f"exports/{file_name}"
        
        df = pd.DataFrame({
            '物料编号': ['RM001', 'RM002'],
            '物料名称': ['原材料A', '原材料B'],
            '库存数量': [1000, 500],
            '库存价值': [50000, 30000],
            '库龄天数': [120, 200],
            '库龄状态': ['呆滞', '严重呆滞']
        })
        
        os.makedirs('exports', exist_ok=True)
        df.to_excel(file_path, index=False)
        
        return {
            "status": "success",
            "file_path": file_path,
            "download_url": f"/api/download/{file_name}"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))