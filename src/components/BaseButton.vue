<template>
  <button
    class="base-button"
    :type="type"
    :class="viewClass"
    :disabled="disabled"
  >
    <IconLoadingAnimated
      class="base-button__loading"
      v-if="isLoading"
      width="13"
      height="13"
      stroke="#333"
    />
    <slot></slot>
  </button>
</template>
<script>
import IconLoadingAnimated from './IconLoadingAnimated.vue';

export default {
  components: {
    IconLoadingAnimated,
  },
  props: {
    color: {
      default: 'yellow',
      type: String,
      validator(value) {
        const values = [
          'yellow',
        ];
        return values.indexOf(value) !== -1;
      },
    },

    size: {
      default: 'default',
      type: String,
      validator(value) {
        const values = ['default'];
        return values.indexOf(value) !== -1;
      },
    },

    type: {
      default: 'button',
      type: String,
      validator(value) {
        const values = ['button', 'submit', 'reset'];
        return values.indexOf(value) !== -1;
      },
    },

    isLoading: {
      default: false,
      type: Boolean,
    },

    disabled: {
      default: false,
      type: Boolean,
    },
  },

  computed: {
    viewClass() {
      const result = [`_color-${this.color}`, `_size-${this.size}`];
      if (this.pressed) {
        result.push('_pressed');
      }
      return result;
    },
  },
};
</script>
