import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { Linking, Platform } from 'react-native'
import { WebView, WebViewProps } from 'react-native-webview'
import type {
  ShouldStartLoadRequest,
  WebViewMessageEvent,
} from 'react-native-webview/lib/WebViewTypes'
import { appScheme } from './appScheme'

type DistributiveOmit<T, K extends keyof any> = T extends any
  ? Omit<T, K>
  : never

export type PortOneController = {
  readonly webview: WebView | null
  readonly canGoBack: boolean
}

export type PortOneUIController<Request> = {
  readonly webview: WebView | null
  readonly canGoBack: boolean
  updateRequest(request: Request): void
}

type OverridableWebViewProps = Omit<
  WebViewProps,
  | 'request'
  | 'onError'
  | 'onComplete'
  | 'ref'
  | 'source'
  | 'injectedJavaScript'
  | 'injectedJavaScriptBeforeContentLoaded'
  | 'injectedJavaScriptForMainFrameOnly'
  | 'injectedJavaScriptBeforeContentLoadedForMainFrameOnly'
  | 'injectedJavaScriptObject'
  | 'onMessage'
  | 'onShouldStartLoadWithRequest'
  | 'onLoadProgress'
  | 'javaScriptEnabled'
>

export type SdkDelegateProps<Request, Response> = {
  request: DistributiveOmit<Request, 'requestUrl'>
  onError?: (error: Error) => void
  onComplete?: (response: Response) => void
  ref?: React.LegacyRef<PortOneController>
} & OverridableWebViewProps

export type SdkUIDelegateProps<Request, Response, Controller> = {
  request: DistributiveOmit<Request, 'requestUrl'>
  onError?: (error: Error) => void
  onComplete?: (response: Response) => void
  ref?: React.LegacyRef<Controller>
} & OverridableWebViewProps

export type SdkDelegate<Request, Response> = React.FC<
  SdkDelegateProps<Request, Response>
>
export type SdkUIDelegate<Request, Response, Controller> = React.FC<
  SdkUIDelegateProps<Request, Response, Controller>
>

