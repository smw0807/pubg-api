# PUBG API

처음으로 배그 API를 사용해서 [pubg_your.stat](https://github.com/smw0807/pubg_your.stat)를 만들었었습니다.
만들 때 프론트엔드 프로젝트와 함께 작업하다 보니 시간이 부족해서 스탯 관련 API만 사용한 것이 아쉬웠는데,
이번에는 백엔드로만 구성해서 프로젝트를 시작했습니다.
매치 관련 API는 1개뿐이지만, 출력되는 데이터가 많아서 다양한 기능들을 만들 수 있을 것 같아 만들어봤습니다.
스웨거를 통해 API를 확인해볼 수 있습니다.

# 개발 환경

- Macbook Pro 16 (M1Max)
  - Node v22.14.0
  - Yarn 1.22.22

# 기술 스택

- NestJS 11 (https://docs.nestjs.com/)
- Swagger (API 문서)
- Cache Manager (응답 캐싱)
- Winston Logger (로깅)
- Docker / Vercel (배포)

# 기능 구성

1. **플레이어** (`/players`)
   - 플레이어 정보 조회 (닉네임 기반)

2. **시즌** (`/seasons`)
   - 시즌 목록 조회
   - 현재 시즌 정보 조회

3. **스탯** (`/stats`)
   - 랭크 스탯 조회
   - 일반 스탯 조회
   - 최근 매치 스탯 조회

4. **라이프타임** (`/lifetime`)
   - 전 시즌 통합 라이프타임 스탯 조회

5. **매치 분석** (`/matches`)
   - 매치 전체 정보 조회
   - 매치 요약 정보 (게임 모드, 맵, 지속시간, 플레이어 수 등)
   - 팀 순위 조회
   - 플레이어별 상세 통계
   - 킬/데미지/생존 시간 리더보드
   - 특정 플레이어 매치 통계
   - 팀 분석 (최고 성과자, 효율성)
   - 플레이어 성과 분석 (KDA, 정확도, 효율성)
   - 매치 전체 통계 (총계, 평균, 극값)
   - 플레이어 검색

6. **텔레메트리** (`/telemetry`)
   - 플레이어 이동 경로 조회
   - 킬 로그 조회 (플레이어 필터링 가능)
   - 기절(DBNO) 로그 조회 (플레이어 필터링 가능)
   - 데미지 로그 조회 (플레이어 필터링 가능)

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

4. Docker 실행

```bash
docker build -t pubg-api .
docker run -p 3000:3000 --env-file .env pubg-api
```

# 참고 URL

1. CI/CD
   - https://mag1c.tistory.com/465
   - https://velog.io/@zuckerfrei/Github-Actions-1.-self-hosted-runner
2. PUBG API

   - https://documentation.pubg.com/en/introduction.html

3. Runner 생성 실패
   - https://velog.io/@shdrnrhd113/Runner-%EC%83%9D%EC%84%B1-%EC%95%88%EB%90%98%EB%8A%94-%EB%AC%B8%EC%A0%9C
