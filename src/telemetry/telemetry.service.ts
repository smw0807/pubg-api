import { Injectable } from '@nestjs/common';
import { PubgService } from '@/pubg/pubg.service';
import { MatchesService } from '@/matches/matches.service';
import { PlatformType } from '@/constants/platform';
import { format } from 'date-fns';

@Injectable()
export class TelemetryService {
  constructor(
    private readonly pubgService: PubgService,
    private readonly matchesService: MatchesService,
  ) {}

  async getTelemetry(platform: PlatformType, matchId: string) {
    console.log(platform, matchId);
    const match = await this.matchesService.getMatches(platform, matchId);

    const assets = match.data.relationships.assets.data;
    console.log(assets);

    if (assets.length === 0) return null;
    const assetsId = assets[0].id;

    console.log(assetsId);

    /*
이 ID를 찾으면 포함된 배열에서 해당 ID를 가진 원격 측정 객체를 검색할 수 있습니다. 해당 배열에서 찾은 전체 객체는 원격 측정 파일에 대한 링크를 제공하며, 다음과 같은 형태입니다(URL은 예시일 뿐이며 작동하지 않습니다).

{
  "type": "asset",
  "id": "1ad97f85-cf9b-11e7-b84e-0a586460f004",
  "attributes": {
    "URL": "https://telemetry-cdn.pubg.com/pc-krjp/2018/01/01/0/0/1ad97f85-cf9b-11e7-b84e-0a586460f004-telemetry.json",
    "createdAt": "2018-01-01T00:00:00Z",
    "description": "",
    "name": "telemetry"
  }
},
이제 원격 측정 파일 링크를 얻었으므로 다음 명령어를 사용하여 데이터를 다운로드할 수 있습니다. 이 데이터를 가져오는 데 API 키는 필요하지 않습니다.

curl --compressed "https://telemetry-cdn.pubg.com/pc-krjp/2018/01/01/0/0/1ad97f85-cf9b-11e7-b84e-0a586460f004-telemetry.json" \
      -H "Accept: application/vnd.api+json"
원격 측정 파일에는 이벤트 객체 배열이 포함되며, 각 객체는 유형에 따라 구조가 다릅니다. 포함된 이벤트에 대한 자세한 내용은 원격 측정 이벤트를 참조하세요 .

참고: 원격 측정 데이터는 gzip을 사용하여 압축됩니다. 많은 브라우저와 라이브러리가 추가 작업 없이 이 기능을 지원하지만, API를 사용하는 클라이언트는 gzip으로 압축된 응답을 허용하도록 지정해야 합니다. "Accept-Encoding: gzip" 헤더를 반드시 전달해야 합니다.
    */
    const matchDate = match.data.attributes.createdAt;
    const formattedDate = format(new Date(matchDate), 'yyyy/MM/dd/HH/mm');
    const res = await this.pubgService.GETTelemetry({
      matchDate: formattedDate,
      matchId: assetsId,
    });

    console.log(res);
  }
}
