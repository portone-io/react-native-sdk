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
  PortOneUIController,
  type SdkDelegate,
  type SdkUIDelegate,
} from './SdkDelegate'

export type PaymentUIController = PortOneUIController<LoadPaymentUIRequest>
export const PaymentUI: SdkUIDelegate<
  LoadPaymentUIRequest,
  PaymentResponse,
  PaymentUIController
> = createSdkUIDelegate<LoadPaymentUIRequest, PaymentResponse>('loadPaymentUI', 'Payment')

export type IssueBillingKeyUIController =
  PortOneUIController<LoadIssueBillingKeyUIRequest>
export const IssueBillingKeyUI: SdkUIDelegate<
  LoadIssueBillingKeyUIRequest,
  IssueBillingKeyResponse,
  IssueBillingKeyUIController
> = createSdkUIDelegate<LoadIssueBillingKeyUIRequest, IssueBillingKeyResponse>(
  'loadIssueBillingKeyUI',
  'IssueBillingKey',
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

export type { PortOneController } from './SdkDelegate'
