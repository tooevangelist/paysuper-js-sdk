/**
 * App entry point
 */
import PaySuper from './PaySuper';

// Public API
if (typeof window !== 'undefined') {
  window.PaySuper = PaySuper;
}
export default PaySuper;
