import type { ConfigPlugin } from '@expo/config-plugins'

/**
 * @deprecated 외부 앱 실행에 <queries> 및 LSApplicationQueriesSchemes 설정이
 * 더 이상 필요하지 않아 이 플러그인은 아무 동작도 하지 않습니다.
 * app.json의 plugins 항목에서 제거해도 됩니다.
 */
const withSdkQueries: ConfigPlugin = (config) => {
  console.warn(
    '[@portone/react-native-sdk] plugin은 더 이상 필요하지 않습니다. app.json의 plugins에서 제거해 주세요.'
  )
  return config
}

export default withSdkQueries
