import { extend } from 'lodash-es';

/**
* Creates iframe container for payment form
*
* @param {String} iframeSrc
* @return {Object}
*/
export function createIframe(iframeSrc, containerToAppend, language) {
  const iframe = document.createElement('iframe');

  iframe.setAttribute('allowpaymentrequest', 'true');
  iframe.setAttribute('frameborder', '0');
  iframe.style.overflow = 'hidden';
  iframe.style.display = 'block';
  iframe.className = 'paysuper-js-sdk-modal-layer__iframe paysuper-js-sdk-modal-layer__iframe--loading';

  // These sizes are initial
  // Right after App is mounted actual form size is transferred to iframe
  iframe.setAttribute('width', '100%');
  iframe.setAttribute('height', '100%');

  containerToAppend.appendChild(iframe);

  if (!iframeSrc) {
    const iframeBody = iframe.contentDocument.body;
    extend(iframeBody.style, {
      backgroundColor: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      fontFamily: 'Helvetica, Arial, sans-serif',
      fontSize: '15px',
      lineHeight: '20px',
    });

    if (language === 'ru') {
      iframeBody.innerHTML = 'Извините, прием <br />платежей временно недоступен';
    } else {
      iframeBody.innerHTML = 'Sorry, payments <br />are temporarily unavailable';
    }
    return iframe;
  }

  iframe.setAttribute('src', iframeSrc);
  return iframe;
}

export function createModalLayer() {
  const modalLayer = document.createElement('div');
  modalLayer.className = 'paysuper-js-sdk-modal-layer';
  return { modalLayer };
}
