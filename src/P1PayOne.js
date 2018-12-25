import assert from 'simple-assert';
import axios from 'axios';
import Events from 'events';
import { extend } from 'lodash-es';
import { apiPathGetProjectPackages, apiPathCreateOrder } from './settings';
import handleIframeMessages from './handleIframeMessages';

/**
 * Comes from "payone-js-payment-form" package devServer options
 */
const iframeSrc = 'http://localhost:4040/';

/**
 * Returns DOM element by selector or actual DOM element
 *
 * @param {String|DomElement} appendContainer
 * @return {DomElement}
 */
function getDomElement(element) {
  return typeof element === 'string'
    ? document.querySelector(element)
    : element;
}

/**
 * Creates iframe container for payment form
 *
 * @param {String|DomElement} appendContainer
 * @return {Object}
 */
function createIframe(appendContainer) {
  const iframe = document.createElement('iframe');
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('src', iframeSrc);
  iframe.style.overflow = 'hidden';

  const appendContainerElement = getDomElement(appendContainer);
  assert(appendContainerElement, 'Form mounting element is not found');
  appendContainerElement.appendChild(iframe);

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
    const iframe = createIframe(appendContainer);
    handleIframeMessages.call(this, iframe, {
      formData,
      options: {
        language: this.language,
        email: this.email,
      },
    });

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
    const iframe = createIframe(document.body);
    handleIframeMessages.call(this, iframe, {
      formData,
      options: {
        language: this.language,
        email: this.email,
      },
    });

    extend(iframe.style, {
      width: '100%',
      height: '100%',
      position: 'fixed',
      background: 'rgba(0, 0, 0, 0.6)',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    });

    return { iframe };
  }

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
