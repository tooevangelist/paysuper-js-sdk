import assert from 'simple-assert';
import { extend } from 'lodash-es';
import axios from 'axios';
import styles from './assets/styles/styles.scss';
import { apiPathGetProjectPackages } from './settings';

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

 * @param {String|DomElement} appendContainer
 * @return {Object}
 */
function createIframe(appendContainer) {
  const iframe = document.createElement('iframe');
  iframe.setAttribute('frameborder', '0');

  const appendContainerElement = getDomElement(appendContainer);
  assert(appendContainerElement, 'Form mounting element is not found');
  appendContainerElement.appendChild(iframe);

  const { body, head } = iframe.contentDocument;
  const styleTag = document.createElement('STYLE');
  styleTag.innerHTML = styles;
  head.appendChild(styleTag);
  const iframeMountPoint = document.createElement('DIV');
  body.appendChild(iframeMountPoint);

  return { iframe, iframeMountPoint };
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
export function getLanguage(value, navigator) {
  if (!value) {
    if (navigator && navigator.language) {
      return navigator.language.slice(0, 2);
    }
    return 'en';
  }
  assert(typeof value === 'string', 'Language value must be a string');
  assert(value.length === 2, 'Language value must be in 2-characters format');
  return value.toLowerCase();
}

export default function getP1PayOne(mountApp) {
  return class P1PayOne {
    constructor({
      projectID, region, email, paymentMethod, account, language,
    } = {}) {
      assert(projectID, 'projectID is required for "new P1PayOne(...)"');
      this.projectID = projectID;
      this.region = getRegion(region, navigator);
      this.language = getLanguage(language, navigator);
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

      const { iframe, iframeMountPoint } = createIframe(appendContainer);

      // These sizes are initial
      // Right after App is mounted actual form size is transferred to iframe
      iframe.setAttribute('width', '560');
      iframe.setAttribute('height', '600');

      await mountApp(
        iframeMountPoint,
        {
          projectID: this.projectID,
          region: this.region,
          amount: this.amount,
          currency: this.currency,
          email: this.email,
          paymentMethod: this.paymentMethod,
          account: this.account,
        },
        {
          isInModal: false,
          iframeResizeHandler({ width, height }) {
            iframe.setAttribute('width', width);
            iframe.setAttribute('height', height);
          },
          language: this.language,
        },
      );

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

      const { iframe, iframeMountPoint } = createIframe(document.body);

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

      await mountApp(
        iframeMountPoint,
        {
          projectID: this.projectID,
          region: this.region,
          amount: this.amount,
          currency: this.currency,
          email: this.email,
          paymentMethod: this.paymentMethod,
          account: this.account,
        },
        {
          isInModal: true,
          destroyHandler() {
            iframe.parentNode.removeChild(iframe);
          },
          language: this.language,
        },
      );

      return { iframe };
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
  };
}
