import type {
  IdentityVerificationError,
  IdentityVerificationRequest,
  IdentityVerificationResponse,
  IssueBillingKeyAndPayError,
  IssueBillingKeyAndPayRequest,
  IssueBillingKeyAndPayResponse,
  IssueBillingKeyError,
  IssueBillingKeyRequest,
  IssueBillingKeyResponse,
  LoadIssueBillingKeyUIError,
  LoadIssueBillingKeyUIRequest,
  LoadPaymentUIError,
  LoadPaymentUIRequest,
  PaymentError,
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
  PaymentUIController,
  LoadPaymentUIError
> = createSdkUIDelegate<
  LoadPaymentUIRequest,
  PaymentResponse,
  LoadPaymentUIError
>('loadPaymentUI', 'Payment')

export type IssueBillingKeyUIController =
  PortOneUIController<LoadIssueBillingKeyUIRequest>
export const IssueBillingKeyUI: SdkUIDelegate<
  LoadIssueBillingKeyUIRequest,
  IssueBillingKeyResponse,
  IssueBillingKeyUIController,
  LoadIssueBillingKeyUIError
> = createSdkUIDelegate<
  LoadIssueBillingKeyUIRequest,
  IssueBillingKeyResponse,
  LoadIssueBillingKeyUIError
>('loadIssueBillingKeyUI', 'IssueBillingKey')

export const IssueBillingKeyAndPay: SdkDelegate<
  IssueBillingKeyAndPayRequest,
  IssueBillingKeyAndPayResponse,
  IssueBillingKeyAndPayError
> = createSdkDelegate<
  IssueBillingKeyAndPayRequest,
  IssueBillingKeyAndPayResponse,
  IssueBillingKeyAndPayError
>('requestIssueBillingKeyAndPay')

export const IssueBillingKey: SdkDelegate<
  IssueBillingKeyRequest,
  IssueBillingKeyResponse,
  IssueBillingKeyError
> = createSdkDelegate<
  IssueBillingKeyRequest,
  IssueBillingKeyResponse,
  IssueBillingKeyError
>('requestIssueBillingKey')

export const IdentityVerification: SdkDelegate<
  IdentityVerificationRequest,
  IdentityVerificationResponse,
  IdentityVerificationError
> = createSdkDelegate<
  IdentityVerificationRequest,
  IdentityVerificationResponse,
  IdentityVerificationError
>('requestIdentityVerification')

export const Payment: SdkDelegate<
  PaymentRequest,
  PaymentResponse,
  PaymentError
> = createSdkDelegate<PaymentRequest, PaymentResponse, PaymentError>(
  'requestPayment'
)

export type { PortOneController } from './SdkDelegate'
