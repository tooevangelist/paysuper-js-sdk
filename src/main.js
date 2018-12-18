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

Vue.config.productionTip = false;

const SDK_PUBLIC_NAME = 'ProtocolOnePayment';

async function mountApp(targetElement) {
  await store.dispatch('PaymentForm/initState');

  new Vue({
    store,
    i18n,
    render: h => h(App),
  }).$mount(targetElement);
}

if (process.env.NODE_ENV === 'production') {
  window[SDK_PUBLIC_NAME] = {
    renderForm(targetElement) {
      mountApp(targetElement);
    },
  };
} else {
  mountApp('#app');
}
