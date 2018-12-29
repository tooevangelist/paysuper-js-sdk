# ProtocolONE PayOne

## Usage
```html
<script src="https://static.protocol.one/payone/sdk/latest/p1payone.js"></script>
<script>
  const payoneForm = new P1PayOne({
    projectID: '5be2e16701d96d00012d26c3',
    region: 'US',
  });
  payoneForm.setAmount(5).render('#app');
</script>
```

### P1PayOne options
- **projectID** {String} Example - '5be2e16701d96d00012d26c3'
- **region** {String} Example - 'US'
- **language** {String} Example - 'en'
- **email** {String} Default email for bank card payment reports. Hides email field in the form
- **account** {String} User account name in the current project
- **paymentMethod** {String}
- **apiUrl** {String} Default is 'https://p1payapi.tst.protocol.one'

### P1PayOne methods
#### setAmount( value )
- param: **value** {String|Number}
- return: {P1PayOne}
Sets payment amount

#### setCurrency( value )
- param: **value** {String|Number} Example - 'USD'
- return: {P1PayOne}

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

### P1PayOne events
```js
payoneForm.on('init', function() {
  console.log('P1PayOne is initialized')
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
