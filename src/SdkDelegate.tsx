import { Linking, Platform } from 'react-native'
import WebView from 'react-native-webview'
import type {
  ShouldStartLoadRequest,
  WebViewMessageEvent,
} from 'react-native-webview/lib/WebViewTypes'
import { appScheme } from './appScheme'

export type SdkDelegateProps<Request, Response> = {
  method: string
  request: Omit<Request, 'requestUrl'>
  onError?: (error: Error) => void
  onComplete?: (response: Response) => void
}

function onMessage(
  message: WebViewMessageEvent,
  onError?: (error: Error) => void
) {
  const data = JSON.parse(message.nativeEvent.data)
  if ('error' in data) {
    onError?.(new Error(data.error.message, { cause: data.error }))
  }
}

function onShouldStartLoadWithRequest<Response>(
  request: ShouldStartLoadRequest,
  onComplete?: (response: Response) => void
) {
  const url = request.url
  const protocol = url.split(':', 2)[0]!
  switch (protocol) {
    case 'about':
    case 'http':
    case 'https':
      return true
    case 'portone': {
      const { searchParams } = new URL(url)
      onComplete?.(Object.fromEntries(searchParams.entries()) as Response)
      return false
    }
    case 'intent': {
      const params = new Map<string, string>()
      const [, hash] = url.split('#', 2)
      for (const param of hash!.split(';')) {
        const [key, value] = param.split('=', 2)
        if (key != null && value != null) {
          params.set(key, value)
        }
      }
      const packageName = params.get('package')
      const scheme =
        params.get('scheme') ??
        Object.entries(appScheme).find(
          ([, s]) => s.android === packageName
        )?.[0]
      const redirectUrl = `${scheme}${url.slice(protocol.length)}`
      const playUrl = `market://details?id=${packageName}`
      marketIfFail(redirectUrl, playUrl)
      return false
    }
    default: {
      if (protocol in appScheme) {
        const marketUrl =
          Platform.OS === 'android'
            ? `market://details?id=${appScheme[protocol]?.android}`
            : `itms-apps://apps.apple.com/app/${appScheme[protocol]?.ios}`
        marketIfFail(url, marketUrl)
      } else Linking.openURL(url).catch(() => {})
      return false
    }
  }
}

export function SdkDelegate<Request extends object, Response>({
  method,
  request,
  onError,
  onComplete,
}: SdkDelegateProps<Request, Response>) {
  return (
    <WebView
      originWhitelist={['*']}
      source={{
        uri: `https://portone-io.github.io/react-native-sdk/SdkDelegate.html?method=${method}`,
      }}
      injectedJavaScriptObject={{ ...request, redirectUrl: 'portone://blank' }}
      onMessage={(event) => onMessage(event, onError)}
      onShouldStartLoadWithRequest={(event) =>
        onShouldStartLoadWithRequest(event, onComplete)
      }
    />
  )
}

export function SdkUIDelegate<Request extends { uiType: string }, Response>({
  method,
  request,
  onError,
  onComplete,
}: SdkDelegateProps<Request, Response>) {
  return (
    <WebView
      originWhitelist={['*']}
      source={{
        uri: `https://portone-io.github.io/react-native-sdk/SdkUIDelegate.html?method=${method}&uiType=${request.uiType}`,
      }}
      injectedJavaScriptObject={
        {
          ...request,
          redirectUrl: 'portone://blank',
        } as object
      }
      onMessage={(event) => onMessage(event, onError)}
      onShouldStartLoadWithRequest={(event) =>
        onShouldStartLoadWithRequest(event, onComplete)
      }
    />
  )
}

async function marketIfFail(link: string, market: string) {
  if (await Linking.canOpenURL(link)) return Linking.openURL(link)
  return Linking.openURL(market)
}
