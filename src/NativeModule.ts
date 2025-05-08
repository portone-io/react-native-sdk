import { TurboModule, TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  startIntent(
    uri: string,
  ): Promise<void>
}

export default TurboModuleRegistry.getEnforcing<Spec>('PortOneReactNativeSdkNativeModule')
