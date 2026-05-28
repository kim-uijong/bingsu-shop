# ILLUSTRATION_GUIDE.md — 오늘의 빙수 가게

## 일러스트 자산 목록 (총 52개)

13종 빙수 × 4상태 = 52개 PNG

### 4가지 상태
1. `empty` — 빈 그릇 (기대하는 눈빛)
2. `ice` — 얼음 가득 (설레는 표정)
3. `topping` — 토핑 올라가는 중 (행복한 표정)
4. `complete` — 완성! 빛나는 빙수 (환호)

### 파일 경로
```
src/assets/bingsus/
  patbingsu/     empty.png, ice.png, topping.png, complete.png
  konggaru/      empty.png, ice.png, topping.png, complete.png
  subak/         empty.png, ice.png, topping.png, complete.png
  boksunga/      empty.png, ice.png, topping.png, complete.png
  chamoe/        empty.png, ice.png, topping.png, complete.png
  strawberry/    empty.png, ice.png, topping.png, complete.png
  blueberry/     empty.png, ice.png, topping.png, complete.png
  bokbunja/      empty.png, ice.png, topping.png, complete.png
  mango/         empty.png, ice.png, topping.png, complete.png
  matcha/        empty.png, ice.png, topping.png, complete.png
  heukimja/      empty.png, ice.png, topping.png, complete.png
  rainbow/       empty.png, ice.png, topping.png, complete.png
  golden/        empty.png, ice.png, topping.png, complete.png
```

---

## ChatGPT 프롬프트 가이드

### 베이스 스타일 (모든 빙수 공통)
```
스타일 키워드:
- Sanrio + Studio Ghibli 혼합
- 3등신 SD(chibi) 비율
- Flat design + 부드러운 그림자
- 스티커 디자인 (흰 테두리)
- 흰 배경
- 따뜻한 여름 파스텔 톤
- 통통하고 귀여운 빙수 그릇
- 매우 큰 동그란 눈 (표정 표현용)
```

### Step 1: 팥빙수 베이스 생성
```
"빙수 가게 미니앱 캐릭터 디자인.

🍧 팥빙수:
- 3등신 SD(chibi) 비율의 귀여운 빙수 그릇 캐릭터
- 통통하고 둥근 흰 그릇 형태
- 매우 큰 동그란 눈으로 표정 표현
- 빨간 팥, 하얀 얼음, 초록 떡 장식
- 빨간 팥 시럽

상태: 빈 그릇 - 기대하는 반짝이는 눈빛

스타일: Sanrio + Ghibli 혼합, flat design,
스티커 형식, 흰 배경, 여름 파스텔 톤"
```

### Step 2: 4상태 변형 (이전 이미지 참조)
```
"위 팥빙수 캐릭터로 4가지 상태 제작:

1. 빈 그릇: 빈 그릇, 기대하는 반짝이는 눈
2. 얼음: 하얀 얼음 가득, 설레는 표정
3. 토핑 중: 팥/떡 올라가는 중, 행복한 표정
4. 완성: 완성된 팥빙수, 점프+빛 발산, 환호

동일 스타일/비율/색상 유지"
```

### Step 3: 나머지 12종 (팥빙수 이미지 업로드 후)
```
[팥빙수 complete.png 업로드]

"이 팥빙수와 완전히 동일한 스타일/비율로
🌾 콩가루빙수 제작:
- 노란 콩가루, 인절미 떡, 흰 얼음
- 4가지 상태 (빈그릇/얼음/토핑중/완성)
- 동일 스타일 유지"
```

---

## 빙수별 특징 정리

| 빙수 | 주요 토핑 | 색상 키워드 |
|------|----------|------------|
| 팥빙수 | 빨간 팥, 초록 떡 | 빨강, 크림 |
| 콩가루빙수 | 노란 콩가루, 인절미 | 노랑, 베이지 |
| 수박빙수 | 빨간 수박, 검은 씨 | 빨강, 초록 |
| 복숭아빙수 | 복숭아 슬라이스 | 살구, 분홍 |
| 참외빙수 | 노란 참외 조각 | 노랑, 초록 |
| 딸기빙수 | 딸기, 딸기시럽 | 빨강, 분홍 |
| 블루베리빙수 | 블루베리, 요거트 | 보라, 흰색 |
| 복분자빙수 | 복분자, 흑설탕 | 자주, 검정 |
| 망고빙수 | 망고 조각, 연유 | 주황, 노랑 |
| 말차빙수 | 말차 파우더, 팥 | 초록, 빨강 |
| 흑임자빙수 | 흑임자 파우더, 꿀 | 검정, 금색 |
| 무지개빙수 | 7색 시럽 | 무지개 |
| 황금빙수 | 금박, 특별 토핑 | 금색, 흰색 |

---

## Gemini 보조 프롬프트 (배경/소품)

```
"빙수 가게 배경 이미지:
- 여름 느낌의 밝고 시원한 가게 인테리어
- 파스텔 하늘색 + 흰색 톤
- 나무 선반에 빙수 그릇들
- 여름 햇살, 시원한 느낌
- 플랫 일러스트 스타일"
```

```
"빙수 소품들 (개별 PNG):
- 얼음 조각들 (반투명 파란빛)
- 시럽 방울 (여러 색상)
- 반짝이 효과 (금색, 흰색)
- 빙수 그릇 (빈 상태, 흰 도자기)
- 여름 배경 장식 (해바라기, 수박)"
```
