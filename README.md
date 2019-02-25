# PaySuper JS SDK
[![Build Status](https://api.travis-ci.org/ProtocolONE/payone-js-sdk.svg?branch=master)](https://travis-ci.org/ProtocolONE/token_one)
[![codecov](https://codecov.io/gh/ProtocolONE/payone-js-sdk/branch/master/graph/badge.svg)](https://codecov.io/gh/ProtocolONE/payone-js-sdk)

## Usage
```html
<script src="https://static.protocol.one/payone/sdk/latest/p1payone.js"></script>
<script>
  const payoneForm = new PaySuper({
    projectID: '5be2e16701d96d00012d26c3',
    region: 'US',
  });
  payoneForm.setAmount(5).render('#app');
</script>
```

### PaySuper options
- **projectID** {String} Example - '5be2e16701d96d00012d26c3'
- **region** {String} Example - 'US'
- **language** {String} Example - 'en'
- **amount** {String} Example - 10
- **currency** {String} Example - 'USD'
- **email** {String} Default email for bank card payment reports. Hides email field in the form
- **account** {String} User account name in the current project
- **paymentMethod** {String}
- **apiUrl** {String} Default is 'https://p1payapi.tst.protocol.one'

### PaySuper methods
#### setAmount( value )
- param: **value** {String|Number}
- return: {PaySuper}
Sets payment amount

#### setCurrency( value )
- param: **value** {String|Number} Example - 'USD'
- return: {PaySuper}

#### render( selector )
- param: **selector** {String|DomElement}
- return: {Object}
Renders the form in the certaion place in page. 
Returns context object.

#### renderModal()
- return: {Object}
Renders the form in modal dialog.
Returns context object.

#### getAllSku()
- return: {Object[]}

#### getSkuByID( value )
- param: **value** {String}
- return: {Object}

### PaySuper events
```js
payoneForm.on('init', function() {
  console.log('PaySuper is initialized')
})
payoneForm.setAmount(5).renderModal('#app');
```
#### Events list
- **created** - the form begins to initialize
- **loaded** - the in fully loaded
- **modalOpened** - if `renderModal` methods used notifies about modal dialog opening
- **modalClosed** - if `renderModal` methods used notifies about modal dialog closing


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
