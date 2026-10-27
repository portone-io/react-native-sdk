---
'@portone/react-native-sdk': minor
---

canOpenURL 대신 openURL로 외부 결제 앱을 직접 실행하도록 변경합니다. AndroidManifest.xml의 `<queries>` 및 Info.plist의 `LSApplicationQueriesSchemes` 설정이 더 이상 필요하지 않으며, Expo config plugin은 no-op으로 유지됩니다.
