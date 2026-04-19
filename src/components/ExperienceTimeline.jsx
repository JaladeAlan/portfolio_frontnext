export default function ExperienceTimeline({ experience }) {
  return (
    <section className="py-28 px-4 sm:px-6 lg:px-8 bg-ink-800">
      <div className="max-w-4xl mx-auto">
        <p className="font-mono text-electric-400 text-sm tracking-widest uppercase mb-4">
          02.5 / Experience
        </p>
        <h2 className="font-display text-4xl sm:text-5xl text-cream-100 mb-14">
          Where I've worked
        </h2>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-electric-400/50 via-electric-400/20 to-transparent" />

          <div className="space-y-12 pl-8">
            {experience.map((item, i) => (
              <div key={item.id || i} className="relative">
                {/* Dot */}
                <div className="absolute -left-[2.15rem] top-1.5 w-3 h-3 rounded-full border-2 border-electric-400 bg-ink-900" />

                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <h3 className="font-display text-xl text-cream-100">{item.role}</h3>
                    {item.is_current && (
                      <span className="font-mono text-xs px-2 py-0.5 bg-green-400/10 text-green-400 rounded-full border border-green-400/30">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="font-semibold text-electric-400 mb-2">{item.company}</p>
                  <p className="font-mono text-xs text-cream-200/40 mb-3 tracking-wide">
                    {formatDate(item.start_date)} — {item.is_current ? "Present" : formatDate(item.end_date)}
                    {item.location && ` · ${item.location}`}
                  </p>
                  {item.description && (
                    <p className="text-cream-200/60 leading-relaxed">{item.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}
