import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { Linking, Platform } from 'react-native'
import { WebView } from 'react-native-webview'
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

export type SdkDelegateProps<Request, Response> = {
  request: DistributiveOmit<Request, 'requestUrl'>
  onError?: (error: Error) => void
  onComplete?: (response: Response) => void
  ref?: React.LegacyRef<PortOneController>
  webviewDebuggingEnabled?: boolean
  customHtmlUrl?: string
}

export type SdkUIDelegateProps<Request, Response> = {
  request: DistributiveOmit<Request, 'requestUrl'>
  onError?: (error: Error) => void
  onComplete?: (response: Response) => void
  ref?: React.LegacyRef<PortOneUIController<Request>>
  webviewDebuggingEnabled?: boolean
  customHtmlUrl?: string
}

export type SdkDelegate<Request, Response> = React.FC<
  SdkDelegateProps<Request, Response>
>
export type SdkUIDelegate<Request, Response> = React.FC<
  SdkUIDelegateProps<Request, Response>
>

function onMessage(
  message: WebViewMessageEvent,
  onError?: (error: Error) => void
) {
  const data = JSON.parse(message.nativeEvent.data)
  if ('error' in data) {
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
            return [[key, value]]
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

export function createSdkDelegate<Request extends object, Response>(
  method: string
): React.FC<SdkDelegateProps<Request, Response>> {
  return forwardRef<PortOneController, SdkDelegateProps<Request, Response>>(
    (
      {
        request,
        onError,
        onComplete,
        webviewDebuggingEnabled,
        customHtmlUrl = 'https://portone-io.github.io/react-native-sdk/SdkDelegate.html',
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
          ref={webview}
          originWhitelist={['*']}
          source={{
            uri: `${customHtmlUrl}?method=${method}`,
          }}
          injectedJavaScript={`window.requestObject=${JSON.stringify(requestObject)}`}
          injectedJavaScriptObject={requestObject}
          onMessage={(event) => onMessage(event, onError)}
          onShouldStartLoadWithRequest={(event) =>
            onShouldStartLoadWithRequest(event, onComplete)
          }
          onLoadProgress={(event) => setCanGoBack(event.nativeEvent.canGoBack)}
          allowsBackForwardNavigationGestures
          webviewDebuggingEnabled={webviewDebuggingEnabled}
          javaScriptEnabled
        />
      )
    }
  )
}

export function createSdkUIDelegate<
  Request extends { uiType: string },
  Response,
>(method: string): React.FC<SdkUIDelegateProps<Request, Response>> {
  return forwardRef<
    PortOneUIController<Request>,
    SdkUIDelegateProps<Request, Response>
  >(
    (
      {
        request,
        onError,
        onComplete,
        webviewDebuggingEnabled,
        customHtmlUrl = 'https://portone-io.github.io/react-native-sdk/SdkUIDelegate.html',
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
          ref={webview}
          originWhitelist={['*']}
          source={{
            uri: `${customHtmlUrl}?method=${method}&uiType=${request.uiType}`,
          }}
          injectedJavaScript={`window.requestObject=${JSON.stringify(requestObject)}`}
          injectedJavaScriptObject={requestObject}
          onMessage={(event) => onMessage(event, onError)}
          onShouldStartLoadWithRequest={(event) =>
            onShouldStartLoadWithRequest(event, onComplete)
          }
          onLoadProgress={(event) => setCanGoBack(event.nativeEvent.canGoBack)}
          allowsBackForwardNavigationGestures
          webviewDebuggingEnabled={webviewDebuggingEnabled}
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
