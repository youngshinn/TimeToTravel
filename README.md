
# Time To Travel: 단양 여행 웹사이트 🗺️

**Time To Travel**은 사용자에게 단양 지역의 관광지, 숙소, 추천 여행 코스를 안내하는 여행 웹사이트입니다.  
관광지 정보를 실시간으로 추천하고, 지도에 시각화하여 여행 계획을 쉽게 세울 수 있도록 도와줍니다.

---

##  주요 기능

- **관광지 추천**
  - 카테고리별로 단양 지역의 관광지 추천
  - 관광지 클릭 수를 기반으로 인기 순위 제공
- **지도 시각화**
  - Kakao Maps API를 통해 관광지, 숙소, 경로 시각화
- **숙소 검색 및 필터**
  - 숙소 이름 검색 및 자동완성 기능
  - 호텔, 펜션, 모텔, 민박 등 필터링 제공
- **추천 여행 경로**
  - 당일치기부터 2박 3일까지 여행 경로 추천
- **실시간 검색 및 통합 테스트 완료**

---

##  사용 기술 스택

###  Backend
- Python
- FastAPI
- SQLAlchemy
- MySQL

###  Frontend
- HTML/CSS
- JavaScript
- Jinja2
- Kakao Maps API

---

## 실행 방법

### 1. 환경설정

`.env` 파일 생성 후 다음과 같이 설정:

```env
DATABASE_URL=mysql+mysqlconnector://<root>:<password>@<127.0.0.1>:3306/roominfo
```

### 2. 의존성 설치

```bash
pip install -r requirements.txt
```

### 3. FastAPI 실행

```bash
uvicorn main:app --reload
```

### 4. 웹사이트 접속

브라우저에서 다음 주소로 접속:

```
http://127.0.0.1:8000
```

---

##  폴더 구조 

```bash
project2/
├── main.py                # FastAPI 실행 파일
├── templates/             # Jinja2 템플릿 (HTML)
├── static/                # CSS, JS, 이미지 등 정적 파일
├── database.py            # DB 연결 설정
├── models.py              # SQLAlchemy 모델 정의
├── routes/                # 기능별 라우터
│   ├── tourist.py
│   └── accommodation.py
├── .env                   # 환경변수 파일
└── requirements.txt       # 필요한 패키지 목록
```

---

##  ERD (데이터베이스 구성 요약)

- **TouristSpot**
  - 이름, 설명, 카테고리, 위치 좌표, 클릭 수
- **Accommodation**
  - 숙소명, 주소, 가격, 숙소 타입, 평점
- **추천경로**
  - 관광지 리스트와 함께 일자별 여행 일정 구성

---

##  팀원 소개

- 안성준
- 이경석
- 최대훈
- 조영신

---

## 느낀점 & 시사점

- 사용자 중심의 여행 설계 플랫폼 개발 경험
- FastAPI 기반의 빠른 서버 구축 경험
- Kakao Maps API 활용한 시각화 기술 습득

---
