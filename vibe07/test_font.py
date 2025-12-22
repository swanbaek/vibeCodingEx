"""
폰트 설정 테스트 - 한글이 제대로 렌더링되는지 확인
"""

import matplotlib.pyplot as plt
import matplotlib.font_manager as fm
import warnings

# 경고 무시
warnings.filterwarnings('ignore')

# 폰트 경로 직접 지정
font_path = 'C:\\Windows\\Fonts\\malgun.ttf'
font_prop = fm.FontProperties(fname=font_path)

# 간단한 테스트 차트
fig, ax = plt.subplots(figsize=(8, 6))
ax.plot([1, 2, 3, 4], [1, 4, 2, 3], marker='o', linewidth=2, markersize=8)
ax.set_title('금시세 테스트', fontproperties=font_prop, fontsize=20)
ax.set_xlabel('날짜', fontproperties=font_prop, fontsize=14)
ax.set_ylabel('가격 (원)', fontproperties=font_prop, fontsize=14)
ax.tick_params(labelsize=12)
ax.grid(True, alpha=0.3)

# 텍스트 주석 추가
ax.text(2, 3.5, '매입가', fontproperties=font_prop, fontsize=14, 
        bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.5))

plt.tight_layout()
plt.savefig('font_test.png', dpi=150, bbox_inches='tight')
print("✓ 테스트 파일 생성: font_test.png")
print("  이 파일을 열어서 한글이 제대로 표시되는지 확인하세요.")
plt.close()
