# RELIABILITY.md
사주 리포트 웹앱 — 안정성 & 장애 대응 가이드

---

## RELIABILITY GOALS

- 서비스 가용성: `99%+` (Vercel + Supabase 기본 SLA 활용)
- 리포트 생성 성공률: `95%+`
- 공유 URL 응답 시간: `1초 이내` (DB 조회)
- 데이터 유실: `0건` (생성 완료된 리포트는 영구 보존)

---

## FAILURE SCENARIOS & HANDLING

### [HIGH] Claude API 타임아웃 / 에러
- **원인**: API 과부하, 네트워크 지연, 크레딧 부족
- **대응**: 최대 2회 자동 재시도 (1초 간격). 재시도 실패 시 사용자에게 "잠시 후 다시 시도해 주세요" 메시지 표시. DB에 부분 저장하지 않음.

### [HIGH] Supabase 저장 실패
- **원인**: DB 연결 오류, RLS 정책 오류
- **대응**: 리포트 생성은 완료했으나 저장 실패 시 — 생성된 텍스트를 화면에는 표시하되, 공유 URL은 제공하지 않음. 에러 로그 기록 후 재시도 유도.

### [MED] 스트리밍 중단
- **원인**: 사용자 네트워크 불안정, 브라우저 탭 전환
- **대응**: 스트리밍 중단 감지 시 "생성이 중단됐습니다. 다시 시도해 주세요." 표시. 부분 완성된 리포트는 저장하지 않음.

### [MED] 잘못된 공유 URL 접속
- **원인**: 존재하지 않는 ID
- **대응**: 404 페이지 대신 "리포트를 찾을 수 없습니다. 새로 조회하시겠어요?" + 메인 페이지 버튼 표시.

### [LOW] Rate limit 초과
- **원인**: 동일 IP에서 단시간 다량 요청
- **대응**: 429 응답 + "잠시 후 다시 시도해 주세요 (1분 후)" 메시지. 남은 대기 시간 카운트다운 표시.

---

## ERROR LOGGING

```
로깅 원칙:
  - 모든 API 에러는 서버 콘솔에 기록 (에러 코드 + 타임스탬프 + 입력값 요약)
  - 클라이언트에는 기술적 에러 메시지 절대 노출 금지
  - Vercel 함수 로그를 통해 모니터링

로그 포맷:
  [ERROR] 2024-01-15T10:30:00Z | route: /api/report/generate
  | error: AnthropicError: 529 Overloaded
  | input: { year: 1990, month: 3, day: 15, hour: null, gender: 'female' }
  | retry: 2/2 failed
```

---

## TIMEOUT SETTINGS

```
Claude API 요청 타임아웃  : 60초 (스트리밍 포함)
Supabase 쿼리 타임아웃   : 10초
Vercel 함수 최대 실행시간 : 60초 (필요 시 Pro 플랜에서 300초)
Rate limit 초기화 주기    : 60초
```

---

## MONITORING CHECKLIST (배포 후)

- [ ] Vercel 대시보드에서 함수 에러율 주기적 확인
- [ ] Supabase 대시보드에서 `reports` 테이블 row 증가 추이 확인
- [ ] Claude API 콘솔에서 사용량 및 크레딧 잔량 확인
- [ ] 비정상적인 생성 요청 급증 시 Rate limit 값 조정
