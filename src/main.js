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
  iframeMountPoint,
  initStateOptions,
  { isInModal, destroyHandler, iframeResizeHandler },
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

// Public API
window.P1PayOne = P1PayOne;
export default P1PayOne;
