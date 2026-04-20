"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

export default function PageLoader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const isFirst = useRef(true);
  const fadeTimer = useRef(null);
  const removeTimer = useRef(null);

  function showLoader() {
    clearTimeout(fadeTimer.current);
    clearTimeout(removeTimer.current);
    setFading(false);
    setVisible(true);
  }

  function hideLoader() {
    fadeTimer.current = setTimeout(() => setFading(true), 80);
    removeTimer.current = setTimeout(() => setVisible(false), 600);
  }

  // Intercept all internal link clicks → show loader immediately on click
  useEffect(() => {
    const handleClick = (e) => {
      const anchor = e.target.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href) return;

      const isInternal =
        !href.startsWith("http") &&
        !href.startsWith("mailto") &&
        !href.startsWith("tel") &&
        !href.startsWith("#") &&
        !href.startsWith("//");

      if (isInternal) showLoader();
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Hide once the route has changed and new page rendered
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      // Initial page load: show briefly then fade
      fadeTimer.current = setTimeout(() => setFading(true), 500);
      removeTimer.current = setTimeout(() => setVisible(false), 1050);
      return;
    }
    hideLoader();
  }, [pathname]);

  useEffect(() => {
    return () => {
      clearTimeout(fadeTimer.current);
      clearTimeout(removeTimer.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        backgroundColor: "#0d0d0d",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "20px",
        opacity: fading ? 0 : 1,
        transition: "opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        pointerEvents: fading ? "none" : "all",
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "360px",
          height: "360px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(79,158,255,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Logo mark */}
      <div style={{ position: "relative" }}>
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            border: "1px solid rgba(79,158,255,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "jl-ring-pulse 2s ease-in-out infinite",
          }}
        >
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: "rgba(79,158,255,0.08)",
              border: "1px solid rgba(79,158,255,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display, 'Playfair Display', Georgia, serif)",
                fontSize: "15px",
                fontWeight: "bold",
                color: "#4f9eff",
                letterSpacing: "0.05em",
              }}
            >
              JD
            </span>
          </div>
        </div>
      </div>

      {/* Shimmer wordmark */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        <span
          style={{
            fontFamily: "var(--font-display, 'Playfair Display', Georgia, serif)",
            fontSize: "20px",
            fontWeight: "bold",
            color: "rgba(249,240,200,0.12)",
            letterSpacing: "0.04em",
            position: "relative",
            display: "inline-block",
          }}
        >
          Jalade.dev
          <span
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(90deg, transparent 0%, rgba(79,158,255,0.9) 45%, rgba(180,220,255,1) 50%, rgba(79,158,255,0.9) 55%, transparent 100%)",
              backgroundSize: "200% 100%",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "jl-shimmer 1.4s ease-in-out infinite",
            }}
          >
            Jalade.dev
          </span>
        </span>
      </div>

      {/* Dots */}
      <div style={{ display: "flex", gap: "6px", marginTop: "2px" }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              backgroundColor: "rgba(79,158,255,0.4)",
              animation: `jl-dot-bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes jl-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes jl-ring-pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50%       { transform: scale(1.08); opacity: 1; }
        }
        @keyframes jl-dot-bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; }
          40%            { transform: scale(1.2); opacity: 1; }
        }
      `}</style>
    </div>
  );
}