import type {
  IdentityVerificationRequest,
  IdentityVerificationResponse,
} from '@portone/browser-sdk/v2'
import { SdkDelegate, type SdkDelegateProps } from './SdkDelegate'

export type IdentityVerificationProps = Omit<
  SdkDelegateProps<IdentityVerificationRequest, IdentityVerificationResponse>,
  'method'
>

export function IdentityVerification(props: IdentityVerificationProps) {
  return (
    <SdkDelegate<IdentityVerificationRequest, IdentityVerificationResponse>
      method="requestIdentityVerification"
      {...props}
    />
  )
}
