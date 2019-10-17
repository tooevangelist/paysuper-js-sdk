# PaySuper JS SDK

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-brightgreen.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Build Status](https://api.travis-ci.org/ProtocolONE/payone-js-sdk.svg?branch=master)](https://travis-ci.org/ProtocolONE/token_one)
[![codecov](https://codecov.io/gh/paysuper/paysuper-js-sdk/branch/master/graph/badge.svg)](https://codecov.io/gh/paysuper/paysuper-js-sdk)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=paysuper_paysuper-js-sdk&metric=alert_status)](https://sonarcloud.io/dashboard?id=paysuper_paysuper-js-sdk)

PaySuper Javascript SDK is designed to integrate a [PaySuper Payment Form](https://docs.stg.pay.super.com/getting-started/glossary/#payment-form) on your website.

1. [Usage](#usage)
2. [Parameters](#paysuper-form-parameters)
3. [Methods](#paysuper-form-methods)
4. [Events](#paysuper-form-events)
5. [Library URLs](#library-urls)
6. [Development](#development)
7. [Contributing](#contributing)

## Usage

You can create an instance of a PaySuper Form on your website using this sample code. 

> Use your IDs for the Project and Products found in your merchant account in the PaySuper Admin.

```html
<script src="https://static.protocol.one/payone/sdk/latest/p1payone.js"></script>

<script>
function buyItems() {
    // Create an instance of the Payment Form with required order parameters
    const paySuper = new PaySuper({
        token: '5cd5620f06ae110001509185'
    });
    
    // Display a modal window with the Payment Form
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
| ``token`` | String, Example - 'DWuGy6S1ADGUqR2Crnp4V2q26Jk309b3' | Order parameters as a secure string generated with [Tokens API](/api-reference/token/#endpoints) |
|``project``|String, Example - '5be2e16701d96d00012d26c3'|Project unique identifier for PaySuper|
|``type``|String, Available options: 'simple', 'key', 'product'||
|``products``|Array, Example - ['5d848f484dd6a50001970479']|Unique identifiers of Products for a given Project|
|``amount``|Number\|String, Example - 59.9|Order amount|
|``currency``|String, Example - 'USD'|Order currency by ISO 4217 (3 chars). We're process amount in the currency set by this field. |
|``viewScheme``|String, Available options: 'dark' (default), 'light'|Sample code is available at [Theme style](docs/CUSTOMIZATION.md)|
|``viewSchemeConfig``|Object, Example - { headerTextColor: '#333333' }|Sample code is available at [Colors styles](docs/CUSTOMIZATION.md)|
|``apiUrl``|String, Default is 'https://p1payapi.tst.protocol.one'||

### PaySuper Form methods

| Method | Type and Example | Description |
|---|---|---|
| ``renderModal()`` | return: {PaySuper} | Renders the form in a modal dialog. |
|``renderPage()``|return: {PaySuper}|Renders the form in a bare iframe. Height is determined automatically|
|``closeModal()``|return: {PaySuper}|Closes the modal dialog.|
|``setAmount( value )`` |param: **value** {Number\|String} Example - 59.9, return: {PaySuper}||
|``setCurrency( value )``|param: **value** {String} Example - 'USD', return: {PaySuper}||
|``setProducts( value )``|param: **value** {Array} Example - ['5d848f484dd6a50001970479'], return: {PaySuper}||
|``setType( value )``|param: **value** {String} Example - 'product', return: {PaySuper}||

### PaySuper Form events

```js
// Handles events of the Payment Form and payment statuses
paySuper.on('inited', function() {
  console.log('PaySuper is initialized')
})
```

#### Full events list in the expected order of execution

| Method | Description |
|---|---|
| ``pageBeforeInit`` | PaySuper form has started to render as a page. |
| ``modalBeforeInit`` | PaySuper form has started to render as a modal dialog. |
| ``inited`` | PaySuper form scripts have been downloaded and have started to load. |
| ``loaded`` | PaySuper form has finished to load and is ready to operate. |
| ``paymentFailedToBegin`` | An error has occured while fetching the order. |
| ``paymentBeforeCreated`` | The moment before the payment is created. |
| ``paymentCreated`` | The payment has been created, but has not finished yet. |
| ``paymentFailedToCreate`` | An error has occured while creating the payment. |
| ``paymentCompleted`` | The payment is successful. |
| ``paymentDeclined`` | The payment is declined by the payment system. |
| ``paymentInterrupted`` | The payment is interrupted by the user. |
| ``modalClosed`` | PaySuper form modal dialog is closed. Applicable when the form was created inside a modal dialog. |

## Library URLs

### Hub with navigation

``https://static.protocol.one/minio/payone/``

### Dev version

``https://static.protocol.one/payone/sdk/dev/p1payone.js``
Updates automatically with `master` branch updates

### By release

``https://static.protocol.one/payone/sdk/latest/p1payone.js``

``https://static.protocol.one/payone/sdk/v1.0.9/p1payone.js``

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

### Like `run build` but with a dist file size analysis
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
