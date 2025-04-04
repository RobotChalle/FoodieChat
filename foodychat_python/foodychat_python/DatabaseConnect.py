# SQLAlchemy 모듈 import
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from Config import settings  # 설정값 불러오기

# 데이터베이스 엔진 생성 (DB 연결용)
engine = settings.get_engine()

# 세션 팩토리 생성 (세션 인스턴스를 만들어주는 클래스)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 의존성 주입용 DB 세션 함수 (FastAPI 등에서 사용)
def get_db():
    """데이터베이스 세션을 제공하는 종속성 함수
    요청 시 DB 세션을 생성하고, 요청 처리 후 세션을 종료함
    """
    db = SessionLocal()  # 세션 생성
    try:
        yield db  # 세션을 호출한 곳에 반환
    finally:
        db.close()  # 요청 종료 후 세션 종료