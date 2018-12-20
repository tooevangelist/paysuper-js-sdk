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

const P1PayOne = getP1PayOne(async (el, initStateOptions, { isInModal, destroyHandler }) => {
  await store.dispatch('PaymentForm/initState', initStateOptions);

  new Vue({
    store,
    i18n,
    render: h => h(App, {
      props: {
        isInModal,
      },
    }),
    mounted() {
      this.$on('closeModal', () => {
        destroyHandler(this);
      });
    },
  }).$mount(el);
});

Vue.config.productionTip = false;

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
  payoneForm.setAmount(5).renderModal();
}
