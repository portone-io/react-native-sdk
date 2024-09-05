import type {
  IssueBillingKeyRequest,
  IssueBillingKeyResponse,
} from '@portone/browser-sdk/v2'
import { SdkDelegate, type SdkDelegateProps } from './SdkDelegate'

export type IssueBillingKeyProps = Omit<
  SdkDelegateProps<IssueBillingKeyRequest, IssueBillingKeyResponse>,
  'method'
>

export function IssueBillingKey(props: IssueBillingKeyProps) {
  return (
    <SdkDelegate<IssueBillingKeyRequest, IssueBillingKeyResponse>
      method="requestIssueBillingKey"
      {...props}
    />
  )
}
