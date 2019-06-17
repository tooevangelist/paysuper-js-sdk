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

/**
 * Cuts out language 2-letters code from navigator.language
 *
 * @return {String}
 */
function getDefaultLanguage() {
  if (navigator && navigator.language) {
    return navigator.language.slice(0, 2);
  }
  return 'en';
}

export function receiveMessagesFromPaymentForm(currentWindow, postMessageWindow, isDev = true) {
  receiveMessages(currentWindow, {
    /**
     * The form insize iframe is awaiting the command below with listed options to init
     * Real form rendering start here
     */
    INITED: () => {
      /**
       * In development the form receives form data from sdk
       * but in production the page receives it by itself
       */
      postMessage(postMessageWindow, 'REQUEST_INIT_FORM', {
        formData: isDev ? this.formData : {},
        options: {
          ...(this.language ? { language: this.language } : {}),
          layout: 'modal',
          apiUrl: this.urls.apiUrl,
        },
      });
    },

    LOADED: () => {
      this.iframe.classList.remove('paysuper-js-sdk-modal-layer__iframe--loading');
    },

    // FORM_RESIZE: ({ width, height }) => {
    //   this.iframe.setAttribute('width', width);
    //   this.iframe.setAttribute('height', height);
    // },

    MODAL_CLOSED: () => {
      this.closeModal();
    },

    ORDER_RECREATE_STARTED: async () => {
      this.formData = await this.createOrder();

      const iframeSrc = this.urls.getPaymentFormUrl(this.formData.payment_form_url);
      this.iframe.setAttribute('src', iframeSrc);
    },
  }, (name, data) => {
    this.emit(name, data);
  });
}

export default class PaySuper extends Events.EventEmitter {
  constructor({
    projectId, token, currency, amount, language, apiUrl, products,
  } = {}) {
    super();
    assert(projectId, 'projectId is required for "new PaySuper(...)"');
    this.projectId = projectId;
    this.defaultLanguage = getDefaultLanguage();
    this.language = getLanguage(language);
    this.token = token;

    if (currency) {
      this.setCurrency(currency);
    } else {
      this.currency = undefined;
    }
    if (amount) {
      this.setAmount(amount);
    } else {
      this.amount = undefined;
    }
    if (products) {
      this.setProducts(products);
    } else {
      this.products = undefined;
    }

    this.iframe = null;
    this.modalLayer = null;

    this.urls = getFunctionalUrls(apiUrl || 'https://p1payapi.tst.protocol.one');

    this.formData = null;
    this.isInited = false;
  }

  /**
   * Renders the payment form in modal dialog layer
   *
   * @param {String|DomElement} selectorOrElement
   * @return {PaySuper}
   */
  async renderModal(selectorOrElement) {
    if (this.isInited) {
      console.warn('PaySuper: the form is already rendering or finished rendering');
      return this;
    }
    this.isInited = true;
    const appendContainer = selectorOrElement ? getDomElement(selectorOrElement) : document.body;
    // assert(this.amount, 'Amount is required. Use setAmount method to set it');

    this.formData = await this.createOrder();

    const { modalLayer } = createModalLayer();
    this.modalLayer = modalLayer;

    appendContainer.innerHTML = '';
    appendContainer.appendChild(this.modalLayer);

    this.iframe = createIframe(
      this.urls.getPaymentFormUrl(this.formData.payment_form_url),
      this.modalLayer,
      this.defaultLanguage,
    );

    if (!this.formData.hasError) {
      this.initIframeMessagesHandling();
    } else {
      setTimeout(() => {
        this.closeModal();
      }, 3000);
    }

    modalTools.hideBodyScrollbar();
    this.emit('modalOpened');

    return this;
  }

  /**
   * Handling iframe message transport with the form
   *
   * @return {PaySuper}
   */
  initIframeMessagesHandling() {
    const postMessageWindow = this.iframe.contentWindow;
    const isDev = process.env.NODE_ENV === 'development';
    receiveMessagesFromPaymentForm.call(this, window, postMessageWindow, isDev);

    return this;
  }

  /**
   * Creates order and returns its data
   *
   * @return {Promise<Object>}
   */
  // async createOrder() {
  //   // Dummy data if request is failed
  //   let result = {
  //     hasError: true,
  //   };
  //   try {
  //     const { data } = await axios.post(this.urls.apiCreateOrderUrl, {
  //       region: this.region,
  //       amount: this.amount,
  //       currency: this.currency,
  //       account: this.account,
  //       project: this.projectId,
  //       payment_method: this.paymentMethod,
  //       payer_ip: '77.233.9.26',
  //       url_success: 'https://p1payfront.tst.protocol.one/payment_finished/',
  //     });
  //     result = data;
  //   } catch (error) {
  //     console.error(error);
  //   }
  //   return result;
  // }

  async createOrder() {
    // Dummy data if request is failed
    let result = {
      hasError: true,
    };
    if (this.amount) {
      assert(this.currency, 'PaySuper: currency is not set');
    }
    try {
      const { data } = await axios.post(this.urls.apiCreateOrderUrl, {
        project: this.projectId,
        ...(this.token ? { token: this.token } : {}),
        ...(this.products ? { products: this.products } : {}),
        ...(this.amount ? { amount: this.amount, currency: this.currency } : {}),
      });
      result = data;
    } catch (error) {
      this.isInited = false;
      console.error(error);
    }
    return result;
  }

  closeModal() {
    this.modalLayer.parentNode.removeChild(this.modalLayer);
    modalTools.showBodyScrollbar();
    this.iframe = null;
    this.formData = null;
    this.isInited = false;
  }

  /**
   * Renders the payment form
   *
   * @param {String|DomElement} appendContainer
   * @return {PaySuper}
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
   * @return {PaySuper}
   */
  setCurrency(currency) {
    assert(typeof currency === 'string', 'Currency value must be a string');
    this.currency = currency;
    return this;
  }

  /**
   * Setups the products
   *
   * @param {String[]} products example: "US"
   * @return {PaySuper}
   */
  setProducts(products) {
    assert(Array.isArray(products), 'Products value must be an array');
    this.products = products;
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
      `${this.urls.apiGetProjectPackagesUrl}/${this.region}/${this.projectId}`,
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
      `${this.urls.apiGetProjectPackagesUrl}/${this.region}/${this.projectId}?id[]=${id}`,
    );

    if (!Array.isArray(data) || !data.length) {
      return null;
    }

    return data[0];
  }
}