function onMessage<Response>(
  message: WebViewMessageEvent,
  onError?: (error: Error) => void,
  onComplete?: (response: Response) => void
) {
  const data = JSON.parse(message.nativeEvent.data)
  if ('response' in data) {
    onComplete?.(data.response)
  } else if ('error' in data) {
    onError?.(new Error(data.error.message))
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
      const [, search] = url.split('?', 2)
      const args =
        search?.split('&')?.flatMap((param) => {
          const [key, value] = param.split('=', 2)
          if (key != null && value != null) {
            return [[decodeURIComponent(key), decodeURIComponent(value)]]
          } else {
            return []
          }
        }) ?? []
      onComplete?.(Object.fromEntries(args) as Response)
      return false
    }
    case 'intent': {
      const params = new Map<string, string>()
      const [, hash] = url.split('#', 2)
      for (const param of hash!.split(';')) {
        const [key, value] = param.split('=', 2)
        if (key != null && value != null) {
          params.set(decodeURIComponent(key), decodeURIComponent(value))
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

function sdkDelegateHtml(method: string, requestObject: object): string {
  return `<!doctype html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
<script src="https://cdn.portone.io/v2/browser-sdk.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', () => {
    PortOne[${JSON.stringify(method)}](${JSON.stringify(requestObject)}).catch((e) => {
      const error = e instanceof Error ? { ...e, message: e.message } : e
      window.ReactNativeWebView.postMessage(JSON.stringify({ error }))
    })
  })
</script>
<body>
</body>
</html>
`
}

export function createSdkDelegate<Request extends object, Response>(
  method: string
): React.FC<SdkDelegateProps<Request, Response>> {
  return forwardRef<PortOneController, SdkDelegateProps<Request, Response>>(
    (
      {
        request,
        onError,
        onComplete,
        allowsBackForwardNavigationGestures,
        originWhitelist,
        ...props
      },
      ref
    ) => {
      const [canGoBack, setCanGoBack] = useState(false)
      const webview = useRef<WebView>(null)
      useImperativeHandle(ref, () => ({
        get webview() {
          return webview.current
        },
        get canGoBack() {
          return canGoBack
        },
      }))
      const requestObject = {
        ...request,
        redirectUrl: 'portone://blank',
      }
      return (
        <WebView
          {...props}
          ref={webview}
          originWhitelist={originWhitelist ?? ['*']}
          source={{
            html: sdkDelegateHtml(method, requestObject),
            baseUrl: 'https://react-native-sdk-content.portone.io/',
          }}
          onMessage={(event) => onMessage(event, onError, onComplete)}
          onShouldStartLoadWithRequest={(event) =>
            onShouldStartLoadWithRequest(event, onComplete)
          }
          onLoadProgress={(event) => setCanGoBack(event.nativeEvent.canGoBack)}
          allowsBackForwardNavigationGestures={
            allowsBackForwardNavigationGestures ?? true
          }
          javaScriptEnabled
        />
      )
    }
  )
}

function sdkUIDelegateHtml(method: string, uiType: string, requestObject: object): string {
  return `<!doctype html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  body {
    margin: 0;
    height: 100vh;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin: 10px;
  }
  .portone-ui-container {
    flex: 1;
  }
  .portone-ui-container:has(#ui-container-paypal-spb) {
    min-width: 75px;
    max-width: 750px;
  }
</style>
</head>
<body>
<div id="portone-ui-container" class="portone-ui-container"></div>
<script src="https://cdn.portone.io/v2/browser-sdk.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', () => {
    document
      .getElementById('portone-ui-container')
      .setAttribute('data-portone-ui-type', ${JSON.stringify(uiType)})
    PortOne[${JSON.stringify(method)}](
      ${JSON.stringify(requestObject)},
      {
        onPaymentSuccess: (response) => window.ReactNativeWebView.postMessage(JSON.stringify({ response })),
        onPaymentFail: (error) => window.ReactNativeWebView.postMessage(JSON.stringify({ response: error })),
      }
    ).catch((e) => {
      const error = e instanceof Error ? { ...e, message: e.message } : e
      window.ReactNativeWebView.postMessage(JSON.stringify({ error }))
    })
  })
</script>
</body>
`
}

export function createSdkUIDelegate<
  Request extends { uiType: string },
  Response,
>(
  method: string
): React.FC<
  SdkUIDelegateProps<Request, Response, PortOneUIController<Request>>
> {
  return forwardRef<
    PortOneUIController<Request>,
    SdkUIDelegateProps<Request, Response, PortOneUIController<Request>>
  >(
    (
      {
        request,
        onError,
        onComplete,
        originWhitelist,
        allowsBackForwardNavigationGestures,
        ...props
      },
      ref
    ) => {
      const [canGoBack, setCanGoBack] = useState(false)
      const webview = useRef<WebView>(null)
      useImperativeHandle(ref, () => ({
        get webview() {
          return webview.current
        },
        get canGoBack() {
          return canGoBack
        },
        updateRequest(newRequest: Request) {
          webview.current?.injectJavaScript(
            `PortOne.updateLoadPaymentUIRequest(${JSON.stringify(newRequest)});`
          )
        },
      }))
      const requestObject = {
        ...request,
        redirectUrl: 'portone://blank',
      }
      return (
        <WebView
          {...props}
          ref={webview}
          originWhitelist={originWhitelist ?? ['*']}
          source={{
            html: sdkUIDelegateHtml(method, request.uiType, requestObject),
            baseUrl: 'https://react-native-sdk-content.portone.io/',
          }}
          onMessage={(event) => onMessage(event, onError, onComplete)}
          onShouldStartLoadWithRequest={(event) =>
            onShouldStartLoadWithRequest(event, onComplete)
          }
          onLoadProgress={(event) => setCanGoBack(event.nativeEvent.canGoBack)}
          allowsBackForwardNavigationGestures={
            allowsBackForwardNavigationGestures ?? true
          }
          javaScriptEnabled
        />
      )
    }
  )
}

async function marketIfFail(link: string, market: string) {
  if (await Linking.canOpenURL(link)) return Linking.openURL(link)
  return Linking.openURL(market)
}
