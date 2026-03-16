import * as Sentry from "@sentry/nextjs";

const isSentryEnabled = process.env.NEXT_PUBLIC_SENTRY_ENABLED === "true";

if (isSentryEnabled) {
  Sentry.init({
    dsn: "https://8b7cbd935ba524cde21c398221d87770@o4509790309056512.ingest.us.sentry.io/4509790336974848",

    integrations: [Sentry.replayIntegration()],

    tracesSampleRate: 0.1,
    enableLogs: false,

    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0.1,
    debug: false,
  });
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
