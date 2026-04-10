# docs/generated/db-schema.md
사주 리포트 웹앱 — 데이터베이스 스키마 정의

> ⚠️ 스키마 변경 시 반드시 이 파일을 동기화할 것.

---

## OVERVIEW

Supabase (PostgreSQL) 기반.
로그인 없는 구조이므로 단일 테이블 `reports`만 운용한다.

---

## TABLE: reports

| 컬럼명 | 타입 | 제약 | 설명 |
|--------|------|------|------|
| `id` | UUID | PK, DEFAULT gen_random_uuid() | 리포트 고유 ID. URL에 사용됨 `/report/[id]` |
| `birth_year` | INTEGER | NOT NULL, CHECK (1900~현재) | 태어난 연도 (양력) |
| `birth_month` | INTEGER | NOT NULL, CHECK (1~12) | 태어난 월 (양력) |
| `birth_day` | INTEGER | NOT NULL, CHECK (1~31) | 태어난 일 (양력) |
| `birth_hour` | INTEGER | NULLABLE, CHECK (0~23) | 태어난 시간. NULL이면 시주 제외 분석 |
| `gender` | TEXT | NOT NULL, CHECK IN ('male','female') | 성별 |
| `saju_data` | JSONB | NOT NULL | 사주 계산 결과 (천간·지지·오행·용신 등) |
| `content` | TEXT | NOT NULL | Claude API가 생성한 리포트 전문 |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | 리포트 생성 시각 |

---

## saju_data JSONB STRUCTURE

```json
{
  "pillars": {
    "year":  { "cheongan": "甲", "jiji": "子", "ohaeng": "목" },
    "month": { "cheongan": "丙", "jiji": "午", "ohaeng": "화" },
    "day":   { "cheongan": "戊", "jiji": "申", "ohaeng": "토" },
    "hour":  { "cheongan": "庚", "jiji": "戌", "ohaeng": "금" }
  },
  "ohaeng_ratio": {
    "목": 1,
    "화": 2,
    "토": 2,
    "금": 2,
    "수": 1
  },
  "ilgan": "戊",
  "yongsin": "목",
  "gisin": "금"
}
```

`hour` 필드는 `birth_hour`가 null인 경우 생략된다.

---

## SQL MIGRATION

```sql
CREATE TABLE reports (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  birth_year  INTEGER     NOT NULL CHECK (birth_year >= 1900 AND birth_year <= EXTRACT(YEAR FROM NOW())),
  birth_month INTEGER     NOT NULL CHECK (birth_month BETWEEN 1 AND 12),
  birth_day   INTEGER     NOT NULL CHECK (birth_day BETWEEN 1 AND 31),
  birth_hour  INTEGER              CHECK (birth_hour BETWEEN 0 AND 23),
  gender      TEXT        NOT NULL CHECK (gender IN ('male', 'female')),
  saju_data   JSONB       NOT NULL,
  content     TEXT        NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX reports_created_at_idx ON reports (created_at DESC);
```

---

## ROW LEVEL SECURITY (RLS)

```sql
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- 누구나 INSERT 가능 (로그인 불필요)
CREATE POLICY "Anyone can insert"
  ON reports FOR INSERT
  WITH CHECK (true);

-- 누구나 SELECT 가능 (공유 URL 접근)
CREATE POLICY "Anyone can select"
  ON reports FOR SELECT
  USING (true);

-- UPDATE / DELETE 는 비활성화 (리포트 영구 보존 원칙)
```

---

## INDEXES

| 인덱스명 | 대상 컬럼 | 목적 |
|----------|-----------|------|
| `reports_pkey` | id | URL 조회 기본 인덱스 |
| `reports_created_at_idx` | created_at DESC | 추후 관리자 조회 대비 |

---

## MIGRATION NOTES

- 스키마 변경 시 이 파일 업데이트 필수
- 컬럼 추가는 허용, 기존 컬럼 타입 변경은 금지
- `saju_data` JSONB 구조 변경 시 기존 데이터 호환성 반드시 확인
- DELETE 정책은 어떤 경우에도 활성화하지 않는다
