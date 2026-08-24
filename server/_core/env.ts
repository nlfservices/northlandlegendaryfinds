export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
  // eBay API credentials
  ebayClientId: process.env.EBAY_CLIENT_ID ?? "",
  ebayClientSecret: process.env.EBAY_CLIENT_SECRET ?? "",
  ebaySandboxClientId: process.env.EBAY_SANDBOX_CLIENT_ID ?? "",
  ebaySandboxClientSecret: process.env.EBAY_SANDBOX_CLIENT_SECRET ?? "",
  ebayVerificationToken: process.env.EBAY_VERIFICATION_TOKEN ?? "",
  ebayDeletionEndpointUrl: process.env.EBAY_DELETION_ENDPOINT_URL ?? "",
  // GoHighLevel API credentials
  ghlApiKey: process.env.GHL_API_KEY ?? "",
  ghlLocationId: process.env.GHL_LOCATION_ID ?? "",
  // Admin notification email
  adminNotificationEmail: process.env.ADMIN_NOTIFICATION_EMAIL ?? "",
  // Admin access code for Matrix portal gate
  adminAccessCode: process.env.ADMIN_ACCESS_CODE || "553030",
  // Meta Conversions API
  metaPixelId: process.env.META_PIXEL_ID ?? "839598775754379",
  metaCapiAccessToken: process.env.META_CAPI_ACCESS_TOKEN ?? "",
  metaTestEventCode: process.env.META_TEST_EVENT_CODE ?? "",
  // Facebook Page auto-posting
  fbPageId: process.env.FB_PAGE_ID ?? "",
  fbPageAccessToken: process.env.FB_PAGE_ACCESS_TOKEN ?? "",
};
