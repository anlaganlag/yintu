from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "银途工厂管理系统"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    DATABASE_URL: str = "sqlite:///./factory_yintu.db"
    
    SECRET_KEY: str = "your-secret-key-here-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    REDIS_URL: str = "redis://localhost:6379"
    
    AGING_THRESHOLD_NORMAL: int = 30
    AGING_THRESHOLD_WARNING: int = 90
    AGING_THRESHOLD_CRITICAL: int = 180
    
    UPLOAD_DIR: str = "./uploads"
    
    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()