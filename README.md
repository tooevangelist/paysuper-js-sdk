# PaySuper JS SDK

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-brightgreen.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Build Status](https://api.travis-ci.org/ProtocolONE/payone-js-sdk.svg?branch=master)](https://travis-ci.org/ProtocolONE/token_one)
[![codecov](https://codecov.io/gh/paysuper/paysuper-js-sdk/branch/master/graph/badge.svg)](https://codecov.io/gh/paysuper/paysuper-js-sdk)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=paysuper_paysuper-js-sdk&metric=alert_status)](https://sonarcloud.io/dashboard?id=paysuper_paysuper-js-sdk)

## Usage
```html
<script src="https://static.protocol.one/payone/sdk/latest/p1payone.js"></script>
<script>
  const paySuper = new PaySuper({
    token: '5cd5620f06ae110001509185'
  });
  paySuper.on('paymentCompleted', function() {
    // You can show a message about payment is completed;
  });
  paySuper.renderModal();
</script>
```

### PaySuper options
- **token** {String} Example - 'DWuGy6S1ADGUqR2Crnp4V2q26Jk309b3'
- **project** {String} Example - '5be2e16701d96d00012d26c3'
- **type** {String} Available options: 'simple', 'key', 'product'
- **products** {Array} Example - ['5d848f484dd6a50001970479']
- **amount** {Number|String} Example - 59.9
- **currency** {String} Example - 'USD'

- **viewScheme** {String} Default is 'dark'
- **viewSchemeConfig** {Object} Example - { headerTextColor: '#333333' }
- **apiUrl** {String} Default is 'https://p1payapi.tst.protocol.one'

### PaySuper form methods
#### renderModal()
- return: {PaySuper}
Renders the form in modal dialog.

#### renderPage()
- return: {PaySuper}
Renders the form in bare iframe to represent it as a simple page
`iframe` height is automatic

#### closeModal()
- return: {PaySuper}
Closes the modal dialog.

#### setAmount( value )
- param: **value** {Number|String} Example - 59.9
- return: {PaySuper}

#### setCurrency( value )
- param: **value** {String} Example - 'USD'
- return: {PaySuper}

#### setProducts( value )
- param: **value** {Array} Example - ['5d848f484dd6a50001970479']
- return: {PaySuper}

#### setType( value )
- param: **value** {String} Example - 'product'
- return: {PaySuper}

### PaySuper events
```js
paySuper.on('inited', function() {
  console.log('PaySuper is initialized')
})
paySuper.renderModal();
```
#### Events list
- **modalOpened** - Modal dialog for initilizing PaySuper form is opened. In case the form runs inside modal dialog.
- **pageInited** - PaySuper form began to initialize as a page.
- **inited** - PaySuper form scripts are downloaded and started to load.
- **loaded** - PaySuper form is finished its loading and ready to operate.
- **paymentFailedToBegin** - En error has occured while fetching the order.
- **paymentBeforeCreated** - A moment before the payment is created.
- **paymentCreated** - The payment is created, but not finished yet.
- **paymentFailedToCreate** - An error has occured while creating the payments.
- **paymentCompleted** - The payment is successful.
- **paymentDeclined** - The payment is declined buy payment system.
- **paymentInterrupted** - The payment is interrupted by user.
- **modalClosed** - PaySuper form modal dialog is closed. In case the form runs inside modal dialog.


### Library URLs
#### Hub with navigation
https://static.protocol.one/minio/payone/

#### Dev version
https://static.protocol.one/payone/sdk/dev/p1payone.js
Updates automatically with `master` branch updates

#### By release
https://static.protocol.one/payone/sdk/latest/p1payone.js
https://static.protocol.one/payone/sdk/v1.0.9/p1payone.js
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

## Contributing
We feel that a welcoming community is important and we ask that you follow PaySuper's [Open Source Code of Conduct](https://github.com/paysuper/code-of-conduct/blob/master/README.md) in all interactions with the community.

PaySuper welcomes contributions from anyone and everyone. Please refer to each project's style and contribution guidelines for submitting patches and additions. In general, we follow the "fork-and-pull" Git workflow.

The master branch of this repository contains the latest stable release of this component.

 

