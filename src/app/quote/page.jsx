"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Send, Loader2,
  Globe, Smartphone, Layers, Zap,
  Clock, User, Mail, Building2, MessageSquare,
  ChevronDown, Check, AlertCircle,
} from "lucide-react";
import { submitQuote } from "@/lib/supabase";

/* ── Project type options ─────────────────────────────────────────── */
const PROJECT_TYPES = [
  { id: "web",    icon: Globe,       label: "Web App",        desc: "SaaS, dashboards, portals" },
  { id: "mobile", icon: Smartphone,  label: "Mobile App",     desc: "iOS, Android, React Native" },
  { id: "both",   icon: Layers,      label: "Web + Mobile",   desc: "Full cross-platform" },
  { id: "other",  icon: Zap,         label: "Other / Custom", desc: "API, integrations, more" },
];

const TIMELINES = [
  "ASAP (< 1 month)",
  "1 – 2 months",
  "3 – 6 months",
  "6+ months / ongoing",
  "Not sure yet",
];

const email = process.env.NEXT_PUBLIC_OWNER_EMAIL || "lajadelabs@gmail.com";

/* ── Shared field wrapper ─────────────────────────────────────────── */
function Field({ label, hint, children }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <label className="font-mono text-xs text-cream-200/40 uppercase tracking-widest">
          {label}
        </label>
        {hint && <span className="font-mono text-xs text-cream-200/25">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

/* ── Input / Textarea shared style ───────────────────────────────── */
const inputCls =
  "w-full bg-ink-900 border border-ink-500 hover:border-electric-400/40 focus:border-electric-400/60 focus:ring-2 focus:ring-electric-400/10 rounded-lg px-4 py-3 text-sm text-cream-100 placeholder-cream-200/20 outline-none transition-all duration-200 font-sans";

/* ── Custom Dropdown ──────────────────────────────────────────────── */
function TimelineSelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`
          w-full flex items-center gap-2 px-4 py-3 rounded-lg border text-sm text-left
          transition-all duration-200 outline-none bg-ink-900 font-sans
          ${open
            ? "border-electric-400/60 ring-2 ring-electric-400/10"
            : "border-ink-500 hover:border-electric-400/40"
          }
        `}
      >
        <Clock size={14} className="shrink-0 text-cream-200/30" />
        <span className={`flex-1 ${value ? "text-cream-100" : "text-cream-200/20"}`}>
          {value ?? "Select timeline"}
        </span>
        <ChevronDown
          size={14}
          className={`shrink-0 text-cream-200/40 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-50 left-0 right-0 mt-1.5 bg-ink-800 border border-ink-600 rounded-xl shadow-2xl shadow-black/60 overflow-hidden">
          <p className="font-mono px-4 pt-3 pb-1.5 text-[10px] uppercase tracking-widest text-cream-200/30">
            Select timeline
          </p>
          <div className="pb-1.5">
            {TIMELINES.map((t) => {
              const active = value === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => { onChange(t); setOpen(false); }}
                  className={`
                    w-full flex items-center justify-between px-4 py-2.5 text-sm text-left
                    font-sans transition-colors duration-150
                    ${active ? "bg-electric-400/10 text-electric-400" : "text-cream-200/60 hover:bg-ink-700 hover:text-cream-100"}
                  `}
                >
                  {t}
                  {active && <Check size={13} className="text-electric-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────── */
export default function QuotePage() {
  const router = useRouter();
  const [projectType, setProjectType] = useState("");
  const [timeline, setTimeline]       = useState("");
  const [submitting, setSubmitting]   = useState(false);
  const [errors, setErrors]           = useState({});
  const [serverError, setServerError] = useState("");

  const validate = (data) => {
    const e = {};
    if (!data.name.trim())        e.name    = "Required";
    if (!data.email.trim())       e.email   = "Required";
    else if (!/\S+@\S+\.\S+/.test(data.email)) e.email = "Invalid email";
    if (!projectType)             e.type    = "Pick a project type";
    if (!data.message.trim())     e.message = "Tell me a bit about the project";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());

    const errs = validate(data);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSubmitting(true);

    try {
      await submitQuote({
        name:         data.name,
        email:        data.email,
        company:      data.company || "",
        project_type: projectType,
        timeline:     timeline,
        message:      data.message,
      });

      router.push("/quote/confirmed");
    } catch (err) {
      console.error("Quote submission error:", err);
      setServerError("Something went wrong saving your request. Please try again or email me directly.");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink-900 pt-32 pb-20 px-4 sm:px-6">
      {/* Radial glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-electric-400/5 blur-3xl" />
      </div>

      <div className="relative max-w-2xl mx-auto">

        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-cream-200/40 hover:text-electric-400 transition-colors mb-10 group"
        >
          <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to home
        </Link>

        {/* Header */}
        <div className="mb-12">
          <p className="font-mono text-electric-400 text-sm tracking-widest uppercase mb-4">
            Get a quote
          </p>
          <h1 className="font-display text-5xl sm:text-6xl text-cream-100 mb-4 leading-none">
            Let's scope<br />your project.
          </h1>
          <p className="text-cream-200/50 text-lg leading-relaxed max-w-md">
            Tell me about your project and I'll put together a tailored
            proposal — usually within 24 hours.
          </p>
        </div>

        {/* Server error banner */}
        {serverError && (
          <div className="mb-6 flex items-start gap-3 bg-red-400/10 border border-red-400/30 rounded-xl px-5 py-4">
            <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-300 font-mono">{serverError}</p>
          </div>
        )}

        {/* Card */}
        <div className="bg-ink-800 border border-ink-600 rounded-2xl overflow-hidden">
          <form onSubmit={handleSubmit} noValidate>
            <div className="p-6 sm:p-8 flex flex-col gap-8">

              {/* ── Contact info ─────────────────────────────────── */}
              <section>
                <p className="font-mono text-[10px] uppercase tracking-widest text-cream-200/30 mb-5">
                  Contact
                </p>
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Your name">
                    <div className="relative">
                      <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream-200/30 pointer-events-none" />
                      <input
                        name="name"
                        type="text"
                        placeholder="Ada Okonkwo"
                        autoComplete="name"
                        className={`${inputCls} pl-9 ${errors.name ? "border-red-400/60" : ""}`}
                      />
                    </div>
                    {errors.name && <p className="font-mono text-xs text-red-400">{errors.name}</p>}
                  </Field>

                  <Field label="Email">
                    <div className="relative">
                      <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream-200/30 pointer-events-none" />
                      <input
                        name="email"
                        type="email"
                        placeholder="ada@company.com"
                        autoComplete="email"
                        className={`${inputCls} pl-9 ${errors.email ? "border-red-400/60" : ""}`}
                      />
                    </div>
                    {errors.email && <p className="font-mono text-xs text-red-400">{errors.email}</p>}
                  </Field>

                  <Field label="Company" hint="optional">
                    <div className="relative">
                      <Building2 size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream-200/30 pointer-events-none" />
                      <input
                        name="company"
                        type="text"
                        placeholder="Acme Ltd"
                        autoComplete="organization"
                        className={`${inputCls} pl-9`}
                      />
                    </div>
                  </Field>
                </div>
              </section>

              <div className="h-px bg-ink-600" />

              {/* ── Project type ─────────────────────────────────── */}
              <section>
                <p className="font-mono text-[10px] uppercase tracking-widest text-cream-200/30 mb-5">
                  Project type
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {PROJECT_TYPES.map(({ id, icon: Icon, label, desc }) => {
                    const active = projectType === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setProjectType(id)}
                        className={`flex flex-col items-start gap-2 p-4 rounded-xl border text-left transition-all duration-200 ${
                          active
                            ? "border-electric-400/60 bg-electric-400/10 text-cream-100"
                            : "border-ink-600 bg-ink-900/40 text-cream-200/50 hover:border-ink-500 hover:text-cream-200/80"
                        }`}
                      >
                        <Icon size={17} className={active ? "text-electric-400" : "text-cream-200/30"} />
                        <span className="font-mono text-xs font-bold leading-tight">{label}</span>
                        <span className="font-mono text-[10px] leading-tight opacity-60">{desc}</span>
                      </button>
                    );
                  })}
                </div>
                {errors.type && <p className="font-mono text-xs text-red-400 mt-2">{errors.type}</p>}
              </section>

              <div className="h-px bg-ink-600" />

              {/* ── Timeline ─────────────────────────────────────── */}
              <section>
                <p className="font-mono text-[10px] uppercase tracking-widest text-cream-200/30 mb-5">
                  Scope
                </p>
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Timeline" hint="optional">
                    <TimelineSelect value={timeline} onChange={setTimeline} />
                  </Field>
                </div>
              </section>

              <div className="h-px bg-ink-600" />

              {/* ── Project details ───────────────────────────────── */}
              <section>
                <p className="font-mono text-[10px] uppercase tracking-widest text-cream-200/30 mb-5">
                  Project details
                </p>
                <Field label="Tell me about your project">
                  <div className="relative">
                    <MessageSquare size={14} className="absolute left-3.5 top-3.5 text-cream-200/30 pointer-events-none" />
                    <textarea
                      name="message"
                      rows={5}
                      placeholder="What are you building? What problem does it solve? Any specific features or tech preferences?"
                      className={`${inputCls} pl-9 resize-none leading-relaxed ${errors.message ? "border-red-400/60" : ""}`}
                    />
                  </div>
                  {errors.message && <p className="font-mono text-xs text-red-400">{errors.message}</p>}
                </Field>
              </section>
            </div>

            {/* Footer / submit */}
            <div className="px-6 sm:px-8 pb-8 pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-ink-600">
              <p className="font-mono text-xs text-cream-200/25 leading-relaxed">
                No commitment. Just a conversation.
              </p>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-7 py-3.5 rounded-lg bg-electric-500 hover:bg-electric-400
                           disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold
                           transition-all duration-300 hover:shadow-[0_0_24px_rgba(79,158,255,0.35)]
                           active:scale-[0.98] whitespace-nowrap"
              >
                {submitting ? (
                  <><Loader2 size={15} className="animate-spin" /> Saving…</>
                ) : (
                  <><Send size={15} /> Send Request</>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer note */}
        <p className="text-center font-mono text-xs text-cream-200/25 mt-6">
          Prefer email?{" "}
          <a
            href={`mailto:${email}`}
            className="text-cream-200/40 hover:text-electric-400 transition-colors"
          >
            {email}
          </a>
        </p>
      </div>
    </div>
  );
}