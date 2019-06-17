export default function getFunctionalUrls(apiUrl) {
  return {
    apiUrl,
    apiCreateOrderUrl: `${apiUrl}/api/v1/order`,
    apiGetProjectPackagesUrl: `${apiUrl}/api/v1/project/package`,
    devPaymentFormUrl: 'http://localhost:4040/',
    getPaymentFormUrl(paymentFormUrl) {
      if (!paymentFormUrl) {
        return '';
      }
      if (process.env.NODE_ENV === 'development') {
        return this.devPaymentFormUrl;
      }
      return paymentFormUrl;
    },
  };
}
