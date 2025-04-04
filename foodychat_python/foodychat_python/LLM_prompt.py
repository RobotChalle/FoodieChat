# 대표적인 RAG 기반 프롬프트 예시
# DB에서 가져온 정보를 기반으로 관련 정보를 검색하고, 이를 활용하여 자연스러운 답변을 생성
RAG_PROMPT: str = """
당신은 사용자가 제공한 정보와 DB에서 추출한 정보를 바탕으로 답변하는 전문가입니다.
다음 정보를 기반으로 질문에 답해주세요:
{context}

질문: {question}
"""
# 유저의 최근 데이터를 반영하는 개인화 프롬프트
PRIVATE_PROMPT: str = """"""
# 유저의 건강 목표 기반 조언 프롬프트
HEALTH_PROMPT: str = """"""
# 사용자 프로필 데이터를 반영한 응답
PROFILE_PROMPT: str = """"""

# 프롬프트를 동적으로 포맷팅하는 함수
def format_prompt(template: str, **kwargs) -> str:
    return template.format(**kwargs)