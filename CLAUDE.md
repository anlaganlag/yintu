# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Factory management system for Yintu factory, focused on inventory optimization and production planning. The system integrates with existing ERP data to provide management visibility into operations.

## Core Requirements

1. **Inventory Age Analysis**: Calculate actual storage duration from initial warehousing date (not last transaction date). Must account for warehouse transfers that incorrectly reset aging in current system.

2. **BOM-based Production Matching**: Match stagnant inventory (>6 months) against BOMs to identify producible finished goods for clearance sales. Focus on non-generic materials linked to specific orders.

3. **Cost Structure Analysis**: Compare actual product costs (materials + labor) against BOM theoretical costs to identify discrepancies.

4. **Production Planning Dashboard**: Real-time visualization of production status matched against customer orders.

## Data Model

### Inventory Items
- **Raw Materials (物項)**: ~8,000 items
- **Semi-finished/Finished (BOM)**: ~11,000 items
- **Stagnant Threshold**: 6 months (呆料)

### Key Fields
- Item Number (物項編號)
- Warehouse Position (倉位/儲位)
- Actual Inventory (實際庫存)
- Last Transaction Date (最後交易日)
- Item Type (物項類型): "BOM" or "物項"

### Data Challenges
- BOM complexity: ~300 lines per product
- Legacy items: Discontinued products not properly deprecated
- Transaction dates include transfers, masking true aging

## System Context

- **ERP Integration**: Direct database access required for analysis
- **SANDAL**: Current system manager at Yintu
- **Report Customization**: Reports must be tailored to specific user roles