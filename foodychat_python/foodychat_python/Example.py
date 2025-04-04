# 데이터베이스 쿼리 예시(조회)
from crud.FoodDBHandler import query_foods
from DatabaseConnect import get_db

"""
    기초코드 남여구분(CM002) 조회 1번 코드
"""
db = db = next(get_db())
query = "SELECT * FROM common_code_details WHERE code_id = :code and detail_code = :code_dtl"
params = {"code": "CM002", "code_dtl": 1}
result = query_foods(db, query, params)
print(result)


from LLM_prompt import format_prompt, RAG_PROMPT
from LLM_model import ask_llm

context = "1. 김치는 발효 음식이며, 유산균이 풍부합니다. 2. 하루 권장 섭취량은 50g입니다."
question = "김치를 매일 먹는 것이 건강에 좋나요?"

full_prompt = format_prompt(RAG_PROMPT, context=context, question=question)
response = ask_llm(full_prompt)
print(response)