from pydantic import BaseModel
from typing import List

class Store(BaseModel):
    name: str
    real_address: str  # ✅ 지도용 주소 (도로명 or 지번)
    url: str           # ✅ 클릭 링크용 (네이버, 식신, 다이닝코드)
    rating: float
    review: str


class StoreRequest(BaseModel):
    food: str
    location: str
    stores: List[Store]