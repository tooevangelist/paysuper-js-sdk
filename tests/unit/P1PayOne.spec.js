import getP1PayOne, { getRegion, getLanguage } from '@/getP1PayOne';

const P1PayOne = getP1PayOne(() => { });
const projectID = '5be2e16701d96d00012d26c3';

describe('P1PayOne', () => {
  it('should require projectID to init', () => {
    expect(() => {
      // eslint-disable-next-line
      new P1PayOne();
    }).toThrowError(/projectID is required/);
  });

  describe('setAmount', () => {
    const p1PayOne = new P1PayOne({
      projectID,
    });

    it('should throw error if no value passed', () => {
      expect(() => {
        p1PayOne.setAmount();
      }).toThrowError(/Amount value must/);
    });

    it('should autoconvert strings to numbers', () => {
      p1PayOne.setAmount('5');
      expect(p1PayOne.amount).toEqual(5);
    });
  });

  describe('setCurrency', () => {
    const p1PayOne = new P1PayOne({
      projectID,
    });

    it('should throw error if no value passed', () => {
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
    const defaultLanguage = 'en';
    it(`should return ${defaultLanguage} if no value and no navigator`, () => {
      const value = getLanguage();
      expect(value).toEqual(defaultLanguage);
    });

    it(`should return ${defaultLanguage} if no value and no navigator.language`, () => {
      const value = getLanguage(null, {});
      expect(value).toEqual(defaultLanguage);
    });

    it('should return region from navigator.language when no value', () => {
      const value = getLanguage(null, {
        language: 'ru-RU',
      });
      expect(value).toEqual('ru');
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
