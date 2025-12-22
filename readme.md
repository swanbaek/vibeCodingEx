# VibeCoding Study

이 저장소는 프런트엔드 학습을 위해 단계별로 진행한 실습 프로젝트들을 정리한 공간입니다.
각 디렉터리는 하나의 독립적인 학습 주제를 기준으로 구성되어 있습니다.

---

## 📁 프로젝트 구성

### 🔹 vibe01

- **기업 사이트(화장품) 만들기**
- 사용 기술: HTML, CSS, JavaScript
- 정적 웹사이트 구조 이해 및 기본 인터랙션 구현

### 🔹 vibe02

- **사과 게임 만들기**
- 사용 기술: HTML, CSS, JavaScript
- DOM 조작, 이벤트 처리, 간단한 게임 로직 구현

### 🔹 vibe03

- **개인 소개 페이지 만들기**
- 사용 기술: HTML, CSS, JavaScript
- 레이아웃 구성, 스타일링, 자기소개용 웹 페이지 제작

### 🔹 vibe04

- **YouTube 사이트 유사 UI 만들기 (CDN 방식 React)**
- 사용 기술: React (CDN), HTML, CSS
- React 컴포넌트 개념 및 CDN 기반 React 사용 경험

### 🔹 vibe04-react

- **YouTube 사이트 유사 UI 만들기 (CRA 방식 React)**
- 사용 기술: React (Create React App)
- 컴포넌트 구조화, 상태 관리, 실제 React 프로젝트 구조 이해


### 🔹 vibe05
- **vibe05 - 인스타그램 클론한 Lifegram UI및 기능 만들기**
- [좋아요,북마크,댓글, 스토리, 테마 기능] 
- 사용 기술: React (Create React App)
- LocalStorage사용 북마크/좋아요/테마(Light,Dark) 기능 포함시키기
- Vercel 서비스에 GitHub과 연동하여 Deploy 하기
- Live Demo
-- https://lifegram.vercel.app/


### 🔹 vibe06 (Frontend)
- **메모 앱 프런트엔드 구현**
- 사용 기술: React
- 주요 기능
  - 회원가입 / 로그인 UI
  - JWT 기반 인증 흐름 처리
  - 메모 생성 / 삭제 UI
  - 카드(Grid) 기반 레이아웃 구성
- 프런트엔드에서 API 연동 및 상태 흐름 이해

### 🔹 vibe06-api (Backend)
- **메모 앱 백엔드 API 서버**
- 사용 기술: Node.js, Express, Prisma, SQLite
- 주요 기능
  - 회원가입 / 로그인 API
  - JWT 인증 처리
  - 메모 CRUD API
  - Prisma ORM 기반 DB 설계 및 연동
- Frontend(vibe06)와 분리된 API 서버 구조 이해
- 추후 Supabase(PostgreSQL)로 확장 예정

---
### 🔹 vibe07
- **금 시세 크롤링 및 분석**
- [웹 크롤링 → 엑셀 저장 → 통계 → 시각화]  
- 사용 기술: Python, Pandas, OpenPyXL, Matplotlib / Seaborn
- 주요 기능
  - 한국금거래소 사이트에서 1년치 금 시세 데이터 수집
  - 엑셀 파일(`.xlsx`)로 데이터 저장
  - 평균, 최대/최소값, 중앙값, 표준편차 등 통계 계산
  - 라인차트, 히스토그램, 박스플롯 등 시각화 이미지 생성
- 학습 포인트
  - 웹 크롤링 실습
  - 엑셀 데이터 처리 및 통계 분석
  - 시각화 차트 생성 및 이미지 저장
- 결과물 예시
  - Excel 파일: `gold_price_1year_with_stats_20251222.xlsx`
  - 시각화 이미지: 
    - gold_price_timeseries.png - 시계열 추이
    - gold_price_boxplot.png - 박스플롯
    - gold_price_histogram.png - 히스토그램
    - gold_price_statistics_bar.png - 통계 요약
    - gold_price_monthly_average.png - 월별 평균
    - gold_price_correlation.png - 상관관계 히트맵
---

## ✨ 목적

- 프런트엔드 기초부터 React까지 단계적으로 학습
- 실습 중심의 프로젝트를 통해 웹 개발 흐름 이해
- HTML/CSS/JavaScript → React → Frontend + Backend 분리 구조 학습
- 실제 서비스와 유사한 인증·데이터 흐름 경험

---

## 📚 참고 도서

- **요즘 바이브 코딩 깃허브 코파일럿 31가지 프로그램 만들기**  
  박현규 저 | 골든래빗  
  https://www.yes24.com/product/goods/167428992

---

이 저장소는 학습 기록 및 학습 내용 정리를 위한 용도로 지속적으로 업데이트됩니다.