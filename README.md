# PortOne SDK for React Native

React Native 환경에서 포트원 V2 결제 시스템에 연동하기 위한 SDK입니다.

## 의존성

Node.js v18을 지원하며, Expo 51.0.38과 react-native-webview 13.8.6 환경에서
테스트되었습니다.

## 기술 지원

- tech.support@portone.io

## 설치

1. Expo CLI를 사용해 @portone/react-native-sdk와 react-native-webview를
   설치합니다.

```shell
npx expo install @portone/react-native-sdk react-native-webview
```

2. TypeScript를 사용하시는 경우 @portone/browser-sdk를 devDependencies에 추가합니다.

```shell
npm install --save-dev @portone/browser-sdk
```
또는
```shell
yarn add -D @portone/browser-sdk
```

3. app.json의 plugin 항목으로 `@portone/react-native-sdk/plugin`를 추가합니다.

```json
{
  "expo": {
    "plugins": ["@portone/react-native-sdk/plugin"]
  }
}
```

4. TypeScript를 사용하시는 경우 `tsconfig.json`에 다음 항목을 추가 혹은 수정합니다.

```json
"compilerOptions": {
  "module": "NodeNext",
  "moduleResolution": "NodeNext"
}
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

Made with
[create-react-native-library](https://github.com/callstack/react-native-builder-bob)

Packages under _portone-io/react-native-sdk_ are primarily distributed under the
terms of both the [Apache License (Version 2.0)] and the [MIT license]. See
[COPYRIGHT] for details.

[MIT license]: LICENSE-MIT
[Apache License (Version 2.0)]: LICENSE-APACHE
[COPYRIGHT]: COPYRIGHT
