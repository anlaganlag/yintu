@echo off
cd /d "D:\factory-yintu\backend"
echo Installing Python dependencies...
pip install -r requirements.txt
echo Starting backend server...
uvicorn app.main:app --reload --port 8000
pause