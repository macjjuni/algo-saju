# 관리자 백엔드 API 명세

모든 엔드포인트는 `Authorization: Bearer {backendToken}` 헤더가 필요하며, 백엔드에서 관리자 권한을 별도 검증해야 합니다.

Base URL: `{NEXT_PUBLIC_API_URL}`

---

## 1. 통계

### GET `/api/v1/admin/stats`

통계 대시보드에 표시할 요약 데이터를 반환합니다.

**Response**

```json
{
  "totalUsers": 1234,
  "totalProfiles": 5678,
  "totalFortunes": 9012,
  "todayFortunes": 45,
  "dailyStats": [
    {
      "date": "2026-03-11",
      "users": 12,
      "fortunes": 34
    }
  ]
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `totalUsers` | number | 전체 가입 사용자 수 |
| `totalProfiles` | number | 전체 프로필 수 |
| `totalFortunes` | number | 전체 운세 분석 횟수 |
| `todayFortunes` | number | 오늘 운세 분석 횟수 |
| `dailyStats` | array | 최근 일별 통계 (날짜 내림차순 권장) |
| `dailyStats[].date` | string | 날짜 (YYYY-MM-DD) |
| `dailyStats[].users` | number | 해당일 신규 가입 사용자 수 |
| `dailyStats[].fortunes` | number | 해당일 운세 분석 횟수 |

---

## 2. 사용자 관리

### GET `/api/v1/admin/users`

사용자 목록을 페이지네이션으로 반환합니다.

**Query Parameters**

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `page` | number | X | 페이지 번호 (기본: 1) |
| `search` | string | X | 이름 또는 이메일 검색어 |

**Response**

```json
{
  "items": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "name": "홍길동",
      "image": "https://...",
      "profileCount": 3,
      "fortuneCount": 15,
      "createdAt": "2026-01-15T09:00:00Z",
      "lastLoginAt": "2026-03-11T10:30:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "pageSize": 20
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `items` | array | 사용자 목록 |
| `items[].id` | string | 사용자 고유 ID |
| `items[].email` | string | 이메일 |
| `items[].name` | string | 표시 이름 |
| `items[].image` | string \| null | 프로필 이미지 URL |
| `items[].profileCount` | number | 등록 프로필 수 |
| `items[].fortuneCount` | number | 운세 분석 횟수 |
| `items[].createdAt` | string | 가입일 (ISO 8601) |
| `items[].lastLoginAt` | string | 마지막 로그인 (ISO 8601) |
| `total` | number | 전체 사용자 수 |
| `page` | number | 현재 페이지 |
| `pageSize` | number | 페이지당 항목 수 |

---

### GET `/api/v1/admin/users/{id}`

특정 사용자의 상세 정보를 반환합니다.

**Path Parameters**

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| `id` | string | 사용자 ID |

**Response**

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "홍길동",
  "image": "https://...",
  "profileCount": 3,
  "fortuneCount": 15,
  "createdAt": "2026-01-15T09:00:00Z",
  "lastLoginAt": "2026-03-11T10:30:00Z",
  "profiles": [
    {
      "id": "profile-uuid",
      "name": "내 프로필",
      "createdAt": "2026-02-01T12:00:00Z"
    }
  ]
}
```

| 추가 필드 | 타입 | 설명 |
|----------|------|------|
| `profiles` | array | 사용자의 프로필 목록 |
| `profiles[].id` | string | 프로필 ID |
| `profiles[].name` | string | 프로필 이름 |
| `profiles[].createdAt` | string | 프로필 생성일 (ISO 8601) |

---

## 3. 공지사항

### GET `/api/v1/admin/announcements`

전체 공지사항 목록을 반환합니다.

**Response**

```json
{
  "announcements": [
    {
      "id": 1,
      "title": "서비스 점검 안내",
      "content": "3월 15일 02:00~04:00 서버 점검이 예정되어 있습니다.",
      "isPublished": true,
      "createdAt": "2026-03-10T09:00:00Z",
      "updatedAt": "2026-03-10T09:00:00Z"
    }
  ]
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `announcements` | array | 공지사항 목록 |
| `announcements[].id` | number | 공지 ID |
| `announcements[].title` | string | 제목 |
| `announcements[].content` | string | 내용 (마크다운) |
| `announcements[].isPublished` | boolean | 공개 여부 |
| `announcements[].createdAt` | string | 생성일 (ISO 8601) |
| `announcements[].updatedAt` | string | 수정일 (ISO 8601) |

---

### GET `/api/v1/admin/announcements/{id}`

특정 공지사항을 반환합니다.

**Path Parameters**

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| `id` | number | 공지 ID |

**Response**: 단일 Announcement 객체 (위 스키마와 동일)

---

### POST `/api/v1/admin/announcements`

새 공지사항을 생성합니다.

**Request Body**

```json
{
  "title": "서비스 업데이트 안내",
  "content": "새로운 기능이 추가되었습니다.",
  "isPublished": false
}
```

| 필드 | 타입 | 필수 | 제약 | 설명 |
|------|------|------|------|------|
| `title` | string | O | 1~100자 | 제목 |
| `content` | string | O | 1자 이상 | 내용 (마크다운) |
| `isPublished` | boolean | O | - | 공개 여부 |

**Response**: 생성된 Announcement 객체

---

### PUT `/api/v1/admin/announcements/{id}`

기존 공지사항을 수정합니다.

**Path Parameters**

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| `id` | number | 공지 ID |

**Request Body**: POST와 동일

**Response**: 수정된 Announcement 객체

---

### DELETE `/api/v1/admin/announcements/{id}`

공지사항을 삭제합니다.

**Path Parameters**

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| `id` | number | 공지 ID |

**Response**: 빈 응답 (204 No Content 또는 200 OK)

---

## 공통 에러 응답

모든 엔드포인트는 에러 발생 시 아래 형식으로 응답합니다.

```json
{
  "code": "UNAUTHORIZED",
  "message": "관리자 권한이 필요합니다."
}
```

| code | HTTP Status | 설명 |
|------|-------------|------|
| `BAD_REQUEST` | 400 | 요청 데이터 유효성 오류 |
| `UNAUTHORIZED` | 401 | 인증 토큰 없음/만료 |
| `FORBIDDEN` | 403 | 관리자 권한 없음 |
| `NOT_FOUND` | 404 | 리소스 없음 |
| `INTERNAL_ERROR` | 500 | 서버 내부 오류 |

---

## 백엔드 구현 시 참고사항

- 모든 관리자 API는 토큰에서 사용자를 식별한 뒤, 해당 사용자가 관리자인지 백엔드에서도 별도 검증해야 합니다.
- `dailyStats`는 최근 30일 정도를 날짜 내림차순으로 반환하는 것을 권장합니다.
- 사용자 검색(`search`)은 이름과 이메일 필드에 대해 부분 일치(LIKE) 검색을 지원해주세요.
- 페이지네이션 기본값: `page=1`, `pageSize=20`
