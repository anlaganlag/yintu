import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import List, Dict, Optional
import pyodbc
import subprocess
import os

class DataProcessor:
    def __init__(self):
        self.aging_thresholds = {
            'normal': 30,
            'warning': 90,
            'critical': 180
        }
    
    def restore_sql_backup(self, bak_file_path: str) -> bool:
        """恢复SQL Server备份文件"""
        try:
            connection_string = (
                "Driver={SQL Server};"
                "Server=localhost;"
                "Database=master;"
                "Trusted_Connection=yes;"
            )
            
            restore_query = f"""
            RESTORE DATABASE YintuFactory 
            FROM DISK = '{bak_file_path}'
            WITH REPLACE, 
            MOVE 'YintuFactory' TO 'C:\\SQLData\\YintuFactory.mdf',
            MOVE 'YintuFactory_log' TO 'C:\\SQLData\\YintuFactory_log.ldf'
            """
            
            with pyodbc.connect(connection_string) as conn:
                cursor = conn.cursor()
                cursor.execute(restore_query)
                conn.commit()
            return True
        except Exception as e:
            print(f"备份恢复失败: {e}")
            return False
    
    def process_excel_inventory(self, file_path: str) -> pd.DataFrame:
        """处理库存Excel文件"""
        df = pd.read_excel(file_path, skiprows=1)
        
        df.columns = [
            'item_code', 'item_name', 'specification', 'unit',
            'warehouse', 'position', 'quantity', 'unit_price', 
            'total_value', 'last_transaction_date', 'supplier'
        ]
        
        df['last_transaction_date'] = pd.to_datetime(df['last_transaction_date'], errors='coerce')
        df['aging_days'] = (datetime.now() - df['last_transaction_date']).dt.days
        
        df['aging_status'] = df['aging_days'].apply(self._classify_aging)
        
        return df
    
    def _classify_aging(self, days: int) -> str:
        """分类库龄状态"""
        if pd.isna(days):
            return '未知'
        elif days <= self.aging_thresholds['normal']:
            return '正常'
        elif days <= self.aging_thresholds['warning']:
            return '关注'
        elif days <= self.aging_thresholds['critical']:
            return '呆滞'
        else:
            return '严重呆滞'
    
    def calculate_real_aging(self, df: pd.DataFrame) -> pd.DataFrame:
        """计算真实库龄（追溯首次入库）"""
        df_sorted = df.sort_values(['item_code', 'last_transaction_date'])
        
        first_entry = df_sorted.groupby('item_code')['last_transaction_date'].first().reset_index()
        first_entry.columns = ['item_code', 'first_entry_date']
        
        df = df.merge(first_entry, on='item_code', how='left')
        df['real_aging_days'] = (datetime.now() - df['first_entry_date']).dt.days
        
        return df
    
    def match_bom_with_stagnant(self, stagnant_items: pd.DataFrame, 
                                bom_df: pd.DataFrame) -> List[Dict]:
        """匹配呆滞料与BOM"""
        matches = []
        
        for _, item in stagnant_items.iterrows():
            possible_products = bom_df[bom_df['component_code'] == item['item_code']]
            
            for _, product in possible_products.iterrows():
                components_needed = bom_df[bom_df['product_code'] == product['product_code']]
                
                available_quantity = self._calculate_producible_quantity(
                    item['quantity'], 
                    product['quantity_required'],
                    components_needed,
                    stagnant_items
                )
                
                if available_quantity > 0:
                    profit_rate = self._estimate_profit_rate(product['product_code'])
                    priority_score = (
                        item['value'] * 0.4 +
                        profit_rate * 0.6
                    )
                    
                    matches.append({
                        'stagnant_item': item['item_code'],
                        'stagnant_quantity': item['quantity'],
                        'stagnant_value': item['value'],
                        'product_code': product['product_code'],
                        'product_name': product['product_name'],
                        'producible_quantity': available_quantity,
                        'priority_score': priority_score
                    })
        
        return sorted(matches, key=lambda x: x['priority_score'], reverse=True)
    
    def _calculate_producible_quantity(self, available_qty: float, 
                                       required_qty: float,
                                       all_components: pd.DataFrame,
                                       inventory: pd.DataFrame) -> int:
        """计算可生产数量"""
        if required_qty == 0:
            return 0
        
        max_producible = int(available_qty / required_qty)
        
        for _, component in all_components.iterrows():
            comp_inventory = inventory[inventory['item_code'] == component['component_code']]
            if not comp_inventory.empty:
                comp_available = comp_inventory.iloc[0]['quantity']
                comp_max = int(comp_available / component['quantity_required'])
                max_producible = min(max_producible, comp_max)
        
        return max_producible
    
    def _estimate_profit_rate(self, product_code: str) -> float:
        """估算产品利润率（简化版）"""
        return np.random.uniform(0.1, 0.3)
    
    def generate_aging_report(self, df: pd.DataFrame) -> Dict:
        """生成库龄分析报告"""
        report = {
            'summary': {
                'total_items': len(df),
                'total_value': df['total_value'].sum(),
                'aging_distribution': df.groupby('aging_status').agg({
                    'item_code': 'count',
                    'total_value': 'sum'
                }).to_dict()
            },
            'critical_items': df[df['aging_status'].isin(['呆滞', '严重呆滞'])].to_dict('records'),
            'top_value_stagnant': df[df['aging_days'] > 90].nlargest(10, 'total_value').to_dict('records')
        }
        
        return report