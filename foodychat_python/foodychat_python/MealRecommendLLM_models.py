from pydantic import BaseModel
from typing import List

class MealRequest(BaseModel):
    start: str
    end: str
    types: List[str]
    health_goal: str
    gender:str
    age: int
    height: float
    user_weight: float