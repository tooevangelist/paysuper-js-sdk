/**
 * App entry point
 */

import Vue from 'vue';
import './plugins/vuelidate';
import App from './App.vue';
import store from './store/RootStore';
import i18n from './i18n';
import './baseComponents';
import './vueExtentions';
import getP1PayOne from './getP1PayOne';

Vue.config.productionTip = false;

async function mountApp(
  iframeMountPoint, initStateOptions, { isInModal, destroyHandler, iframeResizeHandler },
) {
  await store.dispatch('PaymentForm/initState', initStateOptions);

  const VueApp = Vue.extend(App);
  new VueApp({
    store,
    i18n,
    propsData: {
      isInModal,
      destroyHandler,
      iframeResizeHandler,
    },
  }).$mount(iframeMountPoint);
}
const P1PayOne = getP1PayOne(mountApp);

if (process.env.NODE_ENV === 'production') {
  window.P1PayOne = P1PayOne;
} else {
  const payoneForm = new P1PayOne({
    projectID: '5be2e16701d96d00012d26c3',
    region: 'US',
    // email: 'raiky@yandex.ru',
    // paymentMethod: '',
    // account: '',
  });
  payoneForm.setAmount(5).renderInElement('#app');
}
