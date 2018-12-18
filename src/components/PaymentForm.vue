<template>
  <div class="payment-form">
    <div class="payment-form-head">
      <div class="payment-form-head__title">{{project.name}}</div>
      <div class="payment-form-head__summ">
        {{activePaymentMethod.amount_with_commissions}}
        {{activePaymentMethod.currency}}
      </div>
      <div class="payment-form-head__delimiter-text">{{ $t('ofThem') }}:</div>
      <div>
        {{ $t('vat') }}:
        {{activePaymentMethod.vat_amount}}
        {{activePaymentMethod.currency}}
      </div>
      <div>
        {{ $t('commission') }}:
        {{activePaymentMethod.user_commission_amount}}
        {{activePaymentMethod.currency}}
      </div>
      <div class="payment-form-info">
        <div class="payment-form-info__item">
          <span class="payment-form-info__key">Order #:</span>
          <span class="payment-form-info__value">{{orderID}}</span>
        </div>
        <div class="payment-form-info__item" v-if="account">
          <span class="payment-form-info__key">Account:</span>
          <span class="payment-form-info__value">{{account}}</span>
        </div>
      </div>
    </div>
    <form @submit.prevent="submitPaymentForm">
      <div class="payment-form__methods">
        <PaymentFormMethods
          :paymentMethods="paymentMethods"
          :activePaymentMethodID="activePaymentMethodID"
          @setMethod="setActivePaymentMethod"
        />
      </div>
      <div class="payment-form__forms">
        <PaymentFormBankCard
          v-if="isBankCardPayment"
          v-model="bankCard"
          ref="bankCardForm"
        />
        <BaseTextField
          class="payment-form__ewallet-field"
          v-else
          v-model="ewallet"
          :placeholder="`Enter ${activePaymentMethod.name} wallet number`"
          :hasError="$isFieldInvalid('ewallet')"
          :errors="$getFieldErrorMessages('ewallet')"
        />
      </div>
      <div class="payment-form__finish-form">
        <BaseTextField
          class="payment-form__email-field"
          v-model="email"
          :hasError="$isFieldInvalid('email')"
          :errors="$getFieldErrorMessages('email')"
          name="email"
          placeholder="Enter your email"
        />
        <base-button type="submit" :isLoading="isLoading">Proceed</base-button>
        <div class="payment-form__payment-failed" v-if="isPaymentErrorVisible">
          <base-error-text>
            {{ $t('paymentFailedMessage') }}
          </base-error-text>
        </div>
      </div>

    </form>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { required, email } from 'vuelidate/lib/validators';
import PaymentFormMethods from './PaymentFormMethods.vue';
import PaymentFormBankCard from './PaymentFormBankCard.vue';

export default {
  name: 'PaymentForm',

  components: {
    PaymentFormMethods,
    PaymentFormBankCard,
  },

  data() {
    return {
      bankCard: {
        cardNumber: '',
        month: '',
        year: '',
        cvv: '',
        cardHolder: '',
      },

      ewallet: '',
      email: '',
    };
  },

  validations() {
    if (this.isBankCardPayment) {
      return {
        email: {
          required,
          email,
        },
      };
    }

    return {
      ewallet: {
        required,
      },
    };
  },

  computed: {
    ...mapState('PaymentForm', [
      'orderID',
      'account',
      'project',
      'paymentMethods',
      'activePaymentMethodID',
      'isLoading',
      'isPaymentErrorVisible',
    ]),
    ...mapGetters('PaymentForm', ['activePaymentMethod']),

    isBankCardPayment() {
      return this.activePaymentMethod.type === 'bank_card';
    },
  },

  methods: {
    ...mapActions('PaymentForm', ['setActivePaymentMethod', 'createPayment', 'hidePaymentError']),

    submitPaymentForm() {
      this.hidePaymentError();
      this.$v.$touch();

      const isValidArray = [
        !this.$v.$invalid,
      ];

      if (this.isBankCardPayment) {
        const { isValid } = this.$refs.bankCardForm.validate();
        isValidArray.push(isValid);
      }

      if (isValidArray.filter(item => !item).length) {
        // has errors
        return;
      }

      this.createPayment({
        ...this.bankCard,
        ewallet: this.ewallet,
        email: this.email,
      });
    },
  },
};
</script>

<style lang="scss">
@import "@assets/styles/gui.scss";

.payment-form {
  background: $ui-color-white;
  border: 1px solid $ui-color-grey87;
  width: 560px;
  box-sizing: border-box;
  color: $ui-color-grey13;
  font-family: $ui-font-family-common;
  font-size: 13px;
  line-height: 16px;

  * {
    box-sizing: border-box;
  }

  &__methods {
    padding: 15px 20px;
    border-bottom: 1px solid $ui-color-grey87;
  }

  &__forms {
    min-height: 200px;
    padding: 10px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid $ui-color-grey87;
  }

  &__finish-form {
    padding: 20px;
    background: $ui-color-grey96;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  &__email-field {
    max-width: 60%;
  }

  &__ewallet-field {
    max-width: 70%;
  }

  &__payment-failed {
    width: 100%;
    margin-top: 5px;
  }
}

.payment-form-head {
  padding: 15px 20px;
  border-bottom: 1px solid $ui-color-grey87;

  &__title {
    font-size: 18px;
    font-weight: 400;
    line-height: 25px;
  }

  &__summ {
    font-weight: 400;
    font-size: 32px;
    line-height: 40px;
  }

  &__delimiter-text {
    margin-bottom: 8px;
  }
}

.payment-form-info {
  margin-top: 20px;

  &__item {
    display: flex;
  }

  &__key {
    color: $ui-color-grey47;
    width: 80px;
  }

  &__value {
  }
}
</style>

<i18n>
{
  "en": {
    "ofThem": "of them",
    "vat": "VAT",
    "commission": "Commission",
    "paymentFailedMessage": "Payment request failed. Please try again later"
  },
  "ru": {
    "ofThem": "из них",
    "vat": "НДС",
    "commission": "Комиссия",
    "paymentFailedMessage": "Платёж не удался. Пожалуйста, попробуйте ещё раз позже"
  }
}
</i18n>
