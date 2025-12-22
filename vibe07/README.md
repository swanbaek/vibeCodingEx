# 금시세 크롤러

한국금거래소(https://www.koreagoldx.co.kr/price/gold) 사이트에서 금시세 데이터를 수집하여 Excel 파일로 저장하는 Python 스크립트입니다.

## 파일 설명

- `gold_price_crawler.py` - 메인 크롤러 스크립트 (권장)
- `requirements.txt` - 필요한 Python 패키지 목록
- `gold_price_data_YYYYMMDD.xlsx` - 생성된 Excel 파일

## 사용 방법

### 1. 필수 패키지 설치

```bash
pip install -r requirements.txt
```

또는 개별 설치:

```bash
pip install requests pandas openpyxl
```

### 2. 스크립트 실행

```bash
python gold_price_crawler.py
```

### 3. 결과 확인

실행하면 `gold_price_data_YYYYMMDD.xlsx` 파일이 생성됩니다.

## 데이터 항목

Excel 파일에는 다음 정보가 포함됩니다:

- **고시날짜**: 금시세 고시 일시
- **매입가_순금(3.75g)**: 순금 3.75g 매입 가격
- **매도가_순금(3.75g)**: 순금 3.75g 매도 가격
- **매도가_18K**: 18K 금 매도 가격
- **매도가_14K**: 14K 금 매도 가격
- 기타 매입가 및 추가 정보

## 데이터 개수 변경

기본적으로 최근 100개의 데이터를 가져옵니다. 개수를 변경하려면 `gold_price_crawler.py` 파일의 `main()` 함수에서 다음 라인을 수정하세요:

```python
df = fetch_gold_price_data(num_records=100)  # 원하는 개수로 변경
```

## 주의사항

- 이 스크립트는 교육 및 개인 사용 목적으로 제작되었습니다.
- 과도한 요청은 서버에 부담을 줄 수 있으니 적절히 사용해주세요.
- API 구조가 변경되면 스크립트가 작동하지 않을 수 있습니다.

## 라이선스

개인 및 교육 목적으로 자유롭게 사용 가능합니다.
