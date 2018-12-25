import assert from 'simple-assert';
import axios from 'axios';
import Events from 'events';
import { extend } from 'lodash-es';
import { apiPathGetProjectPackages, apiPathCreateOrder } from './settings';
import handleIframeMessages from './handleIframeMessages';
import modalTools from './modalTools';

/**
 * Returns DOM element by selector or actual DOM element
 *
 * @param {String|DomElement} container
 * @param {DomElement} element
 * @return {DomElement}
 */
function appendElementToContainer(container, element) {
  const trustedContainer = typeof container === 'string'
    ? document.querySelector(container)
    : container;
  assert(trustedContainer, 'Append container element is not found');
  trustedContainer.appendChild(element);
}

/**
 * Comes from "payone-js-payment-form" package devServer options
 */
const iframeSrc = 'http://localhost:4040/';

function createModalLayer() {
  const modalLayer = document.createElement('div');
  const modalLayerInner = document.createElement('div');
  modalLayer.appendChild(modalLayerInner);
  const closeButton = document.createElement('span');
  closeButton.innerHTML = `
    <svg viewBox="0 0 8 8" width="16" height="16" fill="#fff" xmlns="http://www.w3.org/2000/svg">
      <g>
        <path d="M6.82118 0.202253C7.09085 -0.0674173 7.52808 -0.0674171 7.79775 0.202253C8.06742 0.471924 8.06742 0.909146 7.79775 1.17882L1.17882 7.79775C0.909146 8.06742 0.471923 8.06742 0.202253 7.79775C-0.0674175 7.52808 -0.0674177 7.09085 0.202253 6.82118L6.82118 0.202253Z"/>
        <path d="M7.79775 6.82118C8.06742 7.09085 8.06742 7.52808 7.79775 7.79775C7.52808 8.06742 7.09085 8.06742 6.82118 7.79775L0.202254 1.17882C-0.0674168 0.909146 -0.0674165 0.471923 0.202254 0.202253C0.471925 -0.0674177 0.909147 -0.0674176 1.17882 0.202253L7.79775 6.82118Z"/>
      </g>
    </svg>
  `;

  modalLayerInner.appendChild(closeButton);

  extend(modalLayer.style, {
    width: '100%',
    height: '100%',
    position: 'fixed',
    background: 'rgba(0, 0, 0, 0.6)',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  });

  extend(modalLayerInner.style, {
    paddingTop: '50px',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    boxSizing: 'border-box',
    position: 'relative',
    overflow: 'auto',
  });

  extend(closeButton.style, {
    cursor: 'pointer',
    position: 'absolute',
    right: '10px',
    top: '10px',
    padding: '10px',
  });

  return { modalLayer, modalLayerInner, closeButton };
}

/**
 * Creates iframe container for payment form
 *
 * @return {Object}
 */
function createIframe() {
  const iframe = document.createElement('iframe');
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('src', iframeSrc);
  iframe.style.overflow = 'hidden';

  return iframe;
}

/**
 * Converts region value to uppercase, throw errors on incorrect values
 *
 * @param {String} value example: "US"
 * @param {Object} navigator browser global object
 * @return {String}
 */
export function getRegion(value, navigator) {
  if (!value) {
    if (navigator && navigator.language && navigator.language.indexOf('-') !== -1) {
      return navigator.language.split('-')[1];
    }
    return 'US';
  }

  assert(typeof value === 'string', 'Region value must be a string');
  assert(value.length === 2, 'Region value must be in 2-characters format');
  return value.toUpperCase();
}

/**
 * Converts region value to uppercase, throw errors on incorrect values
 *
 * @param {String} value example: "en"
 * @param {Object} navigator browser global object
 * @return {String}
 */
export function getLanguage(value) {
  if (!value) {
    return undefined;
  }
  assert(typeof value === 'string', 'Language value must be a string');
  assert(value.length === 2, 'Language value must be in 2-characters format');
  return value.toLowerCase();
}

