/**
 * Returns whether the current navigator has support for touch events by detecting if
 * the window has handlers for touch events or if the navigator is aware of touch
 * points (potentially multiple if multi-touch screen).
 */
const hasTouchEvents = (): boolean =>
  'ontouchstart' in window ||
  navigator.maxTouchPoints > 0 ||
  (navigator as any).msMaxTouchPoints > 0;

export default hasTouchEvents;
