chat-service
============

## Quick Start

 The quickest and perhaps the only way to use this is simple like below:

 Don't forget to install dependencies in each folder:

	$ (cd server && npm install)
    $ (cd client/shell && npm install)

 Start the server:

	$ nohup node server/chat-server.js >> server/output.log &

 Test with the shell client:

	$ node client/shell/test-client.js 

클라이언트는 웹 기반으로 개발
- 파일 드래그 인 드롭
- 

서버 기능목록 (1차)
- 채널 기능
- 귓속말 기능
- 접속 유저 현황 기능

서버 기능목록 (2차)
- 깨우기 기능
- 파일 전송
- 세션 정보를 저장하는 오브젝트
- 

아이디어
- 주사위
- 관심 단어 알림 기능 (해시태그와 비슷, 다른 방에서 나온 나의 관심 단어를 자기에게 알려주고 따라갈 수 있게)
- 채팅 트렌드 목록
- 투표: 포스팅으로 이어지는...
- 
