// Detects whether the app is running inside a Median.co native wrapper.
// Median's native shell sets a custom "median" token in the user-agent string.
const isMedianApp =
  typeof navigator !== "undefined" &&
  navigator.userAgent &&
  navigator.userAgent.indexOf("median") > -1;

export default isMedianApp;
export { isMedianApp };