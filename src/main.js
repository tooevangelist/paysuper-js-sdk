/**
 * App entry point
 */
import P1PayOne from './P1PayOne';

// Public API
if (typeof window !== 'undefined') {
  window.P1PayOne = P1PayOne;
}
export default P1PayOne;
