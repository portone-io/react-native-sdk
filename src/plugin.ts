import { appScheme } from './appScheme'
import {
  type ConfigPlugin,
  withAndroidManifest,
  withInfoPlist,
} from '@expo/config-plugins'

const packages = [
  ...new Set(Object.values(appScheme).map((scheme) => scheme.android)),
]

const withSdkQueries: ConfigPlugin = (config) => {
  config = withAndroidManifest(config, (androidManifest) => {
    androidManifest.modResults.manifest = {
      ...androidManifest.modResults.manifest,
      queries: [
        ...androidManifest.modResults.manifest.queries,
        {
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
        },
      ],
    }
    return androidManifest
  })
  config = withInfoPlist(config, (infoPlist) => {
    infoPlist.modResults.LSApplicationQueriesSchemes = [
      ...(infoPlist.modResults.LSApplicationQueriesSchemes ?? []),
      ...Object.keys(appScheme),
    ]
    return infoPlist
  })
  return config
}

export default withSdkQueries
