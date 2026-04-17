"use client";

import { ContactCard } from "@/components/contact-card";
import { useLanguage } from "@/components/language-provider";

const contactEmail = "3903532190@qq.com";

export function ContactSection() {
  const { messages } = useLanguage();
  const contact = messages.contact;

  return (
    <section className="contact-section relative flex min-h-[calc(100vh-96px)] items-center py-16 md:py-20">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="section-ambient-wash absolute inset-0 bg-[linear-gradient(135deg,rgba(8,15,34,0.24)_0%,rgba(29,78,216,0.08)_38%,rgba(147,51,234,0.1)_72%,rgba(10,14,28,0.1)_100%)]" />
        <div className="section-ambient-grid absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(circle_at_center,black,transparent_88%)]" />
        <div className="section-ambient-top absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_64%)] blur-3xl" />
        <div className="section-ambient-bottom absolute inset-x-0 bottom-0 h-56 bg-[radial-gradient(circle_at_bottom,rgba(168,85,247,0.14),transparent_64%)] blur-3xl" />
      </div>

      <div className="mx-auto flex w-full max-w-4xl flex-col items-center">
        <div className="animate-fade-up text-center">
          <div className="section-badge inline-flex items-center rounded-full border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-sm text-sky-200 shadow-[0_0_24px_rgba(56,189,248,0.12)] backdrop-blur">
            {contact.badge}
          </div>

          <h1 className="contact-title mt-6 font-[family-name:var(--font-space-grotesk)] text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-[4.25rem]">
            {contact.title}
          </h1>

          <p className="contact-subtitle mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            {contact.subtitle}
          </p>

          <p className="contact-note mt-4 text-sm leading-7 text-sky-100/90">
            {contact.note}
          </p>
        </div>

        <div className="mt-12 w-full animate-fade-up-delayed">
          <ContactCard
            email={contactEmail}
            title={contact.emailLabel}
            description={contact.emailDescription}
            copyButtonLabel={contact.copyButton}
            copiedButtonLabel={contact.copiedButton}
            copyFailedButtonLabel={contact.copyFailedButton}
            sendButtonLabel={contact.sendButton}
            copiedHint={contact.copiedHint}
            copyFailedHint={contact.copyFailedHint}
          />
        </div>
      </div>
    </section>
  );
}
