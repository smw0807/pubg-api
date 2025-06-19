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

# 실행 방법
1. 패키지 설치
```bash
yarn install
```

2. env. 파일 생성
```bash
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