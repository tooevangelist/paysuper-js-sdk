import { extend } from 'lodash-es';

/**
* Creates iframe container for payment form
*
* @param {String} iframeSrc
* @return {Object}
*/
export function createIframe(iframeSrc, containerToAppend) {
  const iframe = document.createElement('iframe');

  iframe.setAttribute('allowpaymentrequest', 'true');
  iframe.setAttribute('frameborder', '0');
  iframe.style.overflow = 'hidden';
  iframe.style.display = 'block';
  iframe.className = 'paysuper-js-sdk-modal-layer__iframe';

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

    return iframe;
  }

  iframe.setAttribute('src', iframeSrc);
  return iframe;
}

export function createModalLayer() {
  const modalLayer = document.createElement('div');
  modalLayer.className = 'paysuper-js-sdk-modal-layer paysuper-js-sdk-modal-layer--loading';
  const preloader = document.createElement('div');
  preloader.className = 'paysuper-js-sdk-modal-layer__preloader';

  modalLayer.appendChild(preloader);
  return { modalLayer };
}
