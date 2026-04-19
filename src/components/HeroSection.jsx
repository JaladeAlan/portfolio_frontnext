"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowDown } from "lucide-react";

const fullName = process.env.NEXT_PUBLIC_OWNER_NAME || "";
const [firstName, lastName] = fullName.split(" ");

const roles = [
  "Full Stack Developer",
  "Laravel Engineer",
  "React Developer",
  "API Architect",
  "Next.js Developer",
];

export default function HeroSection() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const current = roles[roleIndex];
    let timeout;

    if (!deleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80);
    } else if (!deleting && displayed.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setRoleIndex((i) => (i + 1) % roles.length);
    }

    return () => clearTimeout(timeout);
  }, [displayed, deleting, roleIndex, mounted]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-ink-900">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(79,158,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(79,158,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(79,158,255,0.12),transparent)]" />

      {/* Decorative number */}
      <span className="absolute top-1/2 -right-8 -translate-y-1/2 font-display text-[20vw] text-cream-100/[0.02] select-none leading-none pointer-events-none">
        JA
      </span>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Pre-heading */}
        <div
          className="inline-flex items-center gap-2 border border-electric-400/30 rounded-full px-4 py-1.5 mb-8
                        font-mono text-xs text-electric-400 tracking-widest uppercase"
          style={{ animationDelay: "0.1s" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Available for freelance work
        </div>

        {/* Main headline */}
          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl text-cream-100 mb-4 leading-none">
            Hi, I'm{" "}
            <span className="text-electric-400">{firstName}</span>
            <br />
            <span className="text-cream-100">{lastName}</span>
          </h1>

        {/* Typewriter */}
        <div className="h-10 flex items-center justify-center mb-8">
          <p className="font-mono text-lg sm:text-2xl text-cream-200/60">
            {displayed}
            <span className="inline-block w-0.5 h-6 bg-electric-400 ml-0.5 animate-blink align-middle" />
          </p>
        </div>

        <p className="text-cream-200/50 text-base sm:text-lg max-w-xl mx-auto mb-12 leading-relaxed">
          I build scalable REST APIs and modern frontend applications using
          Laravel, React, and Next.js.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="#projects"
            className="inline-flex items-center justify-center gap-2 bg-electric-500 hover:bg-electric-400
                       text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300
                       hover:shadow-[0_0_30px_rgba(79,158,255,0.4)]"
          >
            View My Work
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 border border-cream-200/20
                       text-cream-100 hover:border-cream-200/60 px-8 py-4 rounded-lg transition-all duration-300
                       font-semibold"
          >
            Get in touch
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2
                   text-cream-200/30 hover:text-electric-400 transition-colors group"
      >
        <span className="font-mono text-xs tracking-widest">SCROLL</span>
        <ArrowDown size={14} className="group-hover:translate-y-1 transition-transform" />
      </a>
    </section>
  );
}
