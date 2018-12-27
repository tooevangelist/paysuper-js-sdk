import getPostMessageMethod from './postMessage';

const handlers = {
  inited(eventData, formData) {
    if (process.env.NODE_ENV !== 'development') {
      return;
    }
    const postMessage = getPostMessageMethod(this.iframe.contentWindow);
    postMessage('REQUEST_INIT_FORM', {
      formData,
      options: {
        email: this.email,
        language: this.language,
      },
    });
  },

  formResize({ width, height }) {
    this.iframe.setAttribute('width', width);
    this.iframe.setAttribute('height', height);
  },

  paymentCreated({ redirectUrl }) {
    // Hacking browser popups blocking policity
    const link = document.createElement('a');
    document.body.appendChild(link);
    link.setAttribute('href', redirectUrl);
    link.setAttribute('target', '_blank');
    link.click();
    setTimeout(() => {
      link.parentNode.removeChild(link);
    });
  },
};

export default function handleIframeMessages(formData) {
  window.addEventListener('message', (event) => {
    if (event.data && event.data.source !== 'PAYONE_PAYMENT_FORM') {
      return;
    }

    const { name, data } = event.data;
    const handler = handlers[name];
    if (handler) {
      handler.call(this, data, formData);
    }
    this.emit(name);
  });
}
