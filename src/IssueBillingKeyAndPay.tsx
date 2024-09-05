import type {
  IssueBillingKeyAndPayRequest,
  IssueBillingKeyAndPayResponse,
} from '@portone/browser-sdk/v2'
import { SdkDelegate, type SdkDelegateProps } from './SdkDelegate'

export type IssueBillingKeyAndPayProps = Omit<
  SdkDelegateProps<IssueBillingKeyAndPayRequest, IssueBillingKeyAndPayResponse>,
  'method'
>

export function IssueBillingKeyAndPay(props: IssueBillingKeyAndPayProps) {
  return (
    <SdkDelegate<IssueBillingKeyAndPayRequest, IssueBillingKeyAndPayResponse>
      method="requestIssueBillingKeyAndPay"
      {...props}
    />
  )
}
