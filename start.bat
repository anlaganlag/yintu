@echo off
echo ===========================================
echo Factory Yintu Management System MVP
echo ===========================================

echo Checking Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo Docker not found, trying local startup...
    goto local_start
) else (
    echo Docker found, starting with Docker...
    goto docker_start
)

:docker_start
echo Starting Docker containers...
docker-compose up -d
echo.
echo Waiting for services to start...
timeout /t 10 /nobreak
echo.
echo ===========================================
echo System started successfully!
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:8000/docs
echo ===========================================
pause
exit

:local_start
echo Local startup mode...
echo Please make sure Python and Node.js are installed
echo.
echo 1. Open new command window
echo 2. Go to backend folder and run: pip install -r requirements.txt
echo 3. Then run: uvicorn app.main:app --reload --port 8000
echo.
echo 4. Open another command window
echo 5. Go to frontend folder and run: npm install
echo 6. Then run: npm start
echo.
echo See startup guide for details
echo ===========================================
pause