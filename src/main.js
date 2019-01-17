/**
 * App entry point
 */
import Raven from 'raven-js';
import P1PayOne from './P1PayOne';

// Public API
if (typeof window !== 'undefined') {
  window.P1PayOne = P1PayOne;
}
export default P1PayOne;

Raven.config('https://3e4a24900f064243a9de45162660a66d@sentry.tst.protocol.one/3').install();
// Raven.context(function () {
//   initMyApp();
// });
setTimeout(() => {
  Raven.captureException('TEST');
}, 2000);
