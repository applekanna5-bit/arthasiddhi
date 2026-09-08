"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { trackEvent, type TrackedLinkMetadata } from "@/lib/analytics";

type Props = Omit<ComponentProps<typeof Link>, "onClick"> & {
  analytics: TrackedLinkMetadata;
  children: ReactNode;
};

export function TrackedLink({ analytics, children, ...props }: Props) {
  return <Link {...props} onClick={(event) => { if (!event.defaultPrevented) trackEvent(analytics.eventName, analytics.parameters); }}>{children}</Link>;
}
