import assert from 'assert';
import { invert } from 'lodash-es';

export const payonePaymentFormSourceName = 'PAYONE_PAYMENT_FORM';

export const sendingMessagesNames = {
  REQUEST_INIT_FORM: 'requestInitForm',
};

export const receivingMessagesNames = invert({
  INITED: 'inited',
  LOADED: 'loaded',
  FORM_RESIZE: 'formResize',
  PAYMENT_CREATED: 'paymentCreated',
  PAYMENT_FAILED_TO_CREATE: 'paymentFailedToCreate',
  // PAYMENT_DELIVERING: 'statusDelivering',
  // PAYMENT_TROUBLED: 'statusTroubled',
  PAYMENT_DONE: 'statusDone',
});

export function postMessage(targetWindow, nameID, data = {}) {
  const name = sendingMessagesNames[nameID];
  assert(name, `Undefiend postMessage nameID: ${nameID}`);
  targetWindow.postMessage({
    source: 'PAYONE_JS_SDK',
    name,
    data,
  }, '*');
}

export function receiveMessages(from, objectWithCallbacks, callbackEvery) {
  from.addEventListener('message', (event) => {
    if (event.data && event.data.source !== payonePaymentFormSourceName) {
      return;
    }
    const { name } = event.data;
    const callback = objectWithCallbacks[receivingMessagesNames[name]];
    if (!callback) {
      return;
    }
    callback(event.data.data);
    callbackEvery(name, event.data.data);
  });
}
