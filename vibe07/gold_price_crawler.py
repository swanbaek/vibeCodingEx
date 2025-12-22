"""
한국금거래소 금시세 크롤러
https://www.koreagoldx.co.kr/price/gold 사이트에서 금시세 데이터를 수집하여 Excel 파일로 저장합니다.
"""

import requests
import pandas as pd
from datetime import datetime, timedelta


def fetch_gold_price_data():
    """
    한국금거래소 API로부터 1년치 금시세 데이터를 가져옵니다.
    
    Returns:
        pandas.DataFrame: 금시세 데이터
    """
    # API 엔드포인트
    api_url = "https://www.koreagoldx.co.kr/api/price/chart/list"
    
    # HTTP 헤더
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': 'https://www.koreagoldx.co.kr/price/gold'
    }
    
    # 날짜 범위 설정 (최근 1년)
    today = datetime.now()
    one_year_ago = today - timedelta(days=365)
    
    # API 요청 페이로드
    payload = {
        'srchDt': '1Y',
        'type': 'A',
        'dataDateStart': one_year_ago.strftime('%Y.%m.%d'),
        'dataDateEnd': today.strftime('%Y.%m.%d')
    }
    
    print(f"1년치 금시세 데이터 가져오는 중...")
    print(f"기간: {one_year_ago.strftime('%Y.%m.%d')} ~ {today.strftime('%Y.%m.%d')}")
    
    # API 호출
    response = requests.post(api_url, json=payload, headers=headers)
    response.raise_for_status()
    
    # JSON 데이터 파싱
    data = response.json()
    gold_data = data.get('list', data.get('data', data))
    
    if not gold_data:
        raise ValueError("응답에서 데이터를 찾을 수 없습니다.")
    
    # DataFrame 생성 (1년치 전체 데이터)
    df = pd.DataFrame(gold_data)
    
    # 컬럼명 한글로 매핑
    column_mapping = {
        'date': '고시날짜',
        's_pure': '매입가_순금(3.75g)',
        'p_pure': '매도가_순금(3.75g)',
        'p_18k': '매도가_18K',
        'p_14k': '매도가_14K',
        's_18k': '매입가_18K',
        's_14k': '매입가_14K'
    }
    
    df.rename(columns={k: v for k, v in column_mapping.items() if k in df.columns}, inplace=True)
    
    return df


def save_to_excel(df, filename=None):
    """
    DataFrame을 Excel 파일로 저장합니다.
    
    Args:
        df (pandas.DataFrame): 저장할 데이터
        filename (str): 파일명 (기본값: gold_price_data_YYYYMMDD.xlsx)
    """
    if filename is None:
        today_str = datetime.now().strftime('%Y%m%d')
        filename = f'gold_price_1year_{today_str}.xlsx'
    
    df.to_excel(filename, index=False, engine='openpyxl')
    print(f"\n✓ {len(df)}개의 데이터가 '{filename}' 파일로 저장되었습니다.")
    
    return filename


def main():
    """메인 실행 함수"""
    try:
        # 1년치 금시세 데이터 가져오기
        df = fetch_gold_price_data()
        
        print(f"✓ {len(df)}개의 데이터를 성공적으로 가져왔습니다.")
        print(f"컬럼: {', '.join(df.columns)}")
        
        # Excel 파일로 저장
        filename = save_to_excel(df)
        
        # 데이터 통계
        print("\n데이터 통계:")
        print(f"총 데이터 개수: {len(df)}개")
        if '고시날짜' in df.columns:
            print(f"기간: {df['고시날짜'].iloc[-1]} ~ {df['고시날짜'].iloc[0]}")
        
        # 데이터 미리보기
        print("\n최근 데이터 5개:")
        print(df[['고시날짜', '매입가_순금(3.75g)', '매도가_순금(3.75g)', '매도가_18K', '매도가_14K']].head(5).to_string(index=False))
        
        return filename
        
    except Exception as e:
        print(f"✗ 오류 발생: {str(e)}")
        import traceback
        traceback.print_exc()
        return None


if __name__ == "__main__":
    main()
