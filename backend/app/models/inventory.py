from sqlalchemy import Column, Integer, String, Float, DateTime, Date, Boolean, Text
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class InventoryItem(Base):
    __tablename__ = "inventory_items"
    
    id = Column(Integer, primary_key=True, index=True)
    item_code = Column(String(50), unique=True, index=True)
    item_name = Column(String(200))
    item_type = Column(String(20))
    warehouse_code = Column(String(50))
    warehouse_position = Column(String(100))
    quantity = Column(Float, default=0)
    unit = Column(String(20))
    unit_price = Column(Float, default=0)
    total_value = Column(Float, default=0)
    
    first_entry_date = Column(Date)
    last_transaction_date = Column(Date)
    aging_days = Column(Integer, default=0)
    aging_status = Column(String(20))
    
    supplier = Column(String(100))
    category = Column(String(50))
    specification = Column(Text)
    
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)

class BOMStructure(Base):
    __tablename__ = "bom_structure"
    
    id = Column(Integer, primary_key=True, index=True)
    product_code = Column(String(50), index=True)
    product_name = Column(String(200))
    component_code = Column(String(50), index=True)
    component_name = Column(String(200))
    quantity_required = Column(Float)
    unit = Column(String(20))
    level = Column(Integer)
    
    created_at = Column(DateTime, default=datetime.now)

class StagnantInventory(Base):
    __tablename__ = "stagnant_inventory"
    
    id = Column(Integer, primary_key=True, index=True)
    item_code = Column(String(50), index=True)
    item_name = Column(String(200))
    quantity = Column(Float)
    value = Column(Float)
    aging_days = Column(Integer)
    suggested_action = Column(String(50))
    matched_products = Column(Text)
    
    analysis_date = Column(Date, default=datetime.now().date)