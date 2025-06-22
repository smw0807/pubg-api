# PUBG API

배그 API

# 개발 환경

- Macbook Pro 16 (M1Max)
  - Node v22.14.0
  - Yarn 1.22.22

# 기술 스택

- NestJS (https://docs.nestjs.com/)
- PUBG API (https://documentation.pubg.com/en/introduction.html)

# 기능 구성

1. 플레이어 정보 조회
2. 시즌 정보 조회
3. 스탯 조회
   - 랭크 스탯 조회
   - 일반 스탯 조회
4. 매치 분석 기능
   - 매치 요약 정보
   - 팀별 순위 및 분석
   - 플레이어별 상세 통계
   - 킬/데미지/생존 시간 리더보드
   - 특정 플레이어 매치 통계
   - 팀별 상세 분석 (최고 성과자, 효율성)
   - 플레이어 성과 분석 (KDA, 정확도, 효율성)
   - 매치 통계 요약 (총계, 평균, 극값)
   - 플레이어 검색 및 필터링

# API 엔드포인트

## 매치 분석 API

### 기본 매치 정보

- `GET /matches?platform={platform}&matchId={matchId}` - 원본 매치 데이터
- `GET /matches/summary?platform={platform}&matchId={matchId}` - 매치 요약 정보

### 팀 분석

- `GET /matches/teams?platform={platform}&matchId={matchId}` - 팀별 순위 정보
- `GET /matches/analysis/teams?platform={platform}&matchId={matchId}` - 팀별 상세 분석

### 플레이어 분석

- `GET /matches/players?platform={platform}&matchId={matchId}` - 플레이어별 상세 통계
- `GET /matches/analysis/performance?platform={platform}&matchId={matchId}` - 플레이어 성과 분석
- `GET /matches/player/{playerName}?platform={platform}&matchId={matchId}` - 특정 플레이어 매치 통계

### 리더보드

- `GET /matches/leaderboard/kills?platform={platform}&matchId={matchId}` - 킬 순위
- `GET /matches/leaderboard/damage?platform={platform}&matchId={matchId}` - 데미지 순위
- `GET /matches/leaderboard/survival?platform={platform}&matchId={matchId}` - 생존 시간 순위

### 통계 및 검색

- `GET /matches/statistics?platform={platform}&matchId={matchId}` - 매치 통계 요약
- `GET /matches/search?platform={platform}&matchId={matchId}&q={searchTerm}` - 플레이어 검색

# 실행 방법

1. 패키지 설치

```bash
yarn install
```

2. env. 파일 생성

```bash
PROJECT_NAME=PUBG API
PROJECT_PORT=3000
# 펍지 API 요청 URL
PUBG_API_URL=https://api.pubg.com/shards
# 펍지 API 키 (발급 받아야 함)
PUBG_API_KEY=
```

3. 실행 명령어

```bash
# 개발 모드 실행
yarn dev

# 빌드 및 실행
yarn build
yarn start
```

# 사용 예시

## 매치 요약 정보 조회

```bash
curl "http://localhost:3000/matches/summary?platform=kakao&matchId=aa8df751-b349-48e9-bde1-f5100bfdac14"
```

## 팀별 순위 조회

```bash
curl "http://localhost:3000/matches/teams?platform=kakao&matchId=aa8df751-b349-48e9-bde1-f5100bfdac14"
```

## 킬 리더보드 조회

```bash
curl "http://localhost:3000/matches/leaderboard/kills?platform=kakao&matchId=aa8df751-b349-48e9-bde1-f5100bfdac14"
```

## 특정 플레이어 통계 조회

```bash
curl "http://localhost:3000/matches/player/INI_Sogogi?platform=kakao&matchId=aa8df751-b349-48e9-bde1-f5100bfdac14"
```

# 참고 URL
