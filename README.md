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

- NestJS (https://docs.nestjs.com/)
- PUBG API (https://documentation.pubg.com/en/introduction.html)

# 기능 구성

1. 플레이어 정보 조회
   - 플레이어 정보 조회
   - 플레이어 정보 및 최근 10매치 요약정보 조회
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

# 참고 URL

1. https://mag1c.tistory.com/465
