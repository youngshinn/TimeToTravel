from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os
load_dotenv()

# MySQL 데이터베이스 연결
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# 숙소 모델 정의
class Accommodation(Base):
    __tablename__ = "room"
    name = Column(String(255), primary_key=True, index=True)
    type = Column(String(100))
    rooms = Column(Integer)
    address = Column(String(255))
    phone = Column(String(20))

# 관광지 모델 정의 (tourist_spots 테이블 반영)
class TouristSpot(Base):
    __tablename__ = "tourist_spots"  # 테이블 이름 수정

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String(255))
    name = Column(String(255))
    address = Column(String(255))
    contact_info = Column(String(255))
    click_count = Column(Integer, default=0)

# 데이터베이스에 테이블 생성
Base.metadata.create_all(bind=engine)
