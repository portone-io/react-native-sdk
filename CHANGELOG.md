# @portone/react-native-sdk

## 0.5.0

### Minor Changes

- 9b70f38: Use startActivityAsync instead of Linking.openURL in Android (added expo-intent-launcher peer dependency)

### Patch Changes

- 9287b46: 신한은행 appScheme 추가

## 0.4.1

### Patch Changes

- 5a91683: intent:appscheme:// 형식 URL 대응

## 0.4.0

### Minor Changes

- 4de7219: \* embed content HTML
  - rename PgPayment to PaymentUI
  - fix: pass PaymentUI response via postMessage
- a597a07: \* bypass WebView props
  - fix: decode URL components in success response
  - fix: eslint warning message (#23)
- 862ef0e: IssueBillingKeyUI 버그 수정

### Patch Changes

- 7f5b99c: PASS 앱 추가
- ecdd4fd: sdkDelegate에서 항상 오류가 발생하는 문제 수정
- 10569fe: 외부 앱 등록 감지
- eb9804e: 페이북 결제 불가 오류 수정
- 3a6fe27: 우리카드, 라인페이, 알리페이 플러스, 위챗 appScheme 추가
- 7f07c68: SDK 사용 디버그 로그 기록
- 1a05b81: fix: decode URI component in url
- f2e8e97: V3 appScheme 추가
- 9b95279: 삼성페이 appScheme 추가

## 0.4.0-alpha.4

### Minor Changes

- 862ef0e: IssueBillingKeyUI 버그 수정

### Patch Changes

- eb9804e: 페이북 결제 불가 오류 수정
- 3a6fe27: 우리카드, 라인페이, 알리페이 플러스, 위챗 appScheme 추가

## 0.4.0-alpha.3

### Patch Changes

- 10569fe: 외부 앱 등록 감지
- 9b95279: 삼성페이 appScheme 추가

## 0.4.0-alpha.2

### Patch Changes

- f2e8e97: V3 appScheme 추가

## 0.4.0-alpha.1

### Patch Changes

- ecdd4fd: sdkDelegate에서 항상 오류가 발생하는 문제 수정
- 1a05b81: fix: decode URI component in url

## 0.4.0-alpha.0

### Minor Changes

- 4de7219: \* embed content HTML
  - rename PgPayment to PaymentUI
  - fix: pass PaymentUI response via postMessage
- a597a07: \* bypass WebView props
  - fix: decode URL components in success response
  - fix: eslint warning message (#23)

## 0.3.5

### Patch Changes

- 0a24661: 일부 플랫폼에서 결제창이 로딩되지 않던 버그 수정

## 0.3.4

### Patch Changes

- 7b0dccb: request 타입 정정

## 0.3.3

### Patch Changes

- 1362c02: URLSearchParams를 사용하지 않도록 수정

## 0.3.2

### Patch Changes

- 024302d: 의존성 업데이트

## 0.3.1

### Patch Changes

- 49a365e: browser-sdk 업데이트

## 0.3.0

### Minor Changes

- 4f2ad27: ref로 PortoneController 노출

## 0.2.0

### Minor Changes

- 9b30858: WebView ref 추가

## 0.1.6

### Patch Changes

- 7ec9950: 카카오페이 appScheme 추가

## 0.1.5

### Patch Changes

- 11fb105: 네이버페이 앱 링크 허용

## 0.1.4

### Patch Changes

- 01c0c92: @portone/browser-sdk 의존성 수정

## 0.1.3

### Patch Changes

- eeca241: console.log 삭제
