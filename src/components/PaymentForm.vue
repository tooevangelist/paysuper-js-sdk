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
        <div>
          <BaseTextField
            class="payment-form__email-field"
            v-if="!initialEmail"
            v-model="email"
            :hasError="$isFieldInvalid('email')"
            :errors="$getFieldErrorMessages('email')"
            name="email"
            placeholder="Enter your email"
          />
          <div class="payment-form__payment-failed" v-if="isPaymentErrorVisible">
            <base-error-text>
              {{ $t('paymentFailedMessage') }}
            </base-error-text>
          </div>
        </div>
        <base-button type="submit" :isLoading="isLoading">Proceed</base-button>

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

  computed: {
    ...mapState('PaymentForm', [
      'orderID',
      'account',
      'project',
      'initialEmail',
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

  watch: {
    bankCard() {
      this.$requestIframeResize();
    },
    ewallet() {
      this.$requestIframeResize();
    },
    email() {
      this.$requestIframeResize();
    },
    activePaymentMethodID() {
      this.$requestIframeResize();
    },
  },

  validations() {
    if (this.isBankCardPayment) {
      if (this.initialEmail) {
        return {};
      }

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

  methods: {
    ...mapActions('PaymentForm', ['setActivePaymentMethod', 'createPayment', 'hidePaymentError']),

    submitPaymentForm() {
      this.$requestIframeResize();
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
        email: this.initialEmail || this.email,
      });
    },
  },
};
</script>

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
