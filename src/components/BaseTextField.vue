<template>
  <div class="base-text-field"
    :class="{'base-text-field_error': hasError}">

    <TheMask
      class="base-text-field__input"
      v-if="mask"
      v-bind="$attrs"
      v-model="innerValue"
      :type="type"
      :mask="mask"
      @input="$emit('input', innerValue)"
      @focus="$emit('focus', $event), hasFocus = true"
      @blur="$emit('blur', $event), hasFocus = false" />

    <input
      class="base-text-field__input"
      v-else
      v-bind="$attrs"
      v-model="innerValue"
      :type="type"
      :mask="mask"
      @input="$emit('input', innerValue)"
      @focus="$emit('focus', $event), hasFocus = true"
      @blur="$emit('blur', $event), hasFocus = false" />

    <BaseErrorText v-if="hasError" :value="errors" />

  </div>
</template>

<script>
import { TheMask } from 'vue-the-mask';

export default {
  components: {
    // eslint-disable-next-line
    TheMask,
  },

  model: {
    prop: 'value',
    event: 'input',
  },

  props: {
    value: {
      type: String,
      default: '',
    },
    mask: {
      default: false,
    },
    hasError: {
      type: Boolean,
      default: false,
    },
    errors: {
      type: [Array, String],
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
  },

  watch: {
    value(value) {
      this.innerValue = value;
    },
  },

  data() {
    return {
      innerValue: this.value,
      hasFocus: false,
    };
  },
};
</script>
