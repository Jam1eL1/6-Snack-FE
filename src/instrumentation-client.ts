import * as Sentry from "@sentry/nextjs";

const isSentryEnabled = process.env.NEXT_PUBLIC_SENTRY_ENABLED === "true";

if (isSentryEnabled) {
  Sentry.init({
    dsn: "https://8b7cbd935ba524cde21c398221d87770@o4509790309056512.ingest.us.sentry.io/4509790336974848",

    integrations: [Sentry.replayIntegration()],

    tracesSampleRate: 1,
    enableLogs: true,

    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    debug: false,
  });
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
