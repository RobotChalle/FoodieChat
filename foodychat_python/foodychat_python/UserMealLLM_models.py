from pydantic import BaseModel
from typing import List

class Meal(BaseModel):
    meal_date: str
    meal_type_nm: str
    meal_text: str

class MealQueryRequest(BaseModel):
    query: str
    meals: List[Meal]
