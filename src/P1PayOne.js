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

function getFormViewOptions(windowWidth) {
  const map = [
    { max: 1690, name: 'xl' },
    { max: 1280, name: 'l' },
    { max: 980, name: 'm' },
    { max: 736, name: 's' },
    { max: 480, name: 'xs' },
  ];

  const viewSize = [];

  map.forEach(({ max, name }) => {
    if (windowWidth > max) {
      return;
    }
    viewSize.push(name);
  });

  return {
    windowWidth,
    viewSize,
  };
}

export function receiveMessagesFromPaymentForm(currentWindow, postMessageWindow, isDev = true) {
  receiveMessages(currentWindow, {
    /**
     * The form insize iframe is awaiting the command below with listed options to init
     * Real form rendering start here
     */
    INITED: () => {
      const { viewSize } = getFormViewOptions(window.innerWidth);

      /**
       * In development the form receives form data from sdk
       * but in production the page receives it by itself
       */
      postMessage(postMessageWindow, 'REQUEST_INIT_FORM', {
        formData: isDev ? this.formData : {},
        options: {
          ...this.formOptions,
          email: this.email,
          language: this.language,
          apiUrl: this.urls.apiUrl,
          viewSize,
        },
      });
    },

    FORM_RESIZE: ({ width, height }) => {
      this.iframe.setAttribute('width', width);
      this.iframe.setAttribute('height', height);
    },

    ORDER_RECREATE_STARTED: async () => {
      this.formData = await this.createOrder();

      const iframeSrc = this.urls.getPaymentFormUrl(this.formData.id);
      this.iframe.setAttribute('src', iframeSrc);
    },
  }, (name, data) => {
    this.emit(name, data);
  });
}

export default class P1PayOne extends Events.EventEmitter {
  constructor({
    projectID, region, email, paymentMethod, account,
    currency, amount, language, apiUrl,
  } = {}) {
    super();
    assert(projectID, 'projectID is required for "new P1PayOne(...)"');
    this.projectID = projectID;
    this.region = getRegion(region, navigator);
    this.defaultLanguage = getDefaultLanguage();
    this.language = getLanguage(language);
    this.email = email;
    this.paymentMethod = paymentMethod;
    this.account = account;

    this.currency = currency ? this.setCurrency(currency) : 'USD';
    this.amount = amount ? this.setAmount(amount) : undefined;

    this.iframe = null;

    this.urls = getFunctionalUrls(apiUrl || 'https://p1payapi.tst.protocol.one');

    this.formData = null;
    this.formOptions = {
      isModal: false,
    };
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

    this.formData = await this.createOrder();
    this.formOptions = {
      ...this.formOptions,
      isModal: false,
    };

    this.iframe = createIframe(
      this.urls.getPaymentFormUrl(this.formData.id),
      appendContainer,
      this.defaultLanguage,
    );
    this.initIframeMessagesHandling();

    return { iframe: this.iframe };
  }

  /**
   * Renders the payment form in modal dialog layer
   *
   * @return {P1PayOne}
   */
  async renderModal() {
    assert(this.amount, 'Amount is required. Use setAmount method to set it');

    this.formData = await this.createOrder();
    this.formOptions = {
      ...this.formOptions,
      isModal: true,
    };

    const { modalLayer, modalLayerInner, closeButton } = createModalLayer();

    closeButton.addEventListener('click', () => {
      modalLayer.parentNode.removeChild(modalLayer);
      modalTools.showBodyScrollbar();
      this.emit('modalClosed');
    });
    document.body.appendChild(modalLayer);

    this.iframe = createIframe(
      this.urls.getPaymentFormUrl(this.formData.id),
      modalLayerInner,
      this.defaultLanguage,
    );
    this.initIframeMessagesHandling();

    modalTools.hideBodyScrollbar();
    this.emit('modalOpened');

    return { iframe: this.iframe };
  }

  /**
   * Handling iframe message transport with the form
   *
   * @return {P1PayOne}
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
  async createOrder() {
    // Dummy data if request is failed
    let result = {
      hasError: true,
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
        url_success: 'https://p1payfront.tst.protocol.one/payment_finished/',
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
