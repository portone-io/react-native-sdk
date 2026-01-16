import {
  type ConfigPlugin,
  withAndroidManifest,
  withInfoPlist,
} from '@expo/config-plugins'
import { appScheme } from './appScheme'

const packages = [
  ...new Set(
    Object.values(appScheme)
      .map(({ android }) => android)
      .filter((name) => name != null)
  ),
]

const iosSchemes = Object.entries(appScheme)
  .filter(([_scheme, { ios }]) => ios != null)
  .map(([scheme]) => scheme)

const withSdkQueries: ConfigPlugin = (config) => {
  config = withAndroidManifest(config, (androidManifest) => {
    androidManifest.modResults.manifest = {
      ...androidManifest.modResults.manifest,
      queries: androidManifest.modResults.manifest.queries.concat({
        package: packages.map((name) => ({ $: { 'android:name': name } })),
        intent: [
          {
            action: [
              {
                $: {
                  'android:name': 'android.intent.action.VIEW',
                },
              },
            ],
            category: [
              {
                $: {
                  'android:name': 'android.intent.category.BROWSABLE',
                },
              },
            ],
            data: [
              {
                $: {
                  'android:scheme': 'https',
                },
              },
            ],
          },
        ],
      }),
    }
    return androidManifest
  })
  config = withInfoPlist(config, (infoPlist) => {
    const alreadyIncluded = new Set(
      infoPlist.modResults.LSApplicationQueriesSchemes
    )
    infoPlist.modResults.LSApplicationQueriesSchemes = (
      infoPlist.modResults.LSApplicationQueriesSchemes ?? []
    ).concat(iosSchemes.filter((scheme) => !alreadyIncluded.has(scheme)))
    return infoPlist
  })
  return config
}

export default withSdkQueries
