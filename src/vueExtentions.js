import Vue from 'vue';
import _ from 'lodash';

Vue.prototype.$getFieldErrorMessages = function $getFieldErrorMessages(fieldPath) {
  const field = _.get(this.$v, fieldPath);

  if (!field) {
    return [];
  }

  return Object.keys(field.$params).filter(name => !field[name])
    .map((name) => {
      const message = this.$t(`errorMessages.${name}`);
      const params = field.$params[name];
      return message.replace(/%(.+?)%/g, (a, variable) => params[variable]);
    });
};

Vue.prototype.$isFieldInvalid = function $isFieldInvalid(fieldPath) {
  const field = _.get(this.$v, fieldPath);
  if (!field) {
    return false;
  }
  return Boolean(field.$invalid && field.$dirty);
};
