from sqlalchemy import Column, Integer, String
from DataBase import Base

class Food(Base):
    __tablename__ = "foods"

    food_id = Column(Integer, primary_key=True, index=True)
    food_name = Column(String(100), nullable=False)
