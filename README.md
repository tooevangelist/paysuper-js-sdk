# ProtocolONE PayOne

## Usage
```
const payoneForm = new P1PayOne({
  projectID: '5be2e16701d96d00012d26c3',
  region: 'US',
});
payoneForm.setAmount(5).renderInElement('#app');
```

## Development

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies into single js-file
```
npm run build
```

### Run tests
```
npm run test
```

### Run tests for development in watch mode 
```
npm run test:dev
```
