import axios from 'axios';
import _ from 'lodash';

export default {
  namespaced: true,

  state: {
    orderID: '',
    account: '',
    project: null,
    paymentMethods: [],
    activePaymentMethodID: '',
    isLoading: false,
    isPaymentErrorVisible: false,
  },

  getters: {
    activePaymentMethod(state) {
      return _.find(state.paymentMethods, { id: state.activePaymentMethodID });
    },
  },

  mutations: {
    orderID(state, value) {
      state.orderID = value;
    },
    account(state, value) {
      state.account = value;
    },
    project(state, value) {
      state.project = value;
    },
    paymentMethods(state, value) {
      state.paymentMethods = value;
    },
    activePaymentMethodID(state, value) {
      state.activePaymentMethodID = value;
    },
    isLoading(state, value) {
      state.isLoading = value;
    },
    isPaymentErrorVisible(state, value) {
      state.isPaymentErrorVisible = value;
    },
  },

  actions: {
    async initState({ commit }) {
      const { data } = await axios.post('https://p1payapi.tst.protocol.one/api/v1/order', {
        amount: 5,
        project: '5be2e16701d96d00012d26c3',
        region: 'US',
        payer_ip: '77.233.9.26',
        currency: 'USD',
      });

      commit('orderID', data.id);
      commit('account', data.account);
      commit('project', data.project);
      commit('paymentMethods', data.payment_methods);
      commit('activePaymentMethodID', data.payment_methods[0].id);
    },

    setActivePaymentMethod({ commit }, value) {
      commit('activePaymentMethodID', value);
    },

    hidePaymentError({ commit }) {
      commit('isPaymentErrorVisible', false);
    },

    async createPayment({ state, getters, commit }, {
      cardNumber, month, year, cvv, cardHolder, ewallet, email,
    }) {
      commit('isLoading', true);

      const request = {
        email,
        month,
        year,
        cvv,
        card_holder: cardHolder,
        order_id: state.orderID,
        pan: cardNumber,
        payment_method_id: state.activePaymentMethodID,
      };
      if (getters.activePaymentMethod.type === 'crypto') {
        request.address = ewallet;
      } else {
        request.ewallet = ewallet;
      }

      try {
        const { data } = await axios.post(
          'https://p1payapi.tst.protocol.one/api/v1/payment',
          request,
        );
        window.location.href = data.redirect_url;
      } catch (error) {
        console.error(error);
        commit('isPaymentErrorVisible', true);
      }
      commit('isLoading', false);
    },
  },
};
