import type {
  LoadPaymentUIRequest,
  PaymentResponse,
} from '@portone/browser-sdk/v2'
import { type SdkDelegateProps, SdkUIDelegate } from './SdkDelegate'

export type PgPaymentProps = Omit<
  SdkDelegateProps<LoadPaymentUIRequest, PaymentResponse>,
  'method'
>

export function PgPayment(props: PgPaymentProps) {
  return (
    <SdkUIDelegate<LoadPaymentUIRequest, PaymentResponse>
      method="loadPaymentUI"
      {...props}
    />
  )
}
