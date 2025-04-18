import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # OPENAI 키 설정
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    # 데이터베이스 연결 설정
    # "SQLALCHEMY_DATABASE_URI", "mysql+pymysql://root:각자비밀번호@localhost:3306/데이터베이스명" : 개인
    # "SQLALCHEMY_DATABASE_URI", "mysql+pymysql://root:서버비밀번호@localhost:3306/데이터베이스명" : 서버
    DB_URL: str = os.getenv("SQLALCHEMY_DATABASE_URI", "mysql+pymysql://root:dhforkwk96$@192.168.0.45:3306/foodychat")
    #DB_URL: str = os.getenv("SQLALCHEMY_DATABASE_URI", "mysql+pymysql://root:hu26792991@localhost:3306/proj")
    # Google Login API 설정
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your_secret_key")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    SQLALCHEMY_TRACK_MODIFICATIONS: bool = False

    def get_engine(cls):
        from sqlalchemy import create_engine
        return create_engine(cls.DB_URL)

settings = Settings()