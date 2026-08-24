export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Customer accounts no longer bounce to the retired Manus OAuth portal.
// Staff sign-in is the Matrix PIN on /admin (same gate as /matrix).
export const getLoginUrl = () => "/admin";
export const getSignUpUrl = () => "/login";
