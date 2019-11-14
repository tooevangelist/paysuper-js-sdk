import PaySuper from '@/PaySuper';

describe('PaySuper.getIframeSrc', () => {
  it('should work well with formUrl only', () => {
    const formUrl = 'https://ya.ru';
    const paySuper = new PaySuper({
      formUrl,
    });
    expect(paySuper.getIframeSrc()).toEqual(`${formUrl}?sdk=true`);
  });

  it('should work well with formUrl only 2', () => {
    const formUrl = 'https://ya.ru?order_id=123';
    const paySuper = new PaySuper({
      formUrl,
    });
    expect(paySuper.getIframeSrc()).toEqual(`${formUrl}&sdk=true`);
  });
});
