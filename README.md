# PortOne SDK for React Native

React Native 환경에서 포트원 V2 결제 시스템에 연동하기 위한 SDK입니다.

## 버전

[유의적 버전 2.0.0](https://semver.org/spec/v2.0.0.html)을 사용합니다.

현재 주(主) 버전은 0입니다. 이는 라이브러리 공개 API가 아직 고정되지 않았음을 의미합니다. 주 버전이 1이 되기 전에도 릴리스 버전(프리릴리스가 아닌 버전)의 SDK를 프로덕션에서 사용할 수 있으며, 포트원은 관련 기술 지원을 제공합니다.

## API 안정성

포트원 V2는 @portone/browser-sdk의 하위 호환을 보장합니다. 본 SDK는 @portone/browser-sdk에 의존하므로, 한 버전의 SDK로 연동한 뒤에는 해당 버전에 특별한 버그가 없는 한 연동이 깨지지 않습니다.

SDK의 버전을 업데이트한 경우 코드 호환성이 깨질 수 있습니다. 이 경우 코드 작업이 필요합니다.

## 의존성

NodeJS v18을 지원하며, react-native-webview ~13.8.6을 사용합니다.

## 기술 지원

- tech.support@portone.io

## 설치

```sh
yarn install @portone/react-native-sdk
```

## 사용법

```js
import {
  IdentityVerification,
  IssueBillingKey,
  IssueBillingKeyAndPay,
  Payment,
  PgIssueBillingKey,
  PgPayment,
} from '@portone/react-native-sdk'

<Payment request={/* ... */} />
```

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)

Packages under _portone-io/server-sdk-py_ are primarily distributed under the terms of
both the [Apache License (Version 2.0)] and the [MIT license]. See [COPYRIGHT]
for details.

[MIT license]: LICENSE-MIT
[Apache License (Version 2.0)]: LICENSE-APACHE
[COPYRIGHT]: COPYRIGHT
