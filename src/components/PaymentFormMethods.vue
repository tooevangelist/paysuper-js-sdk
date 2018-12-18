<template>
  <div class="payment-form-methods">
    <div
      class="payment-form-methods__item"
      v-for="method in paymentMethods"
      :key="method.id"
      :class="{'_active': activePaymentMethodID === method.id}"
      @click="$emit('setMethod', method.id)"
    >
      <span
        class="payment-form-methods__icon"
        :style="{backgroundImage: `url(${method.icon})`}"
      ></span>
      <span class="payment-form-methods__name">
        {{method.name}}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PaymentFormMethods',

  props: {
    paymentMethods: {
      required: true,
      type: Array,
    },

    activePaymentMethodID: {
      required: true,
      type: String,
    },
  },
};
</script>

<style lang="scss">
@import "@assets/styles/gui.scss";

.payment-form-methods {
  display: flex;

  &__item {
    height: 80px;
    padding: 8px;
    border: 1px solid $ui-color-grey87;
    text-align: center;
    flex-grow: 1;
    flex-basis: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: $ui-color-grey96;
    cursor: pointer;

    & + & {
      margin-left: 6px;
    }

    &._active {
      background: #fff;
      box-shadow: inset 0 -5px $ui-color-yellow;
      cursor: default;
    }
  }

  &__icon {
    width: 70%;
    height: 70%;
    margin-bottom: 5px;
    display: block;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }

  &__name {
  }
}
</style>
