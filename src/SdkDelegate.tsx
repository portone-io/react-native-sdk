import { appScheme } from './appScheme'
import { createRef, type RefObject } from 'react'
import { Linking } from 'react-native'
import WebView from 'react-native-webview'
import type {
  ShouldStartLoadRequest,
  WebViewMessageEvent,
} from 'react-native-webview/lib/WebViewTypes'

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
  if ('error' in data)
    onError?.(new Error(data.error.message, { cause: data.error }))
}

function onShouldStartLoadWithRequest<Response>(
  request: ShouldStartLoadRequest,
  webview: RefObject<WebView>,
  onComplete?: (response: Response) => void
) {
  const url = request.url
  const [protocol] = url.split(':', 2)
  switch (protocol) {
    case 'about':
    case 'http':
    case 'https':
      return true
    case 'portone': {
      webview.current?.stopLoading()
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
      console.log(scheme, packageName)
      const redirectUrl = `${scheme}${url.slice(protocol.length)}`
      const playUrl = `market://details?id=${packageName}`
      marketIfFail(redirectUrl, playUrl)
      return false
    }
    default: {
      if (protocol! in appScheme) {
        const marketUrl = `itms-apps://apps.apple.com/app/${appScheme[protocol!]?.ios}`
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
  const webview = createRef<WebView>()

  return (
    <WebView
      ref={webview}
      originWhitelist={['*']}
      source={{
        html: `
          <script type="module">
            import * as PortOne from "https://cdn.portone.io/v2/browser-sdk.esm.js";
            PortOne.${method}(JSON.parse(window.ReactNativeWebView.injectedObjectJson())).catch((e) => {
              const error = e instanceof Error ? ({ ...e, message: e.message }) : e;
              window.ReactNativeWebView.postMessage(JSON.stringify({ error }));
            })
          </script>
        `,
      }}
      injectedJavaScriptObject={{ ...request, redirectUrl: 'portone://blank' }}
      onMessage={(event) => onMessage(event, onError)}
      onShouldStartLoadWithRequest={(event) =>
        onShouldStartLoadWithRequest(event, webview, onComplete)
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
  const webview = createRef<WebView>()

  return (
    <WebView
      ref={webview}
      originWhitelist={['*']}
      source={{
        html: `
          <div class="portone-ui-container" data-portone-ui-type="${request.uiType}"></div>
          <script type="module">
            import * as PortOne from "https://cdn.portone.io/v2/browser-sdk.esm.js";
            PortOne.${method}(JSON.parse(window.ReactNativeWebView.injectedObjectJson())).catch((e) => {
              const error = e instanceof Error ? ({ ...e, message: e.message }) : e;
              window.ReactNativeWebView.postMessage(JSON.stringify({ error }));
            })
          </script>
        `,
      }}
      injectedJavaScriptObject={{ ...request, redirectUrl: 'portone://blank' }}
      onMessage={(event) => onMessage(event, onError)}
      onShouldStartLoadWithRequest={(event) =>
        onShouldStartLoadWithRequest(event, webview, onComplete)
      }
    />
  )
}

async function marketIfFail(link: string, market: string) {
  if (await Linking.canOpenURL(link)) return Linking.openURL(link)
  return Linking.openURL(market)
}
