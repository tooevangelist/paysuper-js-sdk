import assert from 'simple-assert';
import axios from 'axios';
import Events from 'events';
import getFunctionalUrls from './getFunctionalUrls';
import { createIframe, createModalLayer } from './createElements';
import modalTools from './modalTools';
import { postMessage, receiveMessages } from './postMessage';
import './assets/styles.scss';

/**
 * Returns DOM element by selector or actual DOM element
 *
 * @param {String|DomElement} element
 * @return {DomElement}
 */
function getDomElement(element) {
  if (!element) {
    return undefined;
  }

  return typeof element === 'string'
    ? document.querySelector(element)
    : element;
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
    projectID, region, email, paymentMethod, account, language, apiUrl,
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

    this.wrapper = null;
    this.preloader = null;
    this.iframe = null;

    this.urls = getFunctionalUrls(apiUrl || 'https://p1payapi.tst.protocol.one');
  }

  /**
   * Renders the payment form into target element
   *
   * @param {String|DomElement} selectorOrElement
   * @return {P1PayOne}
   */
  async render(selectorOrElement) {
    const appendContainer = getDomElement(selectorOrElement);
    assert(appendContainer, 'Mount element or selector is required for embedded form render');
    assert(this.amount, 'Amount is required. Use setAmount method to set it');

    const formData = await this.createOrder();

    this.iframe = createIframe(
      this.urls.getPaymentFormUrl(formData.id),
    );
    appendContainer.appendChild(this.iframe);
    this.initIframeMessagesHandling(formData);

    // These sizes are initial
    // Right after App is mounted actual form size is transferred to iframe
    this.iframe.setAttribute('width', '560');
    this.iframe.setAttribute('height', '628');

    return { wrapper: this.wrapper, iframe: this.iframe };
  }

  /**
   * Renders the payment form in modal dialog layer
   *
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

    this.iframe = createIframe(
      this.urls.getPaymentFormUrl(formData.id),
    );
    modalLayerInner.appendChild(this.iframe);
    this.initIframeMessagesHandling(formData);

    modalTools.hideBodyScrollbar();
    this.emit('modalOpened');

    return { wrapper: this.wrapper, iframe: this.iframe };
  }

  /**
   * Handling iframe message transport with the form
   * @param {Object} formData
   * @return {P1PayOne}
   */
  initIframeMessagesHandling(formData) {
    const postMessageWindow = this.iframe.contentWindow;
    let iframeLoadingErrorTimeout;

    if (process.env.NODE_ENV === 'development') {
      iframeLoadingErrorTimeout = setTimeout(() => {
        // eslint-disable-next-line
        alert(`Can't connect to ${this.urls.devPaymentFormUrl} to load the form. Check "payone-js-payment-form" package is served`);
      }, 1000);
    }

    receiveMessages(window, {
      INITED: () => {
        clearTimeout(iframeLoadingErrorTimeout);
        postMessage(postMessageWindow, 'REQUEST_INIT_FORM', {
          formData: process.env.NODE_ENV === 'development' ? formData : {},
          options: {
            email: this.email,
            language: this.language,
            apiUrl: this.urls.apiUrl,
          },
        });
      },

      FORM_RESIZE: ({ width, height }) => {
        this.iframe.setAttribute('width', width);
        this.iframe.setAttribute('height', height);
      },
    }, (name) => {
      this.emit(name);
    });

    return this;
  }

  /**
   * Creates order and returns its data
   *
   * @return {Promise<Object>}
   */
  async createOrder() {
    // Dummy data if request is failed
    let result = {
      payment_methods: [{}],
    };
    try {
      const { data } = await axios.post(this.urls.apiCreateOrderUrl, {
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
      `${this.urls.apiGetProjectPackagesUrl}/${this.region}/${this.projectID}`,
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
      `${this.urls.apiGetProjectPackagesUrl}/${this.region}/${this.projectID}?id[]=${id}`,
    );

    if (!Array.isArray(data) || !data.length) {
      return null;
    }

    return data[0];
  }
}
