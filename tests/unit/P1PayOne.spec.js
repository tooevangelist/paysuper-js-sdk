import P1PayOne, { getRegion, getLanguage } from '@/P1PayOne';

const projectID = '5be2e16701d96d00012d26c3';

describe('P1PayOne', () => {
  it('should require projectID to init', () => {
    expect(() => {
      // eslint-disable-next-line
      new P1PayOne();
    }).toThrowError(/projectID is required/);
  });

  it('should be able to handle events', () => {
    const p1PayOne = new P1PayOne({
      projectID,
    });

    let check;
    p1PayOne.on('testEvent', (value) => {
      check = value;
    });
    p1PayOne.emit('testEvent', 'ok');

    expect(check).toEqual('ok');
  });

  it('should be able to handle custom apiUrl', () => {
    const customApiUrl = 'https://localhost:3333';
    const p1PayOne = new P1PayOne({
      projectID,
      apiUrl: customApiUrl,
    });

    expect(p1PayOne.urls.apiUrl).toEqual(customApiUrl);
  });

  describe('setAmount', () => {
    it('should throw error if amount value passed as option is invalid', () => {
      expect(() => {
        // eslint-disable-next-line
        const p1PayOne = new P1PayOne({
          projectID,
          amount: {},
        });
      }).toThrowError(/Amount value must/);
    });

    it('should throw error if no value passed', () => {
      const p1PayOne = new P1PayOne({
        projectID,
      });
      expect(() => {
        p1PayOne.setAmount();
      }).toThrowError(/Amount value must/);
    });

    it('should autoconvert strings to numbers', () => {
      const p1PayOne = new P1PayOne({
        projectID,
      });
      p1PayOne.setAmount('5');
      expect(p1PayOne.amount).toEqual(5);
    });
  });

  describe('setCurrency', () => {
    it('should throw error if currency value passed as option is invalid', () => {
      expect(() => {
        // eslint-disable-next-line
        const p1PayOne = new P1PayOne({
          projectID,
          currency: {},
        });
      }).toThrowError(/Currency value must/);
    });

    it('should throw error if no value passed', () => {
      const p1PayOne = new P1PayOne({
        projectID,
      });

      expect(() => {
        p1PayOne.setCurrency();
      }).toThrowError(/Currency value must/);
    });
  });

  describe('getRegion', () => {
    const defaultRegion = 'US';
    it(`should return ${defaultRegion} if no value and no navigator`, () => {
      const value = getRegion();
      expect(value).toEqual(defaultRegion);
    });

    it(`should return ${defaultRegion} if no value and no navigator.language`, () => {
      const value = getRegion(null, {});
      expect(value).toEqual(defaultRegion);
    });

    it('should return region from navigator.language when no value', () => {
      const value = getRegion(null, {
        language: 'ru-RU',
      });
      expect(value).toEqual('RU');
    });

    it('should cast value into upper case', () => {
      const value = getRegion('us');
      expect(value).toEqual('US');
    });

    it('should throw error if value has incorrect type', () => {
      expect(() => {
        getRegion({});
      }).toThrowError(/Region value must be a string/);
    });

    it('should throw error if value has incorrect format', () => {
      expect(() => {
        getRegion('omg');
      }).toThrowError(/Region value must be in 2-characters format/);
    });
  });

  describe('getLanguage', () => {
    it('should return region undefined when no value', () => {
      const value = getLanguage(null);
      expect(value).toEqual(undefined);
    });

    it('should cast value into upper case', () => {
      const value = getLanguage('EN');
      expect(value).toEqual('en');
    });

    it('should throw error if value has incorrect type', () => {
      expect(() => {
        getLanguage({});
      }).toThrowError(/Language value must be a string/);
    });

    it('should throw error if value has incorrect format', () => {
      expect(() => {
        getLanguage('omg');
      }).toThrowError(/Language value must be in 2-characters format/);
    });
  });
});