export default class P1PayOne extends Events.EventEmitter {
  constructor({
    projectID, region, email, paymentMethod, account, language,
  } = {}) {
    super();
    assert(projectID, 'projectID is required for "new P1PayOne(...)"');
    this.projectID = projectID;
    this.region = getRegion(region, navigator);
    this.language = getLanguage(language);
    this.email = email;
    this.paymentMethod = paymentMethod;
    this.account = account;

    this.currency = 'USD';
    this.amount = undefined;
  }

  /**
   * Renders the payment form into target element
   *
   * @param {String|DomElement} appendContainer
   * @return {P1PayOne}
   */
  async renderInElement(appendContainer) {
    assert(appendContainer, 'Mount element or selector is required for embedded form render');
    assert(this.amount, 'Amount is required. Use setAmount method to set it');

    const formData = await this.createOrder();
    const iframe = createIframe();
    appendElementToContainer(appendContainer, iframe);

    this.initIframeMessagesHandling(iframe, formData);

    // These sizes are initial
    // Right after App is mounted actual form size is transferred to iframe
    iframe.setAttribute('width', '560');
    iframe.setAttribute('height', '628');

    return { iframe };
  }

  /**
   * Renders the payment form in modal dialog layer
   *
   * @param {String|DomElement} appendContainer
   * @return {P1PayOne}
   */
  async renderModal() {
    assert(this.amount, 'Amount is required. Use setAmount method to set it');

    const formData = await this.createOrder();
    const { modalLayer, modalLayerInner, closeButton } = createModalLayer();
    closeButton.addEventListener('click', () => {
      modalLayer.parentNode.removeChild(modalLayer);
      this.emit('closeModal');
    });
    document.body.appendChild(modalLayer);

    const iframe = createIframe();
    modalLayerInner.appendChild(iframe);
    this.initIframeMessagesHandling(iframe, formData);

    modalTools.hideBodyScrollbar();
    this.emit('openModal');

    return { iframe };
  }

  initIframeMessagesHandling(iframe, formData) {
    handleIframeMessages.call(this, iframe, {
      formData,
      options: {
        language: this.language,
        email: this.email,
      },
    });
  }

  /**
   * Creates order and returns its data
   *
   * @return {Promise<Object>}
   */
  async createOrder() {
    let result = null;
    try {
      const { data } = await axios.post(apiPathCreateOrder, {
        region: this.region,
        amount: this.amount,
        currency: this.currency,
        account: this.account,
        project: this.projectID,
        payment_method: this.paymentMethod,
        payer_ip: '77.233.9.26',
      });
      result = data;
    } catch (error) {
      console.error(error);
    }
    return result;
  }

  /**
   * Renders the payment form
   *
   * @param {String|DomElement} appendContainer
   * @return {P1PayOne}
   */
  setAmount(amount) {
    const amountIsValidType = (typeof amount === 'string' || typeof amount === 'number');
    assert(amountIsValidType, 'Amount value must be a string or number');
    this.amount = Number(amount);
    return this;
  }

  /**
   * Setups the currency
   *
   * @param {String} currency example: "US"
   * @return {P1PayOne}
   */
  setCurrency(currency) {
    assert(typeof currency === 'string', 'Currency value must be a string');
    this.currency = currency;
    return this;
  }

  /**
   * Fetches and returns array of project packages
   *
   * @param {String} id package ID
   * @return {Object[]}
   */
  async getAllSku() {
    const { data } = await axios.get(
      `${apiPathGetProjectPackages}/${this.region}/${this.projectID}`,
    );

    return data;
  }

  /**
   * Fetches and returns single project package
   *
   * @param {String} id package ID
   * @return {Object}
   */
  async getSkuByID(id) {
    assert(id, 'ID is required in getSkuByID method');
    const { data } = await axios.get(
      `${apiPathGetProjectPackages}/${this.region}/${this.projectID}?id[]=${id}`,
    );

    if (!Array.isArray(data) || !data.length) {
      return null;
    }

    return data[0];
  }
}
