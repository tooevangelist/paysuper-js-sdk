const buildPurpose = process.env.VUE_APP_BUILD_PURPOSE;

const apiUrlMap = {
  dev: 'https://p1payapi.tst.protocol.one',
  test: 'https://p1payapi.tst.protocol.one',
  release: 'https://api.pay.super.com',
};

const formUrlMap = {
  dev: 'http://localhost:4040/',
  test: 'https://paysupermgmt.tst.protocol.one/order',
  release: 'https://order.pay.super.com/',
};

export default function getFunctionalUrls({ apiUrl, formUrl }) {
  return {
    apiUrl: apiUrl || (apiUrlMap[buildPurpose] || apiUrlMap.dev),
    formUrl: formUrl || (formUrlMap[buildPurpose] || formUrlMap.dev),
  };
}
