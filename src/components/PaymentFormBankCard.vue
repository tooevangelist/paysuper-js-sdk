<template>
  <div class="payment-form-bank-card">
    <div class="payment-form-bank-card__row">
      <BaseTextField
        v-model="innerValue.cardNumber"
        :hasError="$isFieldInvalid('innerValue.cardNumber')"
        :errors="$getFieldErrorMessages('innerValue.cardNumber')"
        mask="#### #### #### ####"
        name="pan"
        placeholder="Card Number"
      />
    </div>

    <div class="payment-form-bank-card__row">
      <div class="payment-form-bank-card-expire">
        <div class="payment-form-bank-card-expire__item">
          <BaseTextField
            v-model="innerValue.month"
            :hasError="$isFieldInvalid('innerValue.month')"
            :errors="$getFieldErrorMessages('innerValue.month')"
            mask="##"
            name="month"
            placeholder="MM"
            maxlength="2"
          />
        </div>
        <div class="payment-form-bank-card-expire__delimiter">/</div>
        <div class="payment-form-bank-card-expire__item">
          <BaseTextField
            v-model="innerValue.year"
            :hasError="$isFieldInvalid('innerValue.year')"
            :errors="$getFieldErrorMessages('innerValue.year')"
            mask="##"
            name="year"
            placeholder="YY"
            maxlength="2"
          />
        </div>
      </div>
      <div class="payment-form-bank-card__cvv">
        <BaseTextField
          v-model="innerValue.cvv"
          :hasError="$isFieldInvalid('innerValue.cvv')"
          :errors="$getFieldErrorMessages('innerValue.cvv')"
          mask="###"
          type="password"
          name="cvv"
          placeholder="CVV" maxlength="3"
        />
      </div>
    </div>

    <div class="payment-form-bank-card__row">
      <BaseTextField
        v-model="innerValue.cardHolder"
        :hasError="$isFieldInvalid('innerValue.cardHolder')"
        :errors="$getFieldErrorMessages('innerValue.cardHolder')"
        name="card_holder"
        placeholder="Card Holder"
      />
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import { required, between, minLength } from 'vuelidate/lib/validators';

export default {
  model: {
    prop: 'value',
    event: 'change',
  },

  name: 'PaymentFormBankCard',

  props: {
    value: {
      required: true,
      type: Object,
      validator(value) {
        return (
          _.has(value, 'cardNumber')
          && _.has(value, 'month')
          && _.has(value, 'year')
          && _.has(value, 'cvv')
          && _.has(value, 'cardHolder')
        );
      },
    },
  },

  data() {
    return {
      innerValue: _.extend({}, this.value),
    };
  },

  validations: {
    innerValue: {
      cardNumber: {
        required,
        minLength: minLength(16),
      },
      month: {
        required,
        between: between(1, 12),
      },
      year: {
        required,
      },
      cvv: {
        required,
      },
      cardHolder: {
        required,
      },
    },
  },

  watch: {
    value(value) {
      _.extend(this.innerValue, value);
    },

    innerValue: {
      handler(value) {
        this.$emit('change', value);
      },
      deep: true,
    },
  },

  methods: {
    validate() {
      this.$v.$touch();
      return {
        isValid: !this.$v.$invalid,
      };
    },
  },
};
</script>

<style lang="scss">
@import "@assets/styles/gui.scss";

.payment-form-bank-card {
  width: 320px;
  padding: 20px;
  border: 1px solid $ui-color-grey87;
  background: $ui-color-grey96;

  &__row {
    display: flex;
    justify-content: space-between;

    & + & {
      margin-top: 10px;
    }
  }

  &__cvv {
    width: 30%;
  }
}

.payment-form-bank-card-expire {
  width: 50%;
  display: flex;

  &__item {
    width: 30%;
    flex-basis: 0;
    flex-grow: 1;
  }

  &__delimiter {
    width: 12px;
    text-align: center;
    height: 34px;
    line-height: 34px;
  }
}
</style>
