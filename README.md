# PaySuper JS SDK

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-brightgreen.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Build Status](https://api.travis-ci.org/ProtocolONE/payone-js-sdk.svg?branch=master)](https://travis-ci.org/ProtocolONE/token_one)
[![codecov](https://codecov.io/gh/paysuper/paysuper-js-sdk/branch/master/graph/badge.svg)](https://codecov.io/gh/paysuper/paysuper-js-sdk)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=paysuper_paysuper-js-sdk&metric=alert_status)](https://sonarcloud.io/dashboard?id=paysuper_paysuper-js-sdk)

Javascript SDK is designed to integrate a [PaySuper Payment Form](https://docs.stg.pay.super.com/getting-started/glossary/#payment-form) on your site.

1. [Usage](#usage)
2. [Parameters](#paysuper-form-parameters)
3. [Methods](#paysuper-form-methods)
4. [Events](#paysuper-form-events)
5. [Library URLs](#library-urls)
6. [Development](#development)
7. [Contributing](#contributing)

## Usage

You can create an instance of a PaySuper Form on your website using this sample code. 

> Use your IDs for Project and Products being in your merchant account in the PaySuper Admin.

```html
<script src="https://cdn.pay.super.com/paysdk/latest/paysuper.js"></script>
<script>
function buyItems() {
    // Create an instance of Payment Form with required order parameters
    const paySuper = new PaySuper({
        token: '5cd5620f06ae110001509185'
    });
    
    // Display a modal window with the payment form
    paySuper.renderModal();

    paySuper.on('paymentCompleted', function() {
        // You can show a completed payment message
    });
 }
</script>
<button onclick="buyItems()">BUY</button>
```

### PaySuper Form parameters

| Method | Type and Example | Description |
|---|---|---|
| ``token`` | String, Example - 'DWuGy6S1ADGUqR2Crnp4V2q26Jk309b3' | An order parameters as a secure string generated with [Tokens API](https://docs.stg.pay.super.com/api-reference/token/#endpoints) |
|``project``|String, Example - '5be2e16701d96d00012d26c3'|Project unique identifier in PaySuper|
|``type``|String, Available options: 'simple', 'key', 'product'||
|``products``|Array, Example - ['5d848f484dd6a50001970479']|Unique identifiers of Products being in the Project|
|``amount``|Number\|String, Example - 59.9|Order amount|
|``currency``|String, Example - 'USD'|Order currency by ISO 4217 (3 chars). If this field sent, then we're process amount in this currency. |
|``viewScheme``|String, Available options: 'dark' (default), 'light'|[Theme style](docs/CUSTOMIZATION.md)|
|``viewSchemeConfig``|Object, Example - { headerTextColor: '#333333' }|[Colors styles](docs/CUSTOMIZATION.md)|
|``apiUrl``|String, Default is 'https://p1payapi.tst.protocol.one'|Base URL|

### PaySuper Form methods

| Method | Type and Example | Description |
|---|---|---|
| ``renderModal()`` | return: {PaySuper} | Renders the form in modal dialog. |
|``renderPage()``|return: {PaySuper}|Renders the form in bare iframe to represent it as a simple page `iframe` height is automatic|
|``closeModal()``|return: {PaySuper}|Closes the modal dialog.|
|``setAmount( value )`` |param: **value** {Number\|String} Example - 59.9, return: {PaySuper}||
|``setCurrency( value )``|param: **value** {String} Example - 'USD', return: {PaySuper}||
|``setProducts( value )``|param: **value** {Array} Example - ['5d848f484dd6a50001970479'], return: {PaySuper}||
|``setType( value )``|param: **value** {String} Example - 'product', return: {PaySuper}||

### PaySuper Form events

```js
// Handle events of the payment form and payment statuses
paySuper.on('inited', function() {
  console.log('PaySuper is initialized')
})
```

#### Full events list in the expected order of execution

| Method | Description |
|---|---|
| ``pageBeforeInit`` | PaySuper form is started to render as page. |
| ``modalBeforeInit`` | PaySuper form is started to render as modal dialog. |
| ``inited`` | PaySuper form scripts are downloaded and started to load. |
| ``loaded`` | PaySuper form is finished its loading and ready to operate. |
| ``paymentFailedToBegin`` | En error has occured while fetching the order. |
| ``paymentBeforeCreated`` | A moment before the payment is created. |
| ``paymentCreated`` | The payment is created, but not finished yet. |
| ``paymentFailedToCreate`` | An error has occured while creating the payments. |
| ``paymentCompleted`` | The payment is successful. |
| ``paymentDeclined`` | The payment is declined buy payment system. |
| ``paymentInterrupted`` | The payment is interrupted by user. |
| ``modalClosed`` | PaySuper form modal dialog is closed. In case the form runs inside modal dialog. |

## Library URLs

### Hub with navigation

``https://static.protocol.one/minio/payone/``

### Dev version

``https://static.protocol.one/payone/sdk/dev/p1payone.js``
Updates automatically with `master` branch updates

### Production version

``https://cdn.pay.super.com/paysdk/latest/paysuper.js`` 
``https://cdn.pay.super.com/paysdk/v0.8.2/paysuper.js``
Updates width actual version releases (`v*` tag pushed into repo)



## Development

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies into single js-file
```
npm run build
```

### Like `run build` but with dist file size analysis
```
npm run check-size
```

### Run tests
```
npm run test
```

### Run tests for development in watch mode 
```
npm run test:dev
```

## About

Learn more about PaySuper at https://pay.super.com

## Contributing

We feel that a welcoming community is important and we ask that you follow PaySuper's [Open Source Code of Conduct](https://github.com/paysuper/code-of-conduct/blob/master/README.md) in all interactions with the community.

PaySuper welcomes contributions from anyone and everyone. Please refer to each project's style and contribution guidelines for submitting patches and additions. In general, we follow the "fork-and-pull" Git workflow.

The master branch of this repository contains the latest stable release of this component.
