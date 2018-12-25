const handlers = {
  init(iframe, eventData, dataForSend) {
    if (process.env.NODE_ENV !== 'development') {
      return;
    }
    iframe.contentWindow.postMessage({
      source: 'PAYONE_JS_SDK',
      data: dataForSend,
    }, '*');
  },

  formResize(iframe, { width, height }) {
    iframe.setAttribute('width', width);
    iframe.setAttribute('height', height);
  },

};

export default function handleIframeMessages(iframe, dataForSend) {
  window.addEventListener('message', (event) => {
    if (event.data.source !== 'PAYONE_PAYMENT_FORM') {
      return;
    }

    const { name, data } = event.data;
    const handler = handlers[name];
    if (handler) {
      handler(iframe, data, dataForSend);
    }
    this.emit(`payform:${name}`);
  });
}
