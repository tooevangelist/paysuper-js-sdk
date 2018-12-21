import getP1PayOne from '@/getP1PayOne';

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
});
