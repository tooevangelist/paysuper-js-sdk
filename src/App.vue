<template>
  <div>
    <center>
      <img alt="Vue logo" src="./assets/logo.png">
    </center>
    <div class="container">
      <LocaleChanger/>
      <h1>{{ $t('title') }}</h1>
    </div>
  </div>
</template>

<script>
import LocaleChanger from './components/LocaleChanger.vue';

export default {
  name: 'Root',
  components: {
    LocaleChanger,
  },
};
</script>

<style lang="scss" scoped>
@import "assets/styles/gui.scss";

.container {
  font-family: $ui-font-family-common;
  color: $ui-color-grey13;
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.3);
  background: $ui-color-white;
  padding: 20px;
  width: 500px;
  margin: 15px auto 0;
}
</style>

<i18n>
{
  "ru": {
    "title": "Платежи ProtocolONE"
  },
  "en": {
    "title": "ProtocolONE Payments"
  }
}
</i18n>
