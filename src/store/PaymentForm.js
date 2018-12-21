import axios from 'axios';
import { find } from 'lodash-es';
import { apiPathCreateOrder } from '../settings';

export default {
  namespaced: true,

  state: {
    orderID: '',
    account: '',
    project: null,
    initialEmail: '',
    paymentMethods: [],
    activePaymentMethodID: '',
    isLoading: false,
    isPaymentErrorVisible: false,
  },

  getters: {
    activePaymentMethod(state) {
      return find(state.paymentMethods, { id: state.activePaymentMethodID });
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
    initialEmail(state, value) {
      state.initialEmail = value;
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
    async initState({ commit }, {
      projectID, region, amount, currency,
      email,
      paymentMethod,
      account,
    }) {
      const { data } = await axios.post(apiPathCreateOrder, {
        region,
        amount,
        currency,
        account,
        project: projectID,
        payment_method: paymentMethod,
        payer_ip: '77.233.9.26',
      });

      commit('orderID', data.id);
      commit('account', data.account);
      commit('project', data.project);
      commit('initialEmail', email);
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
          apiPathCreateOrder,
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
