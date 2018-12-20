<template>
  <div class="app" :class="{'_in-modal': isInModal}">
    <div class="app__inner">
      <button class="app__close" v-if="isInModal" @click="$root.$emit('closeModal')">
        <IconClose width="16" height="16" fill="#999" />
      </button>

      <PaymentForm ref="paymentForm" />
    </div>
  </div>
</template>

<script>
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

  mounted() {
    if (this.isInModal) {
      modalTools.hideBodyScrollbar();
      this.$on('closeModal', () => {
        modalTools.showBodyScrollbar();
        this.$destroy();
        this.destroyHandler();
      });
    } else {
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
