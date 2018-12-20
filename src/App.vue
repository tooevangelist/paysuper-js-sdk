<template>
  <div class="app" :class="{'_in-modal': isInModal}">
    <div class="app__inner">
      <button class="app__close" v-if="isInModal" @click="$root.$emit('closeModal')">
        <IconClose width="16" height="16" fill="#999" />
      </button>

      <PaymentForm/>
    </div>
  </div>
</template>

<script>
import PaymentForm from './components/PaymentForm.vue';
import IconClose from './components/IconClose.vue';

export default {
  name: 'App',
  props: {
    isInModal: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    PaymentForm,
    IconClose,
  },
};
</script>
