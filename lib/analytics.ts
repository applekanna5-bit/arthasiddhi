const GA4_MEASUREMENT_ID = /^G-[A-Z0-9]+$/;

type AnalyticsEnvironment = {
  NODE_ENV?: string;
  NEXT_PUBLIC_GA_MEASUREMENT_ID?: string;
};

export function getGoogleAnalyticsMeasurementId(
  environment: AnalyticsEnvironment = process.env,
) {
  if (environment.NODE_ENV !== "production") return null;

  const measurementId = environment.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
  return measurementId && GA4_MEASUREMENT_ID.test(measurementId)
    ? measurementId
    : null;
}
