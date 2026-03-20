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
};
