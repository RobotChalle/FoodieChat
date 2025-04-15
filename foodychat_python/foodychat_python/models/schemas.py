from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class UserDetails(BaseModel):
    user_id: int
    gender: int
    age: int
    user_weight: float
    height: float
    user_address: Optional[str]
    health_goal: int

class BMIHistory(BaseModel):
    bmi_score: float
    user_weight: float
    height: float
    reg_date: datetime

class FoodHistory(BaseModel):
    food_name: str
    calories: float
    created_at: datetime
