import assert from 'assert';

export const messageNames = {
  REQUEST_INIT_FORM: 'requestInitForm',
};

export default function getPostMessageMethod(targetWindow) {
  assert(targetWindow, 'postMessage requires target window');

  return function postMessage(nameID, data = {}) {
    const name = messageNames[nameID];
    assert(name, `Undefiend postMessage nameID: ${nameID}`);
    targetWindow.postMessage({
      source: 'PAYONE_JS_SDK',
      name,
      data,
    }, '*');
  };
}
