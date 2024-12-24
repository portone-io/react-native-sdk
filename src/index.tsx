import type {
  IdentityVerificationRequest,
  IdentityVerificationResponse,
  IssueBillingKeyAndPayRequest,
  IssueBillingKeyAndPayResponse,
  IssueBillingKeyRequest,
  IssueBillingKeyResponse,
  LoadIssueBillingKeyUIRequest,
  LoadPaymentUIRequest,
  PaymentRequest,
  PaymentResponse,
} from '@portone/browser-sdk/v2'
import {
  createSdkDelegate,
  createSdkUIDelegate,
  type SdkDelegate,
  type SdkUIDelegate,
} from './SdkDelegate'

export const PaymentUI: SdkUIDelegate<LoadPaymentUIRequest, PaymentResponse> =
  createSdkUIDelegate<LoadPaymentUIRequest, PaymentResponse>('loadPaymentUI')

export const PgIssueBilingKey: SdkUIDelegate<
  LoadIssueBillingKeyUIRequest,
  IssueBillingKeyResponse
> = createSdkUIDelegate<LoadIssueBillingKeyUIRequest, IssueBillingKeyResponse>(
  'loadIssueBillingKeyUI'
)

export const IssueBillingKeyAndPay: SdkDelegate<
  IssueBillingKeyAndPayRequest,
  IssueBillingKeyAndPayResponse
> = createSdkDelegate<
  IssueBillingKeyAndPayRequest,
  IssueBillingKeyAndPayResponse
>('requestIssueBillingKeyAndPay')

export const IssueBillingKey: SdkDelegate<
  IssueBillingKeyRequest,
  IssueBillingKeyResponse
> = createSdkDelegate<IssueBillingKeyRequest, IssueBillingKeyResponse>(
  'requestIssueBillingKey'
)

export const IdentityVerification: SdkDelegate<
  IdentityVerificationRequest,
  IdentityVerificationResponse
> = createSdkDelegate<
  IdentityVerificationRequest,
  IdentityVerificationResponse
>('requestIdentityVerification')

export const Payment: SdkDelegate<PaymentRequest, PaymentResponse> =
  createSdkDelegate<PaymentRequest, PaymentResponse>('requestPayment')

export type { PortOneController, PortOneUIController } from './SdkDelegate'
