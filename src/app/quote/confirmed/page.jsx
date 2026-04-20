import Link from "next/link";
import { CheckCircle, ArrowLeft, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Quote Request Sent",
};

export default function QuoteConfirmedPage() {
  return (
    <div className="min-h-screen bg-ink-900 flex items-center justify-center px-4 py-20">
      {/* Radial glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-electric-400/5 blur-3xl" />
      </div>

      <div className="relative max-w-lg w-full text-center flex flex-col items-center gap-10">

        {/* Icon */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full border border-electric-400/20 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-electric-400/10 border border-electric-400/30 flex items-center justify-center">
              <CheckCircle size={30} className="text-electric-400" strokeWidth={1.5} />
            </div>
          </div>
          {/* Pulse ring */}
          <div className="absolute inset-0 rounded-full border border-electric-400/10 animate-ping" />
        </div>

        {/* Text */}
        <div className="flex flex-col gap-3">
          <p className="font-mono text-electric-400 text-sm tracking-widest uppercase">
            Request received
          </p>
          <h1 className="font-display text-4xl sm:text-5xl text-cream-100 leading-tight">
            You're all set.
          </h1>
          <p className="text-cream-200/50 text-base leading-relaxed max-w-sm mx-auto">
            Thanks for reaching out. I'll review your project details and come
            back to you with a tailored proposal within{" "}
            <span className="text-electric-400 font-semibold">24 hours</span>.
          </p>
        </div>

        {/* What happens next */}
        <div className="w-full bg-ink-800 border border-ink-600 rounded-2xl p-6 sm:p-8 text-left flex flex-col gap-5">
          <p className="font-mono text-[10px] uppercase tracking-widest text-cream-200/30">
            What happens next
          </p>
          {[
            { step: "01", text: "I review your project details and scope." },
            { step: "02", text: "I put together a tailored proposal with timeline and pricing." },
            { step: "03", text: "We jump on a quick call to align on everything." },
          ].map(({ step, text }) => (
            <div key={step} className="flex items-start gap-4">
              <span className="font-mono text-xs text-electric-400/60 mt-0.5 shrink-0">
                {step}
              </span>
              <p className="text-sm text-cream-200/60 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 rounded-lg
                       border border-ink-600 text-cream-200/50 hover:text-cream-100 hover:border-ink-500
                       font-mono text-sm transition-all duration-200"
          >
            <ArrowLeft size={14} />
            Back to home
          </Link>
          <Link
            href="/projects"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 rounded-lg
                       bg-electric-500 hover:bg-electric-400 text-white font-semibold text-sm
                       transition-all duration-300 hover:shadow-[0_0_24px_rgba(79,158,255,0.35)]"
          >
            View my work
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}