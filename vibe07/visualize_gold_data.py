"""
금시세 데이터 시각화
여러 종류의 차트를 PNG 파일로 저장
"""

import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
from matplotlib import font_manager
import seaborn as sns
import numpy as np
from datetime import datetime
import platform

# 한글 폰트 설정
def set_korean_font():
    """운영체제에 맞는 한글 폰트 설정"""
    import matplotlib.font_manager as fm
    import os
    
    system = platform.system()
    
    if system == 'Windows':
        # Windows 시스템 폰트 경로에서 직접 찾기
        font_paths = [
            'C:\\Windows\\Fonts\\malgun.ttf',
            'C:\\Windows\\Fonts\\malgunbd.ttf',
            'C:\\Windows\\Fonts\\gulim.ttc',
            'C:\\Windows\\Fonts\\batang.ttc'
        ]
        
        for font_path in font_paths:
            if os.path.exists(font_path):
                font_prop = fm.FontProperties(fname=font_path)
                plt.rcParams['font.family'] = font_prop.get_name()
                print(f"한글 폰트 설정: {font_prop.get_name()} ({font_path})")
                break
        else:
            print("경고: 한글 폰트를 찾을 수 없습니다.")
    
    elif system == 'Darwin':  # macOS
        font_list = ['AppleGothic', 'Arial Unicode MS']
        available_fonts = [f.name for f in fm.fontManager.ttflist]
        for font in font_list:
            if font in available_fonts:
                plt.rcParams['font.family'] = font
                print(f"한글 폰트 설정: {font}")
                break
    
    else:  # Linux
        font_list = ['NanumGothic', 'DejaVu Sans']
        available_fonts = [f.name for f in fm.fontManager.ttflist]
        for font in font_list:
            if font in available_fonts:
                plt.rcParams['font.family'] = font
                print(f"한글 폰트 설정: {font}")
                break
    
    # 마이너스 기호 깨짐 방지
    plt.rcParams['axes.unicode_minus'] = False

# 폰트 설정 적용
set_korean_font()

# 데이터 읽기
filename = 'gold_price_1year_20251222.xlsx'
print(f"'{filename}' 파일을 읽는 중...")

df = pd.read_excel(filename)
print(f"✓ {len(df)}개의 데이터 로드 완료\n")

# 날짜 컬럼을 datetime으로 변환
df['고시날짜'] = pd.to_datetime(df['고시날짜'])

# 데이터 정렬 (날짜 오름차순)
df_sorted = df.sort_values('고시날짜')

# 시각화 스타일 설정
sns.set_style("whitegrid")
plt.rcParams['figure.figsize'] = (12, 6)

print("시각화 생성 중...\n")

# 1. 시계열 그래프 - 순금 매입가/매도가 추이
print("1. 시계열 그래프 생성 중...")
fig, ax = plt.subplots(figsize=(14, 7))

ax.plot(df_sorted['고시날짜'], df_sorted['매입가_순금(3.75g)'], 
        label='매입가 (순금 3.75g)', linewidth=2, color='#FF6B6B', alpha=0.8)
ax.plot(df_sorted['고시날짜'], df_sorted['매도가_순금(3.75g)'], 
        label='매도가 (순금 3.75g)', linewidth=2, color='#4ECDC4', alpha=0.8)

ax.set_xlabel('날짜', fontsize=12, fontweight='bold')
ax.set_ylabel('가격 (원)', fontsize=12, fontweight='bold')
ax.set_title('1년간 순금 시세 추이 (3.75g 기준)', fontsize=16, fontweight='bold', pad=20)
ax.legend(fontsize=11, loc='upper left')
ax.grid(True, alpha=0.3)
ax.xaxis.set_major_formatter(mdates.DateFormatter('%Y-%m'))
plt.xticks(rotation=45)
plt.tight_layout()
plt.savefig('images/gold_price_timeseries.png', dpi=300, bbox_inches='tight')
plt.close()
print("  ✓ images/gold_price_timeseries.png 저장 완료")

# 2. 박스플롯 - 가격 분포 비교
print("2. 박스플롯 생성 중...")
fig, ax = plt.subplots(figsize=(12, 7))

data_to_plot = [
    df['매입가_순금(3.75g)'],
    df['매도가_순금(3.75g)'],
    df['매도가_18K'],
    df['매도가_14K']
]
labels = ['매입가\n순금', '매도가\n순금', '매도가\n18K', '매도가\n14K']

bp = ax.boxplot(data_to_plot, labels=labels, patch_artist=True,
                notch=True, showmeans=True)

colors = ['#FF6B6B', '#4ECDC4', '#95E1D3', '#F38181']
for patch, color in zip(bp['boxes'], colors):
    patch.set_facecolor(color)
    patch.set_alpha(0.7)

ax.set_ylabel('가격 (원)', fontsize=12, fontweight='bold')
ax.set_title('금시세 가격 분포 비교', fontsize=16, fontweight='bold', pad=20)
ax.grid(True, alpha=0.3, axis='y')
plt.tight_layout()
plt.savefig('images/gold_price_boxplot.png', dpi=300, bbox_inches='tight')
plt.close()
print("  ✓ images/gold_price_boxplot.png 저장 완료")

# 3. 히스토그램 - 순금 매입가 분포
print("3. 히스토그램 생성 중...")
fig, ax = plt.subplots(figsize=(12, 7))

n, bins, patches = ax.hist(df['매입가_순금(3.75g)'], bins=30, 
                            color='#FF6B6B', alpha=0.7, edgecolor='black')

# 평균선 추가
mean_val = df['매입가_순금(3.75g)'].mean()
ax.axvline(mean_val, color='red', linestyle='--', linewidth=2, 
          label=f'평균: {mean_val:,.0f}원')

