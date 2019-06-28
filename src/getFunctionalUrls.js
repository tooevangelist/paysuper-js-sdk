export default function getFunctionalUrls(apiUrl) {
  return {
    apiUrl,
    paymentFormUrl: process.env.NODE_ENV === 'development'
      ? 'http://localhost:4040/'
      : 'https://p1payapi.tst.protocol.one/order/',
  };
}
