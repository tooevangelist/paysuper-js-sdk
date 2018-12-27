import assert from 'simple-assert';
import axios from 'axios';
import Events from 'events';
import Centrifuge from 'centrifuge';
import { apiGetProjectPackagesUrl, apiCreateOrderUrl, websocketServerUrl } from './settings';
import handleIframeMessages from './handleIframeMessages';
import createModalLayer from './createModalLayer';
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

    this.iframe = null;
  }

  /**
   * Renders the payment form into target element
   *
   * @param {String|DomElement} appendContainer
   * @return {P1PayOne}
   */
  async render(appendContainer) {
    assert(appendContainer, 'Mount element or selector is required for embedded form render');
    assert(this.amount, 'Amount is required. Use setAmount method to set it');

    const formData = await this.createOrder();
    const iframe = createIframe();
    this.iframe = iframe;
    appendElementToContainer(appendContainer, iframe);

    this.initIframeMessagesHandling(formData);

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
      this.emit('modalClosed');
    });
    document.body.appendChild(modalLayer);

    const iframe = createIframe();
    this.iframe = iframe;
    modalLayerInner.appendChild(iframe);
    this.initIframeMessagesHandling(formData);

    modalTools.hideBodyScrollbar();
    this.emit('modalOpened');

    return { iframe };
  }

  initIframeMessagesHandling(formData) {
    handleIframeMessages.call(this, formData);
  }

  /**
   * Creates order and returns its data
   *
   * @return {Promise<Object>}
   */
  async createOrder() {
    let result = null;
    try {
      const { data } = await axios.post(apiCreateOrderUrl, {
        region: this.region,
        amount: this.amount,
        currency: this.currency,
        account: this.account,
        project: this.projectID,
        payment_method: this.paymentMethod,
        payer_ip: '77.233.9.26',
      });
      result = data;

      const centrifuge = new Centrifuge(websocketServerUrl);
      centrifuge.setToken(data.token);

      const channel = `payment:notify#${data.id}`;

      centrifuge.subscribe(channel, (message) => {
        console.log(11111, 'payment', message);
      });

      centrifuge.connect();
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
      `${apiGetProjectPackagesUrl}/${this.region}/${this.projectID}`,
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
      `${apiGetProjectPackagesUrl}/${this.region}/${this.projectID}?id[]=${id}`,
    );

    if (!Array.isArray(data) || !data.length) {
      return null;
    }

    return data[0];
  }
}
