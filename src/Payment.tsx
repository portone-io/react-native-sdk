import type { PaymentRequest, PaymentResponse } from '@portone/browser-sdk/v2'
import { SdkDelegate, type SdkDelegateProps } from './SdkDelegate'

export type PaymentProps = Omit<
  SdkDelegateProps<PaymentRequest, PaymentResponse>,
  'method'
>

export function Payment(props: PaymentProps) {
  return (
    <SdkDelegate<PaymentRequest, PaymentResponse>
      method="requestPayment"
      {...props}
    />
  )
}
