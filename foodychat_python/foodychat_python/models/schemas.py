from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class UserDetailsSchema(BaseModel):
    user_id: int
    user_name: Optional[str] = None  # 디폴트값 None 설정
    gender: int  # 1: 남성, 2: 여성
    age: int
    height: float
    user_weight: float
    health_goal: Optional[str] = None  # Optional 필드로 None 디폴트값 설정

class BMISchema(BaseModel):
    bmi_score: float = Field(..., example=22.5)  # 필수 필드로 설정하고, 예시값 설정
    reg_date: datetime = Field(..., example=datetime.now())  # 필수 필드로 설정하고, 예시값 설정

class MealSchema(BaseModel):
    food_name: str
    calories: float
    created_at: datetime

class FullUserProfileSchema(BaseModel):
    user_details: UserDetailsSchema
    latest_bmi: Optional[BMISchema] = None  # Optional 필드로 None 디폴트값 설정
    meals: List[MealSchema] = []  # 빈 리스트로 디폴트값 설정
