import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { registerStripeWebhook } from "../stripe-webhook";
import { registerEbayDeletionEndpoint } from "../ebay-deletion";
import { registerSitemapRoute } from "../sitemap";
import { registerScheduledPublishRoute } from "../scheduled-publish";
import { registerCardShowsScheduledRoute } from "../scheduled-card-shows";
import { registerScheduledBackupRoute } from "../scheduled-backup";
import { registerFacebookWebhook } from "../facebook-webhook";
import { registerBotReindexScheduledRoute } from "../scheduled-bot-reindex";
import { registerBotPollScheduledRoute } from "../scheduled-bot-poll";
import { registerFbTokenRefreshRoute } from "../scheduled-fb-token-refresh";
import { registerDailyArticleRoute } from "../scheduled-daily-article";
import { registerRestApi } from "../rest-api";
import { registerMint2025BacksApi } from "../mint2025BacksApi";
import { startMint2025BacksSeed } from "../mint2025BacksSeed";
import { startCbhPhotosSeed } from "../cbhPhotosSeed";
import { startMcsPhotosSeed } from "../mcsPhotosSeed";
import { startStudiosPhotosSeed } from "../studiosPhotosSeed";
import { startMint2026PhotosSeed } from "../mint2026PhotosSeed";
import { startMatrixAdminBootstrap } from "../matrixAdminBootstrap";
import { appRouter } from "../routers";
import { startBlogScheduler } from "../blog-scheduler";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Stripe webhook MUST be registered BEFORE express.json() for raw body signature verification
  registerStripeWebhook(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // Storage proxy for /manus-storage/* paths
  registerStorageProxy(app);
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  // eBay marketplace account deletion/closure notification endpoint
  registerEbayDeletionEndpoint(app);
  // Dynamic sitemap.xml
  registerSitemapRoute(app);
  // Scheduled task endpoints
  registerScheduledPublishRoute(app);
  registerCardShowsScheduledRoute(app);
  registerScheduledBackupRoute(app);
  registerBotReindexScheduledRoute(app);
  registerBotPollScheduledRoute(app);
  registerFbTokenRefreshRoute(app);
  registerDailyArticleRoute(app);
  // NLF Public REST API v1
  registerRestApi(app);
  registerMint2025BacksApi(app);
  // Facebook webhook (comment bot)
  registerFacebookWebhook(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
    // Start blog auto-publisher scheduler
    startBlogScheduler();
    // One-shot 2025 Mint back seed (setId=3 only). Does not block listen.
    startMint2025BacksSeed();
    // One-shot 2025 Comic Book Heroes photo + metadata seed (setId=2 only). Does not block listen.
    startCbhPhotosSeed();
    // One-shot 2025 Marvel Chrome Sapphire photo + odds seed (setId=4 numeric 1-200 only). Does not block listen.
    startMcsPhotosSeed();
    // One-shot 2025 Marvel Chrome Studios photo seed (setId=5 numeric 1-200 only). Does not block listen.
    startStudiosPhotosSeed();
    // One-shot 2026 Marvel Mint photo seed (setId=90006 numeric 1-125 only). Does not block listen.
    startMint2026PhotosSeed();
    // Clear Matrix lockouts and upsert admin credentials once per process.
    startMatrixAdminBootstrap();
  });
}

startServer().catch(console.error);
