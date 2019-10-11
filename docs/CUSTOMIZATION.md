## You can customize the payment form created by PaySuper JS SDK

### Change the theme

```html
const paySuper = new PaySuper({
    viewScheme: 'light'
  });
```

### Change the colors

```html
const paySuper = new PaySuper({
    token: '5cd5620f06ae110001509185',
    viewSchemeConfig: { 
        <!-- headerTextColor overrides the default value of the viewSchemeConfig object -->
        headerTextColor: '#333333'
    }
  });
```

### Available parameters of viewSchemeConfig

```html
viewSchemeConfig: 
{
    headerTextColor: 'rgba(255, 255, 255, 0.7)',
    headerProjectTitleColor: '#fff',
    headerServiceTitleColor: '#fff',

    cartBackgroundColor: '#333b50',
    cartBoxShadowColor: 'rgba(51, 59, 80, 0.8)',
    cartHoverTextColor: '#06eaa7',
    cartOldPriceColor: 'rgba(255, 255, 255, 0.3)',
    cartTextColor: 'rgba(255, 255, 255, 0.7)',
    cartTotalStrokeColor: 'rgba(255, 255, 255, 0.2)',
    cartTotalTextColor: '#06eaa7',

    formBackgroundColor: '#424c66',

    localeChangerModalBorderColor: 'rgba(255, 255, 255, 0.2)',
    localeChangerModalBoxColor: '#333b50',
    localeChangerModalColor: 'rgba(255, 255, 255, 0.7)',
    localeChangerModalCurrentColor: '#06eaa7',
    localeChangerModalHoverBorderColor: 'rgba(255, 255, 255, 0.5)',
    localeChangerModalHoverColor: '#06eaa7',

    localeChangerPageBorderColor: 'rgba(255, 255, 255, 0.2)',
    localeChangerPageBoxColor: '#333b50',
    localeChangerPageColor: 'rgba(255, 255, 255, 0.7)',
    localeChangerPageCurrentColor: '#06eaa7',
    localeChangerPageHoverBorderColor: 'rgba(255, 255, 255, 0.5)',
    localeChangerPageHoverColor: '#06eaa7',

    buttonAlign: 'center',
    buttonColor: '#fff',
    buttonBoxColor: '#5b88de',
    buttonActiveBoxColor: '#4e7fdb',
    buttonHoverBoxColor: '#6891e1',
    buttonDisabledOpacity: '0.7',
    buttonBeforeColor: '#fff',
    buttonAfterColor: '#fff',

    checkboxColor: '#fff',
    checkboxIconColor: '#fff',
    checkboxHoverColor: '#06eaa7',
    checkboxHoverIconColor: '#06eaa7',
    checkboxCheckedColor: '#fff',
    checkboxCheckedIconColor: '#06eaa7',
    checkboxDisabledOpacity: '0.7',

    preloaderColor: 'rgba(255, 255, 255, 0.1)',
    preloaderSpinColor: '#06eaa7',

    inputBorderColor: 'rgba(255, 255, 255, 0.2)',
    inputBoxColor: 'transparent',
    inputColor: '#fff',
    inputDisabledOpacity: '0.5',
    inputErrorBorderColor: '#fc7e57',
    inputErrorBoxColor: '#fc7e57',
    inputErrorColor: '#fff',
    inputFocusBorderColor: '#06eaa7',
    inputFocusLabelColor: 'rgba(255, 255, 255, 0.3)',
    inputHoverBorderColor: 'rgba(255, 255, 255, 0.5)',
    inputLabelColor: 'rgba(255, 255, 255, 0.5)',

    selectBorderColor: 'rgba(255, 255, 255, 0.2)',
    selectBoxColor: 'transparent',
    selectColor: '#fff',
    selectPlaceholderColor: 'rgba(255, 255, 255, 0.5)',
    selectDisabledOpacity: '0.5',
    selectFocusBorderColor: '#06eaa7',
    selectHoverBorderColor: 'rgba(255, 255, 255, 0.5)',
    selectOptionsBoxColor: '#424c66',
    selectRemoveColor: '#fc7e57',

    cardSelectAddCardColor: '#fff',
    cardSelectAddCardHoverColor: '#06eaa7',

    tipCartBoxColor: '#424c66',
    tipContentColor: 'rgba(255, 255, 255, 0.5)',
    tipFormBoxColor: '#333B50',
    tipHeaderColor: '#fff',
    tipLinkHoverColor: '#06eaa7',

    iconInfoColor: 'rgba(255, 255, 255, 0.3)',
    iconInfoHoverColor: '#06eaa7',

    stubContentColorPrimary: 'rgba(255, 255, 255, 0.2)',
    stubSpinContentColorPrimary: 'rgba(255, 255, 255, 0.15)',
    stubContentColorSecondary: 'rgba(255, 255, 255, 0.1)',
    stubSpinContentColorSecondary: 'rgba(255, 255, 255, 0.1)',
    stubTotalColor: 'rgba(6, 234, 167, 0.3)',
    stubSpinTotalColor: 'rgba(6, 234, 167, 0.2)',
  }
```