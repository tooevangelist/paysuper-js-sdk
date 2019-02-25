import assert from 'assert';
import { invert } from 'lodash-es';

export const payonePaymentFormSourceName = 'PAYSUPER_PAYMENT_FORM';

export const sendingMessagesNames = {
  REQUEST_INIT_FORM: 'requestInitForm',
};

/**
 * If a status is not in list the SDK won't react on it (no handling, no event emmitting)
 */
export const receivingMessagesNames = invert({
  INITED: 'inited',
  LOADED: 'loaded',
  FORM_RESIZE: 'formResize',
  PAYMENT_BEFORE_CREATED: 'paymentBeforeCreated',
  PAYMENT_CREATED: 'paymentCreated',
  PAYMENT_FAILED_TO_CREATE: 'paymentFailedToCreate',
  PAYMENT_PENDING: 'paymentPending',
  PAYMENT_COMPLETED: 'paymentCompleted',
  PAYMENT_CANCELLED: 'paymentCancelled',
  PAYMENT_DECLINED: 'paymentDeclined',
  PAYMENT_INTERRUPTED: 'paymentInterrupted',
  ORDER_RECREATE_STARTED: 'orderRecreateStarted',
});

export function postMessage(targetWindow, nameID, data = {}) {
  const name = sendingMessagesNames[nameID];
  assert(name, `Undefiend postMessage nameID: ${nameID}`);
  targetWindow.postMessage({
    source: 'PAYSUPER_JS_SDK',
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
    const messageAlias = receivingMessagesNames[name];
    if (!messageAlias) {
      return;
    }
    callbackEvery(name, event.data.data);
    const callback = objectWithCallbacks[messageAlias];
    if (!callback) {
      return;
    }
    callback(event.data.data);
  });
}
