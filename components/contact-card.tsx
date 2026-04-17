"use client";

import { useEffect, useState } from "react";

type ContactCardProps = {
  email: string;
  title: string;
  description: string;
  copyButtonLabel: string;
  copiedButtonLabel: string;
  copyFailedButtonLabel: string;
  sendButtonLabel: string;
  copiedHint: string;
  copyFailedHint: string;
};

type CopyState = "idle" | "copied" | "failed";

function MailIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9Z" />
      <path d="m5 7 7 5 7-5" />
    </svg>
  );
}

export function ContactCard({
  email,
  title,
  description,
  copyButtonLabel,
  copiedButtonLabel,
  copyFailedButtonLabel,
  sendButtonLabel,
  copiedHint,
  copyFailedHint,
}: ContactCardProps) {
  const [copyState, setCopyState] = useState<CopyState>("idle");

  useEffect(() => {
    if (copyState === "idle") {
      return;
    }

    const timer = window.setTimeout(() => {
      setCopyState("idle");
    }, 2200);

    return () => {
      window.clearTimeout(timer);
    };
  }, [copyState]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  };

  const copyButtonText =
    copyState === "copied"
      ? copiedButtonLabel
      : copyState === "failed"
        ? copyFailedButtonLabel
        : copyButtonLabel;

  const statusText =
    copyState === "copied"
      ? copiedHint
      : copyState === "failed"
        ? copyFailedHint
        : description;

  return (
    <article className="contact-card hover-smooth glow-border group relative mx-auto w-full max-w-2xl overflow-hidden rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.76),rgba(8,12,28,0.9))] p-6 shadow-[0_24px_90px_rgba(2,6,23,0.48)] backdrop-blur-xl hover:-translate-y-1.5 hover:border-sky-300/28 hover:shadow-[0_34px_110px_rgba(37,99,235,0.24)] sm:p-7">
      <div className="hover-smooth absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(125,211,252,0.14),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(167,139,250,0.16),transparent_36%)] opacity-80 group-hover:opacity-100" />
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/45 to-transparent" />

      <div className="relative flex flex-col gap-6">
        <div className="flex items-start gap-4">
          <div className="contact-icon flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-sky-300/20 bg-[linear-gradient(135deg,rgba(14,165,233,0.2),rgba(139,92,246,0.16))] text-sky-100 shadow-[0_0_30px_rgba(59,130,246,0.18)]">
            <MailIcon />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-[0.28em] text-sky-200/80">
              {title}
            </p>
            <a
              href={`mailto:${email}`}
              className="contact-email hover-smooth mt-3 inline-block break-all font-[family-name:var(--font-space-grotesk)] text-2xl font-semibold text-white hover:text-sky-100 hover:[text-shadow:0_0_18px_rgba(125,211,252,0.18)] sm:text-[2rem]"
            >
              {email}
            </a>
            <p
              className={`contact-status mt-3 text-sm leading-7 ${
                copyState === "failed" ? "text-rose-200" : "text-slate-300"
              }`}
              aria-live="polite"
            >
              {statusText}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href={`mailto:${email}`}
            className="primary-cta hover-smooth group relative inline-flex min-h-12 flex-1 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-sky-500 via-blue-500 to-violet-500 px-6 py-3 font-medium text-white shadow-[0_0_35px_rgba(59,130,246,0.35)] hover:-translate-y-1 hover:scale-[1.02] hover:from-sky-400 hover:via-blue-500 hover:to-violet-400 hover:shadow-[0_0_70px_rgba(96,165,250,0.45)] active:scale-[0.98]"
          >
            <span className="absolute inset-0 bg-[linear-gradient(120deg,transparent_15%,rgba(255,255,255,0.22)_50%,transparent_85%)] opacity-0 transition duration-500 group-hover:translate-x-full group-hover:opacity-100" />
            <span className="relative">{sendButtonLabel}</span>
          </a>

          <button
            type="button"
            onClick={handleCopy}
            className="secondary-cta hover-smooth inline-flex min-h-12 flex-1 items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 font-medium text-slate-100 backdrop-blur hover:-translate-y-1 hover:border-sky-300/45 hover:bg-white/10 hover:text-white hover:shadow-[0_0_36px_rgba(96,165,250,0.14)] active:scale-[0.98]"
          >
            <span className="bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
              {copyButtonText}
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}
