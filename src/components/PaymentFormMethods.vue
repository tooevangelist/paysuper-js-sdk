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
