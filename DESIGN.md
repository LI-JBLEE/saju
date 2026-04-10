# DESIGN.md
사주 리포트 웹앱 — 디자인 시스템 레퍼런스

---

## DESIGN TOKENS

```css
/* 배경 */
--color-bg-base:    #1a1a2e;
--color-bg-card:    #2d2d44;
--color-bg-input:   #23233a;

/* 텍스트 */
--color-text-primary:   #e8e0d0;
--color-text-secondary: #a09880;
--color-text-muted:     #6b6555;

/* 포인트 */
--color-gold:       #c9a96e;
--color-gold-light: #e8c98a;
--color-gold-dark:  #a0845a;

/* 테두리 */
--color-border:          rgba(201, 169, 110, 0.2);
--color-border-strong:   rgba(201, 169, 110, 0.4);
--color-border-input:    rgba(232, 224, 208, 0.15);
```

---

## SPACING SCALE

Tailwind 기본 스케일 사용.
- 섹션 간 여백: 최소 `48px`
- 카드 내부 패딩: `24px`
- 컴포넌트 내부 간격: `8px`, `12px`, `16px`

---

## OHAENG COLOR MAP

전통 오방색을 현대적으로 재해석.

| 오행 | 배경색 | 텍스트색 |
|------|--------|----------|
| 목 木 | `#2d5a2d` | `#7ec87e` |
| 화 火 | `#5a2d2d` | `#c87e7e` |
| 토 土 | `#5a4a2d` | `#c8a87e` |
| 금 金 | `#3d3d4a` | `#a0a0c8` |
| 수 水 | `#2d3d4a` | `#7ea8c8` |

---

## TYPOGRAPHY SCALE

```
앱 타이틀     : Noto Serif KR, 32px, weight 700, color gold
페이지 제목   : Noto Serif KR, 24px, weight 600, color primary
섹션 제목     : Noto Serif KR, 18px, weight 600, color primary
본문          : Noto Serif KR, 16px, weight 400, line-height 1.9
UI 레이블     : Noto Sans KR,  14px, weight 500, color secondary
캡션          : Noto Sans KR,  12px, weight 400, color muted
한자 표기     : Noto Serif KR, 20px, weight 700, color gold
```

---

## COMPONENT DESIGN PATTERNS

### 카드 (Card)
```css
background:    var(--color-bg-card);
border:        0.5px solid var(--color-border);
border-radius: 12px;
padding:       24px;
box-shadow:    none; /* 그림자 사용 금지 */
```

### 버튼 (Primary Button)
```css
background:    linear-gradient(135deg, #c9a96e, #a0845a);
color:         #1a1a2e;
border:        none;
border-radius: 8px;
padding:       14px 32px;
font:          Noto Sans KR, 16px, weight 700;
hover:         brightness(1.1);
active:        scale(0.98);
```

### 입력 필드 (Input / Select)
```css
background:    var(--color-bg-input);
border:        0.5px solid var(--color-border-input);
border-radius: 8px;
color:         var(--color-text-primary);
padding:       12px 16px;
focus-border:  var(--color-gold);
```

---

## SAJU CHART VISUAL SPEC

```
  년주    월주    일주    시주
┌──────┐┌──────┐┌──────┐┌──────┐
│  甲  ││  丙  ││  戊  ││  庚  │  ← 천간 (한자, gold)
│      ││      ││      ││      │
├──────┤├──────┤├──────┤├──────┤
│  子  ││  午  ││  申  ││  戌  │  ← 지지 (한자, primary)
│      ││      ││      ││      │
└──────┘└──────┘└──────┘└──────┘

카드 크기 : 64×80px (모바일), 80×100px (데스크탑)
카드 배경 : var(--color-bg-card)
카드 테두리: var(--color-border-strong)
```

---

## ANIMATION SPEC

```css
/* 기본 트랜지션 */
transition: all 200ms ease-out;

/* 섹션 등장 */
@keyframes sectionFadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
animation: sectionFadeIn 300ms ease-out;

/* 로딩 펄스 */
@keyframes goldPulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
}
animation: goldPulse 1.5s ease-in-out infinite;
```
