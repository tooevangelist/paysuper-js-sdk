/**
 * App entry point
 */
import * as Sentry from '@sentry/browser';
import P1PayOne from './P1PayOne';

// Public API
if (typeof window !== 'undefined') {
  window.P1PayOne = P1PayOne;
}
export default P1PayOne;

Sentry.init({
  dsn: 'https://3e4a24900f064243a9de45162660a66d@sentry.tst.protocol.one/3',
  // ...
});

// Raven.context(function () {
//   initMyApp();
// });
