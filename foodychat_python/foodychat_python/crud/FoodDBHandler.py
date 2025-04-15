from sqlalchemy.orm import Session
from sqlalchemy.sql import text
from models import schemas
from models import models  # SQLAlchemy 모델

# 사용자 쿼리 기반 CRUD 수행
def query_foods(db: Session, query: str, params: dict = {}):
    """
    사용자가 입력한 SQL 쿼리와 파라미터를 실행하는 함수

    - SELECT 문: 결과를 반환함 (fetchall)
    - INSERT, UPDATE, DELETE 문: 실행 후 commit 및 성공 메시지 반환
    - 오류 발생 시: rollback 후 에러 메시지 반환

    Args:
        db (Session): 데이터베이스 세션
        query (str): 실행할 SQL 쿼리문
        params (dict): 바인딩할 파라미터 딕셔너리
    """
    try:
        result = db.execute(text(query), params)  # SQL 쿼리 실행 + 파라미터 바인딩
        if result.returns_rows:
            return result.fetchall()  # SELECT 문 결과 반환
        else:
            db.commit()  # DML 문인 경우 커밋
            return {"message": "Query executed successfully."}
    except Exception as e:
        db.rollback()  # 오류 발생 시 롤백
        return {"error": str(e)}  # 에러 메시지 반환

def get_user_details(db: Session, user_id: int):
    return db.query(models.UserDetails).filter(models.UserDetails.user_id == user_id).first()

def get_bmi_history(db: Session, user_id: int):
    return db.query(models.BMIHistory).filter(models.BMIHistory.user_id == user_id).order_by(models.BMIHistory.reg_date.desc()).limit(3).all()

def get_uploaded_foods(db: Session, user_id: int):
    return db.query(models.Foods).filter(models.Foods.reg_id == user_id).order_by(models.Foods.created_at.desc()).limit(3).all()