# 중앙값 추가
median_val = df['매입가_순금(3.75g)'].median()
ax.axvline(median_val, color='blue', linestyle='--', linewidth=2, 
          label=f'중앙값: {median_val:,.0f}원')

ax.set_xlabel('가격 (원)', fontsize=12, fontweight='bold')
ax.set_ylabel('빈도', fontsize=12, fontweight='bold')
ax.set_title('순금 매입가 분포 (3.75g)', fontsize=16, fontweight='bold', pad=20)
ax.legend(fontsize=11)
ax.grid(True, alpha=0.3, axis='y')
plt.tight_layout()
plt.savefig('images/gold_price_histogram.png', dpi=300, bbox_inches='tight')
plt.close()
print("  ✓ images/gold_price_histogram.png 저장 완료")

# 4. 막대 그래프 - 통계 요약
print("4. 통계 요약 막대 그래프 생성 중...")
fig, ax = plt.subplots(figsize=(14, 8))

categories = ['매입가_순금(3.75g)', '매도가_순금(3.75g)', '매도가_18K', '매도가_14K']
stats = {
    '평균': [df[col].mean() for col in categories],
    '최대값': [df[col].max() for col in categories],
    '최소값': [df[col].min() for col in categories]
}

x = np.arange(len(categories))
width = 0.25

bars1 = ax.bar(x - width, stats['평균'], width, label='평균', color='#4ECDC4', alpha=0.8)
bars2 = ax.bar(x, stats['최대값'], width, label='최대값', color='#FF6B6B', alpha=0.8)
bars3 = ax.bar(x + width, stats['최소값'], width, label='최소값', color='#95E1D3', alpha=0.8)

ax.set_ylabel('가격 (원)', fontsize=12, fontweight='bold')
ax.set_title('금시세 통계 요약', fontsize=16, fontweight='bold', pad=20)
ax.set_xticks(x)
ax.set_xticklabels(['매입가\n순금', '매도가\n순금', '매도가\n18K', '매도가\n14K'])
ax.legend(fontsize=11)
ax.grid(True, alpha=0.3, axis='y')

# 값 표시
for bars in [bars1, bars2, bars3]:
    for bar in bars:
        height = bar.get_height()
        ax.text(bar.get_x() + bar.get_width()/2., height,
                f'{int(height):,}',
                ha='center', va='bottom', fontsize=8, rotation=0)

plt.tight_layout()
plt.savefig('images/gold_price_statistics_bar.png', dpi=300, bbox_inches='tight')
plt.close()
print("  ✓ images/gold_price_statistics_bar.png 저장 완료")

# 5. 월별 평균 추이
print("5. 월별 평균 추이 그래프 생성 중...")
df_sorted['년월'] = df_sorted['고시날짜'].dt.to_period('M')
monthly_avg = df_sorted.groupby('년월')[['매입가_순금(3.75g)', '매도가_순금(3.75g)']].mean()

fig, ax = plt.subplots(figsize=(14, 7))

x_pos = range(len(monthly_avg))
ax.plot(x_pos, monthly_avg['매입가_순금(3.75g)'], 
        marker='o', label='매입가 (순금)', linewidth=2, markersize=8, color='#FF6B6B')
ax.plot(x_pos, monthly_avg['매도가_순금(3.75g)'], 
        marker='s', label='매도가 (순금)', linewidth=2, markersize=8, color='#4ECDC4')

ax.set_xlabel('월', fontsize=12, fontweight='bold')
ax.set_ylabel('평균 가격 (원)', fontsize=12, fontweight='bold')
ax.set_title('월별 평균 금시세 추이', fontsize=16, fontweight='bold', pad=20)
ax.set_xticks(x_pos)
ax.set_xticklabels([str(period) for period in monthly_avg.index], rotation=45)
ax.legend(fontsize=11)
ax.grid(True, alpha=0.3)
plt.tight_layout()
plt.savefig('images/gold_price_monthly_average.png', dpi=300, bbox_inches='tight')
plt.close()
print("  ✓ images/gold_price_monthly_average.png 저장 완료")

# 6. 상관관계 히트맵
print("6. 상관관계 히트맵 생성 중...")
fig, ax = plt.subplots(figsize=(10, 8))

corr_columns = ['매입가_순금(3.75g)', '매도가_순금(3.75g)', '매도가_18K', '매도가_14K']
corr_matrix = df[corr_columns].corr()

sns.heatmap(corr_matrix, annot=True, fmt='.3f', cmap='coolwarm', 
            square=True, linewidths=1, cbar_kws={"shrink": 0.8},
            ax=ax, vmin=0.9, vmax=1.0)

ax.set_title('금시세 항목 간 상관관계', fontsize=16, fontweight='bold', pad=20)
labels = ['매입가\n순금', '매도가\n순금', '매도가\n18K', '매도가\n14K']
ax.set_xticklabels(labels, rotation=45, ha='right')
ax.set_yticklabels(labels, rotation=0)
plt.tight_layout()
plt.savefig('images/gold_price_correlation.png', dpi=300, bbox_inches='tight')
plt.close()
print("  ✓ images/gold_price_correlation.png 저장 완료")

print("\n" + "="*60)
print("✓ 모든 시각화 완료!")
print("="*60)
print("\n생성된 파일 (images 폴더):")
print("  1. images/gold_price_timeseries.png - 시계열 추이 그래프")
print("  2. images/gold_price_boxplot.png - 박스플롯 (분포 비교)")
print("  3. images/gold_price_histogram.png - 히스토그램 (매입가 분포)")
print("  4. images/gold_price_statistics_bar.png - 통계 요약 막대 그래프")
print("  5. images/gold_price_monthly_average.png - 월별 평균 추이")
print("  6. images/gold_price_correlation.png - 상관관계 히트맵")
