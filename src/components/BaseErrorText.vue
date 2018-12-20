<template>
  <div class="base-error-text">
    <div v-for="(message, index) in messages" :key="index">{{message}}</div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'BaseErrorText',

  props: {
    value: {
      type: [Array, String],
    },
  },

  computed: {
    messages() {
      if (Array.isArray(this.value)) {
        return this.value;
      }

      return [this.value];
    },
  },
};
</script>
