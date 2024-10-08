import type {
  IssueBillingKeyResponse,
  LoadIssueBillingKeyUIRequest,
} from '@portone/browser-sdk/v2'
import { SdkUIDelegate, type SdkDelegateProps } from './SdkDelegate'

export type PgIssueBillingKeyProps = Omit<
  SdkDelegateProps<LoadIssueBillingKeyUIRequest, IssueBillingKeyResponse>,
  'method'
>

export function PgIssueBillingKey(props: PgIssueBillingKeyProps) {
  return (
    <SdkUIDelegate<LoadIssueBillingKeyUIRequest, IssueBillingKeyResponse>
      method="loadPaymentUI"
      {...props}
    />
  )
}
