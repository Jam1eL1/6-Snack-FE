import * as Sentry from "@sentry/nextjs";

if (process.env.NEXT_PUBLIC_SENTRY_ENABLED === "true") {
  Sentry.init({
    dsn: "https://8b7cbd935ba524cde21c398221d87770@o4509790309056512.ingest.us.sentry.io/4509790336974848",
    tracesSampleRate: 1,
    enableLogs: true,
    debug: false,
  });
}
