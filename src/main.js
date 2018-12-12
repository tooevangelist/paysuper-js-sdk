/**
 * App entry point
 */

import Vue from 'vue';
import './plugins/vuelidate';
import App from './App.vue';
import store from './store/RootStore';
import i18n from './i18n';

Vue.config.productionTip = false;

const SDK_PUBLIC_NAME = 'ProtocolOnePayment';

function mountApp(targetElement) {
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
