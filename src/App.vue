<template>
  <div class="app" :class="{'_in-modal': isInModal}">
    <div class="app__inner">
      <button class="app__close" v-if="isInModal" @click="$root.$emit('closeModal')">
        <IconClose width="16" height="16" fill="#999" />
      </button>

      <PaymentForm v-if="orderID" ref="paymentForm" />
      <div class="app-failed" v-else>
        <base-error-text>
          <p v-for="text in $t('paymentInitFailed')" :key="text">{{text}}</p>
        </base-error-text>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import PaymentForm from './components/PaymentForm.vue';
import IconClose from './components/IconClose.vue';
import modalTools from './modalTools';

export default {
  name: 'App',
  props: {
    isInModal: {
      type: Boolean,
      default: false,
    },
    destroyHandler: {
      default: undefined,
    },
    iframeResizeHandler: {
      default: undefined,
    },
  },
  components: {
    PaymentForm,
    IconClose,
  },

  computed: {
    ...mapState('PaymentForm', [
      'orderID',
    ]),
  },

  mounted() {
    if (this.isInModal) {
      modalTools.hideBodyScrollbar();
      this.$on('closeModal', () => {
        modalTools.showBodyScrollbar();
        this.$destroy();
        this.destroyHandler();
      });
    } else {
      if (!this.$refs.paymentForm) {
        return;
      }
      const formEl = this.$refs.paymentForm.$el;

      this.iframeResizeHandler({
        height: formEl.offsetHeight,
        width: formEl.offsetWidth,
      });
      this.$on('requestIframeResize', () => {
        setTimeout(() => {
          this.iframeResizeHandler({
            height: formEl.offsetHeight,
            width: formEl.offsetWidth,
          });
        }, 0);
      });
    }
  },
};
</script>

<i18n>
{
  "en": {
    "paymentInitFailed": [
      "Payment form initialization failed.",
      "This is probably happened because we could not handle payment request.",
      "Try again after refreshing the page or later."
    ]
  },
  "ru": {
    "paymentInitFailed": [
      "Не удалось отображить форму оплаты.",
      "Скорее всего, проблема в том, что мы не смогли обратать запрос на создание платежа.",
      "Попробуйте снова, обновив страницу. Либо, попробуйте позже."
    ]
  }
}
</i18n>
