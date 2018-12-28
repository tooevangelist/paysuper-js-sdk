import { getPaymentFormUrl } from './settings';

/**
 * Comes from "payone-js-payment-form" package devServer options
 */

/**
* Creates iframe container for payment form
*
* @param {String} orderId
* @return {Object}
*/
export function createIframe(orderId) {
  const iframeSrc = getPaymentFormUrl(orderId);
  const iframe = document.createElement('iframe');
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('src', iframeSrc);
  iframe.style.overflow = 'hidden';
  iframe.style.display = 'block';

  return iframe;
}

export function createModalLayer() {
  const modalLayer = document.createElement('div');
  modalLayer.className = 'p1payone-js-sdk-modal-layer';

  const modalLayerInner = document.createElement('div');
  modalLayerInner.className = 'p1payone-js-sdk-modal-layer__inner';
  modalLayer.appendChild(modalLayerInner);

  const closeButton = document.createElement('span');
  closeButton.className = 'p1payone-js-sdk-modal-layer__close';
  closeButton.innerHTML = `
    <svg viewBox="0 0 8 8" width="16" height="16" fill="#999" xmlns="http://www.w3.org/2000/svg">
      <g>
        <path d="M6.82118 0.202253C7.09085 -0.0674173 7.52808 -0.0674171 7.79775 0.202253C8.06742 0.471924 8.06742 0.909146 7.79775 1.17882L1.17882 7.79775C0.909146 8.06742 0.471923 8.06742 0.202253 7.79775C-0.0674175 7.52808 -0.0674177 7.09085 0.202253 6.82118L6.82118 0.202253Z"/>
        <path d="M7.79775 6.82118C8.06742 7.09085 8.06742 7.52808 7.79775 7.79775C7.52808 8.06742 7.09085 8.06742 6.82118 7.79775L0.202254 1.17882C-0.0674168 0.909146 -0.0674165 0.471923 0.202254 0.202253C0.471925 -0.0674177 0.909147 -0.0674176 1.17882 0.202253L7.79775 6.82118Z"/>
      </g>
    </svg>
  `;

  modalLayerInner.appendChild(closeButton);

  return { modalLayer, modalLayerInner, closeButton };
}
