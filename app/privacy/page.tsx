import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/site/InfoPage";
import { pageMetadata } from "@/lib/content/seo";

export const metadata: Metadata = pageMetadata({ title: "Privacy Policy | ArthaSiddhi", description: "How ArthaSiddhi handles information when you use its public website and client-side financial calculators.", path: "/privacy" });

export default function PrivacyPage() {
  return (
    <InfoPage eyebrow="Legal" title="Privacy Policy" description="This policy describes the current public ArthaSiddhi website and its client-side financial calculators. Last updated: 16 August 2026.">
      <section><h2 className="text-2xl font-bold text-slate-950">Information you enter</h2><p className="mt-3">ArthaSiddhi currently has no user accounts, login system, database, payment processing, or contact-form backend. Calculator inputs are processed in your browser to display results and are not intentionally submitted to ArthaSiddhi for storage.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-950">Technical information</h2><p className="mt-3">Like most hosted websites, the hosting and network infrastructure may process technical information needed to deliver and secure the site. This may include IP addresses, request times, requested pages, browser or device information, and diagnostic or security logs. Retention and processing can depend on the infrastructure operating the service.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-950">Cookies and local storage</h2><p className="mt-3">ArthaSiddhi does not intentionally add advertising or analytics cookies at this milestone. Essential technical storage may still be used by the site or hosting infrastructure where necessary for security, delivery, or core functionality. The policy will be updated if optional tracking tools are introduced.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-950">Third-party links</h2><p className="mt-3">Articles may link to external sources. Those websites operate under their own privacy practices, which ArthaSiddhi does not control.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-950">Policy changes</h2><p className="mt-3">This policy may change as the website and its operational requirements develop. Material changes will be reflected on this page with an updated date. See the <Link href="/terms" className="font-semibold text-emerald-700 underline underline-offset-4">Terms of Use</Link> for additional site conditions.</p></section>
    </InfoPage>
  );
}
