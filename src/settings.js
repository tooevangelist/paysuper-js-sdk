export const hostUrl = 'https://p1payapi.tst.protocol.one';

export const apiCreateOrderUrl = `${hostUrl}/api/v1/order`;

export const apiGetProjectPackagesUrl = `${hostUrl}/api/v1/project/package`;

export const devPaymentFormUrl = 'http://localhost:4040/';

export function getPaymentFormUrl(orderId) {
  if (process.env.NODE_ENV === 'development') {
    return devPaymentFormUrl;
  }

  return `${hostUrl}/order/${orderId}`;
}
