---
'@portone/react-native-sdk': patch
---

`onError`로 전달되는 오류에 브라우저 SDK 오류의 `code` 등 속성을 보존하고, `onError`의 오류 타입을 메서드별 브라우저 SDK 오류 타입(`IdentityVerificationError`, `PaymentError` 등)으로 지정합니다.
