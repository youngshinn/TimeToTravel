from fastapi import FastAPI, Request, Depends, Query, HTTPException
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, JSONResponse
from sqlalchemy.orm import Session
from typing import List
from .database import SessionLocal, engine, Base, Accommodation, TouristSpot

app = FastAPI()

# 정적 파일 서빙
app.mount("/static", StaticFiles(directory="static"), name="static")

# 템플릿 설정
templates = Jinja2Templates(directory="app/templates")

# 데이터베이스 초기화
Base.metadata.create_all(bind=engine)

# 데이터베이스 세션 의존성 생성
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 루트 경로
@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

# 지역 소개 페이지
@app.get("/region_intro", response_class=HTMLResponse)
async def region_intro(request: Request):
    return templates.TemplateResponse("region_intro.html", {"request": request})

# 경로 페이지
@app.get("/route.html", response_class=HTMLResponse)
async def route(request: Request):
    return templates.TemplateResponse("route.html", {"request": request})

# 관광지 상세 정보 API (모달에서 호출되는 경로)
@app.get("/tourist_spot/{spot_id}", response_class=JSONResponse)
async def get_tourist_spot(spot_id: int, db: Session = Depends(get_db)):
    spot = db.query(TouristSpot).filter(TouristSpot.id == spot_id).first()

    if not spot:
        raise HTTPException(status_code=404, detail="Tourist spot not found")

    return {
        "id": spot.id,
        "name": spot.name,
        "address": spot.address,
        "contact_info": spot.contact_info,
        "click_count": spot.click_count
    }

# 클릭 수 증가 API
@app.post("/increment_click_count/{spot_id}")
async def increment_click_count(spot_id: int, db: Session = Depends(get_db)):
    spot = db.query(TouristSpot).filter(TouristSpot.id == spot_id).first()
    if not spot:
        raise HTTPException(status_code=404, detail="Tourist spot not found")

    spot.click_count += 1
    db.commit()
    
    return {"message": "Click count incremented"}

# 관광지 목록 및 가장 많이 클릭된 관광지 조회
@app.get("/tourist_spots", response_class=HTMLResponse)
async def tourist_spots(request: Request, category: List[str] = Query(["전체"], description="카테고리 리스트"), db: Session = Depends(get_db)):
    query = db.query(TouristSpot)
    
    # "전체"가 아닌 경우 필터링
    if category and "전체" not in category:
        query = query.filter(TouristSpot.category.in_(category))
    
    spots = query.all()

    # 가장 많이 클릭된 관광지 조회
    most_clicked_spots = db.query(TouristSpot).order_by(TouristSpot.click_count.desc()).limit(10).all()

    return templates.TemplateResponse("tourist_spots.html", {
        "request": request, 
        "spots": spots, 
        "most_clicked_spots": most_clicked_spots
    })

# 숙소 페이지 (검색 기능 추가)
@app.get("/recomanation", response_class=HTMLResponse)
async def recomandation(request: Request, search: str = None, type_filter: str = None, db: Session = Depends(get_db)):
    query = db.query(Accommodation)
    
    # 검색어가 있을 경우 필터링
    if search:
        query = query.filter(Accommodation.name.contains(search))
    
    # 유형 필터링
    if type_filter:
        if type_filter == '펜션':
            query = query.filter(Accommodation.type.like('%펜션%'))
        elif type_filter == '모텔':
            query = query.filter(Accommodation.type.like('%모텔%'))
        elif type_filter == '호텔':
            query = query.filter(Accommodation.type.like('%호텔%'))
        elif type_filter == '민박':
            query = query.filter(Accommodation.type.like('%민박%'))
    
    accommodations = query.all()
    
    return templates.TemplateResponse("recomanation.html", {
        "request": request, 
        "accommodations": accommodations, 
        "search": search
    })

# 자동 완성 엔드포인트 (최대 10개까지 제한)
@app.get("/autocomplete", response_class=JSONResponse)
async def autocomplete(query: str = Query(..., min_length=2), db: Session = Depends(get_db)):
    suggestions = db.query(Accommodation.name).filter(Accommodation.name.contains(query)).limit(10).all()
    suggestions_list = [s[0] for s in suggestions]
    return {"suggestions": suggestions_list}
