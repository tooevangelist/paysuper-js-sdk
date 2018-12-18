<template>
  <div class="container">
    <LocaleChanger v-if="false" />
    <PaymentForm/>
  </div>
</template>

<script>
import LocaleChanger from './components/LocaleChanger.vue';
import PaymentForm from './components/PaymentForm.vue';

export default {
  name: 'Root',
  components: {
    LocaleChanger,
    PaymentForm,
  },
};
</script>

<style lang="scss" scoped>
@import "@assets/styles/gui.scss";

.container {
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.3);
  background: $ui-color-white;
  width: 560px;
  margin: 15px auto 0;
}
</style>
