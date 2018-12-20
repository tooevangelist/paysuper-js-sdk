import assert from 'simple-assert';
import { extend } from 'lodash-es';
import styles from './assets/styles/styles.scss';

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

  getDomElement(appendContainer).appendChild(iframe);

  const { body, head } = iframe.contentDocument;
  const styleTag = document.createElement('STYLE');
  styleTag.innerHTML = styles;
  head.appendChild(styleTag);
  const iframeMountPoint = document.createElement('DIV');
  body.appendChild(iframeMountPoint);

  return { iframe, iframeMountPoint };
}

export default function getP1PayOne(mountApp) {
  return class P1PayOne {
    constructor({
      projectID, region, email, paymentMethod, account,
    }) {
      assert(projectID, 'projectID is required for "new P1PayOne(...)"');
      this.projectID = projectID;
      this.region = region;
      this.email = email;
      this.paymentMethod = paymentMethod;
      this.account = account;

      this.currency = 'USD';
      this.amount = null;
    }

    /**
     * Renders the payment form into target element
     *
     * @param {String|DomElement} appendContainer
     * @return {P1PayOne}
     */
    renderEmbedded(appendContainer) {
      assert(appendContainer, 'Mount element or selector is required for embedded form render');
      assert(this.amount, 'amount is required. Use setAmount method to set it');

      const { iframe, iframeMountPoint } = createIframe(appendContainer);
      iframe.setAttribute('width', '560');
      iframe.setAttribute('height', '600');

      mountApp(iframeMountPoint, {
        projectID: this.projectID,
        region: this.region,
        amount: this.amount,
        currency: this.currency,
        email: this.email,
        paymentMethod: this.paymentMethod,
        account: this.account,
      }, {});

      return this;
    }

    renderModal() {
      assert(this.amount, 'amount is required. Use setAmount method to set it');

      const { iframe, iframeMountPoint } = createIframe(document.body);

      extend(iframe.style, {
        width: '100%',
        height: '100%',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      });

      mountApp(
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
          destroyHandler(app) {
            app.$destroy();
            iframe.parentNode.removeChild(iframe);
          },
        },
      );

      return this;
    }

    /**
     * Renders the payment form
     *
     * @param {String|DomElement} appendContainer
     * @return {P1PayOne}
     */
    setAmount(amount) {
      this.amount = amount;
      return this;
    }

    setCurrency(currency) {
      this.currency = currency;
      return this;
    }
  };
}
