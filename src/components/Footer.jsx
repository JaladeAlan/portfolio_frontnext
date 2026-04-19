import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Projects", path: "/projects" },
  { name: "Contact", path: "/contact" },
];

const socials = [
  { icon: Github, href: "https://github.com/jaladedev", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com/in/jaladedev", label: "LinkedIn" },
  { icon: Mail, href: "mailto:Ayodeji@jaladedev.com", label: "Email" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink-800 border-t border-ink-600 py-14 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="font-display text-2xl text-cream-100 hover:text-electric-400 transition-colors">
              Jalade<span className="text-electric-400 font-mono text-base">.</span>dev
            </Link>
            <p className="mt-3 text-cream-200/40 text-sm leading-relaxed">
              Full Stack Developer specializing<br />in Laravel & React.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="font-mono text-xs text-cream-200/30 uppercase tracking-widest mb-4">Navigation</p>
            <ul className="space-y-2">
              {navLinks.map((l) => (
                <li key={l.name}>
                  <Link href={l.path} className="text-cream-200/50 hover:text-cream-100 text-sm transition-colors">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div>
            <p className="font-mono text-xs text-cream-200/30 uppercase tracking-widest mb-4">Connect</p>
            <div className="flex gap-4">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 border border-ink-500 rounded-lg flex items-center justify-center
                             text-cream-200/40 hover:text-electric-400 hover:border-electric-400/50 transition-all"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-ink-600 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="font-mono text-xs text-cream-200/25">
            © {year} Ayodeji Alalade — All Rights Reserved.
          </p>
          <p className="font-mono text-xs text-cream-200/25">
            Built with Next.js · Laravel · Supabase
          </p>
        </div>
      </div>
    </footer>
  );
}
