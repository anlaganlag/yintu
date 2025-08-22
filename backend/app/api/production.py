from fastapi import APIRouter
from typing import List, Dict
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/board/summary")
async def get_production_summary():
    """获取生产看板汇总"""
    return {
        "daily_plan": 4,
        "in_progress": 2, 
        "completed": 1,
        "completion_rate": 65
    }

@router.get("/orders/kanban")
async def get_kanban_orders():
    """获取看板订单数据"""
    return {
        "pending": [
            {
                "id": "PO003",
                "product": "成品C",
                "quantity": 75,
                "completed": 0,
                "deadline": "2025-01-25",
                "priority": "low"
            }
        ],
        "in_progress": [
            {
                "id": "PO001", 
                "product": "成品A",
                "quantity": 100,
                "completed": 65,
                "deadline": "2025-01-15",
                "priority": "high"
            },
            {
                "id": "PO002",
                "product": "成品B", 
                "quantity": 50,
                "completed": 20,
                "deadline": "2025-01-20",
                "priority": "medium"
            }
        ],
        "completed": [
            {
                "id": "PO004",
                "product": "成品D",
                "quantity": 30,
                "completed": 30,
                "deadline": "2025-01-10",
                "priority": "high"
            }
        ]
    }

@router.get("/timeline")
async def get_production_timeline():
    """获取生产时间线"""
    return {
        "events": [
            {
                "time": "08:00",
                "event": "PO004 成品D 生产完成",
                "status": "completed"
            },
            {
                "time": "10:30", 
                "event": "PO001 成品A 开始生产",
                "status": "in_progress"
            },
            {
                "time": "14:00",
                "event": "PO002 成品B 开始生产", 
                "status": "in_progress"
            },
            {
                "time": "16:00",
                "event": "PO003 成品C 计划生产",
                "status": "planned"
            }
        ]
    }