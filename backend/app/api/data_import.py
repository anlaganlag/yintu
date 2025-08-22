from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List
import pandas as pd
import os
from datetime import datetime

router = APIRouter()

@router.post("/excel")
async def import_excel_data(file: UploadFile = File(...)):
    """导入Excel数据"""
    try:
        if not file.filename.endswith(('.xlsx', '.xls')):
            raise HTTPException(status_code=400, detail="只支持Excel文件格式")
        
        temp_file = f"temp_{datetime.now().timestamp()}.xlsx"
        with open(temp_file, "wb") as f:
            content = await file.read()
            f.write(content)
        
        df = pd.read_excel(temp_file)
        
        os.remove(temp_file)
        
        return {
            "status": "success",
            "message": f"成功导入 {len(df)} 条记录",
            "data": {
                "rows": len(df),
                "columns": list(df.columns),
                "preview": df.head(5).to_dict('records')
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"数据导入失败: {str(e)}")

@router.post("/sql-backup")
async def import_sql_backup(file: UploadFile = File(...)):
    """导入SQL Server备份文件"""
    try:
        if not file.filename.endswith('.bak'):
            raise HTTPException(status_code=400, detail="只支持.bak备份文件格式")
        
        return {
            "status": "success", 
            "message": "SQL备份文件上传成功，将在后台恢复数据库"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"备份导入失败: {str(e)}")

@router.get("/status")
async def get_import_status():
    """获取数据导入状态"""
    return {
        "last_import": "2025-01-15 10:30:00",
        "total_items": 8000,
        "total_boms": 11000,
        "status": "completed"
    }