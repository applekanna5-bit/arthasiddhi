"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowUp } from "lucide-react";
function parentPath(pathname: string): string {
  if (pathname.startsWith("/calculators/")) return "/calculators";
  if (pathname.startsWith("/learn/")) {
    const parts = pathname.split("/").filter(Boolean);
    return parts.length > 2 ? `/learn/${parts[1]}` : "/learn";
  }
  return "/";
}
export function SiteNavigationControls() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const requested = searchParams.get("returnTo");
  // Only allow internal Learn category destinations, never arbitrary URLs.
  const returnPath = requested && /^\/learn\/[a-z0-9-]+$/.test(requested)
    ? requested
    : parentPath(pathname);
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const update = () => setShowTop(window.scrollY > 400);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [pathname]);
  const goToTop = () => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    window.scrollTo({
      top: 0,
      behavior: reduced ? "instant" : "smooth",
    });
  };
  return (
    <>
      {pathname !== "/" && (
        <nav
          aria-label="Return navigation"
          className="mx-auto w-full max-w-6xl px-4 pt-3 sm:px-6 lg:px-8"
        >
          <Link
            href={returnPath}
            className="inline-flex min-h-11 items-center gap-2 rounded-md px-2 text-sm font-medium text-[var(--as-brand-teal)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--as-brand-teal)]"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back
          </Link>
        </nav>
      )}
      {showTop && (
        <button
          type="button"
          onClick={goToTop}
          aria-label="Back to top"
          title="Back to top"
          className="fixed bottom-6 right-4 z-40 flex size-12 items-center justify-center rounded-full bg-[var(--as-action-primary)] text-[var(--as-text-on-action)] shadow-lg hover:bg-[var(--as-action-primary-hover)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--as-brand-teal)] sm:bottom-8 sm:right-8"
        >
          <ArrowUp aria-hidden="true" className="size-5" />
        </button>
      )}
    </>
  );
}
