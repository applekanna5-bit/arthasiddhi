import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/site/InfoPage";
import { pageMetadata } from "@/lib/content/seo";

export const metadata: Metadata = pageMetadata({ title: "Privacy Policy | ArthaSiddhi", description: "How ArthaSiddhi handles information when you use its public website and client-side financial calculators.", path: "/privacy" });

export default function PrivacyPage() {
  return (
    <InfoPage eyebrow="Legal" title="Privacy Policy" description="This policy describes the current public ArthaSiddhi website, its client-side financial calculators, and its use of website analytics. Last updated: 23 August 2026.">
      <section><h2 className="text-2xl font-bold text-slate-950">Information you enter</h2><p className="mt-3">ArthaSiddhi currently has no user accounts, login system, payment processing, or contact-form backend. Calculator inputs are processed in your browser to display results and are not intentionally submitted to ArthaSiddhi for storage. If you email ArthaSiddhi, the information you choose to provide is used to review and respond to your enquiry.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-950">Google Analytics</h2><p className="mt-3">ArthaSiddhi uses Google Analytics to understand how the website is used and how it performs. Depending on the analytics configuration and a visitor’s browser choices, this may involve information such as pages viewed, interactions, browser or device information, and approximate geographic or other technical information. ArthaSiddhi does not use this information to provide personalized financial advice.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-950">Technical information</h2><p className="mt-3">Like most hosted websites, the hosting and network infrastructure may process technical information needed to deliver and secure the site. This may include IP addresses, request times, requested pages, browser or device information, and diagnostic or security logs. Retention and processing can depend on the infrastructure operating the service.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-950">Cookies and local storage</h2><p className="mt-3">Google Analytics may use cookies or similar technology to measure website usage. The calculator code does not save inputs in local or session storage. Hosting or network infrastructure may also use essential cookies or similar technical storage for security or delivery. ArthaSiddhi does not currently carry advertising.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-950">Third-party links</h2><p className="mt-3">The site may link to external official or supporting sources. Those websites operate under their own privacy practices, which ArthaSiddhi does not control.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-950">Privacy enquiries</h2><p className="mt-3">For a privacy-related question, email <a href="mailto:contact@arthasiddhi.com" className="font-semibold text-emerald-700 underline underline-offset-4">contact@arthasiddhi.com</a>. Do not include sensitive financial information unless it is necessary for the enquiry.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-950">Policy changes</h2><p className="mt-3">This policy may change as the website and its operational requirements develop. Material changes will be reflected on this page with an updated date. See the <Link href="/terms" className="font-semibold text-emerald-700 underline underline-offset-4">Terms of Use</Link> for additional site conditions.</p></section>
    </InfoPage>
  );
}
