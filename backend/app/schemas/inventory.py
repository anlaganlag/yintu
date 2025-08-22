from pydantic import BaseModel
from typing import Optional, List
from datetime import date

class InventoryAgingResponse(BaseModel):
    item_code: str
    item_name: str
    quantity: float
    value: float
    aging_days: int
    aging_status: str
    warehouse: str
    suggested_action: Optional[str] = None

class StagnantItemResponse(BaseModel):
    items: List[InventoryAgingResponse]
    total_value: float