from fastapi import APIRouter, HTTPException, UploadFile, File
from typing import List, Dict
import pandas as pd
from app.services.data_processor import DataProcessor

router = APIRouter()
processor = DataProcessor()

@router.post("/match/stagnant")
async def match_stagnant_with_bom(
    stagnant_file: UploadFile = File(...),
    bom_file: UploadFile = File(...)
):
    """匹配呆滞料与BOM"""
    try:
        stagnant_df = pd.read_excel(await stagnant_file.read())
        bom_df = pd.read_excel(await bom_file.read())
        
        matches = processor.match_bom_with_stagnant(stagnant_df, bom_df)
        
        return {
            "status": "success",
            "matches": matches[:20],
            "total_matches": len(matches)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/match/suggestions")
async def get_production_suggestions():
    """获取生产建议"""
    suggestions = [
        {
            "priority": 1,
            "product_code": "FG001",
            "product_name": "成品A",
            "stagnant_consumed": ["RM001", "RM003"],
            "stagnant_value_cleared": 80000,
            "producible_quantity": 100,
            "profit_estimate": 120000,
            "missing_materials": []
        },
        {
            "priority": 2,
            "product_code": "FG002",
            "product_name": "成品B",
            "stagnant_consumed": ["RM002"],
            "stagnant_value_cleared": 30000,
            "producible_quantity": 50,
            "profit_estimate": 45000,
            "missing_materials": ["RM010"]
        }
    ]
    return {"suggestions": suggestions}

@router.get("/shortage/list")
async def get_shortage_list(product_code: str):
    """获取缺料清单"""
    shortage_items = [
        {
            "component_code": "RM010",
            "component_name": "辅料X",
            "required_quantity": 100,
            "available_quantity": 20,
            "shortage_quantity": 80,
            "unit": "KG"
        }
    ]
    return {
        "product_code": product_code,
        "shortage_items": shortage_items,
        "can_produce": False
    }

@router.get("/structure/{product_code}")
async def get_bom_structure(product_code: str):
    """获取BOM结构"""
    structure = {
        "product_code": product_code,
        "product_name": "成品A",
        "components": [
            {
                "level": 1,
                "code": "SF001",
                "name": "半成品1",
                "quantity": 2,
                "components": [
                    {
                        "level": 2,
                        "code": "RM001",
                        "name": "原材料A",
                        "quantity": 5
                    },
                    {
                        "level": 2,
                        "code": "RM002",
                        "name": "原材料B",
                        "quantity": 3
                    }
                ]
            }
        ]
    }
    return structure