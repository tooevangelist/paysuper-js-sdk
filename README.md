# ProtocolONE PayOne

## Usage
```
const payoneForm = new P1PayOne({
  projectID: '5be2e16701d96d00012d26c3',
  region: 'US',
});
payoneForm.setAmount(5).renderInElement('#app');
```

### P1PayOne options
- **projectID** {String} Example - '5be2e16701d96d00012d26c3'
- **region** {String} Example - 'US'
- **language** {String} Example - 'en'
- **email** {String} Default email for bank card payment reports. Hides email field in the form
- **account** {String} User account name in the current project
- **paymentMethod** {String}

### P1PayOne methods
#### setAmount( value )
- param: **value** {String|Number}
- return: {P1PayOne}
Sets payment amount

#### setCurrency( value )
- param: **value** {String|Number} Example - 'USD'
- return: {P1PayOne}

#### renderInElement( selector )
- param: **selector** {String|DomElement}
- return: {Promise}
Renders the form in the certaion place in page. 
Promise is resolved when form rendering is finished.
Resolved promise has argument with context object.

#### renderModal()
- return: {Promise}
Renders the form in modal dialog.
Promise is resolved when form rendering is finished.
Resolved promise has argument with context object.

#### getAllSku()
- return: {Object[]}

#### getSkuByID( value )
- param: **value** {String}
- return: {Object}

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
