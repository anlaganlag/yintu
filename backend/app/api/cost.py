from fastapi import APIRouter, HTTPException
from typing import List, Dict
from pydantic import BaseModel

router = APIRouter()

class CostInput(BaseModel):
    product_code: str
    material_cost: float
    labor_cost: float
    overhead_cost: float
    other_cost: float = 0

@router.post("/actual/record")
async def record_actual_cost(cost_data: CostInput):
    """录入实际成本"""
    try:
        total_cost = cost_data.material_cost + cost_data.labor_cost + cost_data.overhead_cost + cost_data.other_cost
        
        return {
            "status": "success",
            "message": "实际成本录入成功",
            "data": {
                "product_code": cost_data.product_code,
                "total_actual_cost": total_cost
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/comparison/{product_code}")
async def get_cost_comparison(product_code: str):
    """获取成本对比分析"""
    mock_data = {
        "product_code": product_code,
        "bom_cost": {
            "material": 80,
            "labor": 30,
            "overhead": 20,
            "total": 130
        },
        "actual_cost": {
            "material": 85,
            "labor": 35,
            "overhead": 25,
            "total": 145
        },
        "variance": {
            "material": 5,
            "labor": 5,
            "overhead": 5,
            "total": 15,
            "percentage": 11.5
        }
    }
    return mock_data

@router.get("/analysis/summary")
async def get_cost_analysis_summary():
    """获取成本分析汇总"""
    return {
        "total_products": 2,
        "avg_variance_rate": 7.75,
        "over_threshold_count": 1,
        "cost_control_rate": 50,
        "monthly_trend": [5.2, 6.8, 7.75, 8.1, 7.3]
    }