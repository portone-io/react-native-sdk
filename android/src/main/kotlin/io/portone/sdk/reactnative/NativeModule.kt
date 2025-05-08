package io.portone.sdk.reactnative

import android.content.ActivityNotFoundException
import android.content.Intent
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule
import java.net.URISyntaxException

@ReactModule(name = NativeModule.NAME)
class NativeModule(reactContext: ReactApplicationContext) : NativeModuleSpec(reactContext) {
  override fun getName(): String = NAME

  override fun startIntent(
    uri: String,
    promise: Promise,
  ) {
    val intent = try {
      Intent.parseUri(uri, 0)
    } catch (e: URISyntaxException) {
      promise.reject("URI_SYNTAX", e)
      return
    }
    try {
      reactApplicationContext.startActivity(intent)
    } catch (e: ActivityNotFoundException) {
      promise.reject("ACTIVITY_NOT_FOUND", e)
      return
    }
    promise.resolve(Unit)
  }

  companion object {
    const val NAME = "PortOneReactNativeSdkNativeModule"
  }
}
