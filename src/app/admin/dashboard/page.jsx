"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Plus, Edit, Trash2, Eye, FileText, Mail } from "lucide-react";
import { supabase, getMessages, getQuotes, updateQuoteStatus, markMessageRead } from "@/lib/supabase";

const PROJECT_TYPE_LABELS = {
  web: "Web App", mobile: "Mobile App", both: "Web + Mobile", other: "Other / Custom",
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [admin, setAdmin]         = useState(null);
  const [projects, setProjects]   = useState([]);
  const [messages, setMessages]   = useState([]);
  const [quotes, setQuotes]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [activeTab, setActiveTab] = useState("projects");

  const loadData = useCallback(async () => {
    const [projRes, msgs, quoteList] = await Promise.all([
      supabase.from("projects").select("*").order("created_at", { ascending: false }),
      getMessages(),
      getQuotes(),
    ]);

    setProjects(projRes.data || []);
    setMessages(msgs);
    setQuotes(quoteList);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        router.push("/admin/login");
        return;
      }

      setAdmin({ name: session.user.email });

      try {
        await loadData();
      } catch {
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    });
  }, [router, loadData]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const handleDeleteProject = async (id) => {
    if (!confirm("Delete this project?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (!error) setProjects((p) => p.filter((x) => x.id !== id));
  };

  const handleMarkRead = async (id) => {
    await markMessageRead(id);
    setMessages((msgs) =>
      msgs.map((m) => (m.id === id ? { ...m, read: true } : m))
    );
  };

  const handleQuoteStatus = async (id, status) => {
    await updateQuoteStatus(id, status);
    setQuotes((qs) =>
      qs.map((q) => (q.id === id ? { ...q, status } : q))
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ink-900 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-electric-400/30 border-t-electric-400 rounded-full animate-spin" />
      </div>
    );
  }

  const unreadCount = messages.filter((m) => !m.read).length;

  const tabs = [
    { id: "projects", label: `Projects (${projects.length})` },
    { id: "messages", label: `Messages (${messages.length})${unreadCount ? ` · ${unreadCount} new` : ""}` },
    { id: "quotes",   label: `Quotes (${quotes.length})` },
  ];

  const quoteStatuses = ["new", "reviewed", "replied", "closed"];

  return (
    <div className="min-h-screen bg-ink-900">
      <header className="bg-ink-800 border-b border-ink-600 px-6 py-4 flex items-center justify-between">
        <div>
          <p className="font-mono text-xs text-electric-400 tracking-widest uppercase mb-0.5">Admin</p>
          <h1 className="font-display text-xl text-cream-100">Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-sm text-cream-200/40 hidden sm:block">{admin?.name}</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 font-mono text-xs px-4 py-2 border border-red-400/30 text-red-400 rounded-lg hover:bg-red-400/10 transition-all"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-wrap gap-1 mb-8 border border-ink-600 rounded-lg p-1 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`font-mono text-sm px-5 py-2 rounded-md transition-all ${
                activeTab === tab.id
                  ? "bg-electric-500 text-white"
                  : "text-cream-200/40 hover:text-cream-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Projects ── */}
        {activeTab === "projects" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display text-2xl text-cream-100">Projects</h2>
              <button className="flex items-center gap-2 font-mono text-sm bg-electric-500 hover:bg-electric-400 text-white px-4 py-2 rounded-lg transition-colors">
                <Plus size={14} /> Add Project
              </button>
            </div>

            {projects.length === 0 ? (
              <p className="text-cream-200/30 font-mono text-sm">No projects yet.</p>
            ) : (
              <div className="space-y-3">
                {projects.map((p) => (
                  <div
                    key={p.id}
                    className="bg-ink-800 border border-ink-600 rounded-xl p-5 flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <h3 className="text-cream-100 font-semibold truncate">{p.title}</h3>
                      <p className="font-mono text-xs text-electric-400/60 mt-0.5">{p.stack}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={`/projects/${p.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-cream-200/40 hover:text-cream-100 transition-colors"
                      >
                        <Eye size={16} />
                      </a>
                      <button className="p-2 text-electric-400/60 hover:text-electric-400 transition-colors">
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(p.id)}
                        className="p-2 text-red-400/60 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Messages ── */}
        {activeTab === "messages" && (
          <div>
            <h2 className="font-display text-2xl text-cream-100 mb-6">Messages</h2>

            {messages.length === 0 ? (
              <p className="text-cream-200/30 font-mono text-sm">No messages yet.</p>
            ) : (
              <div className="space-y-4">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`bg-ink-800 border rounded-xl p-5 ${
                      m.read ? "border-ink-600" : "border-electric-400/40"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-cream-100">{m.name}</p>
                        <a
                          href={`mailto:${m.email}`}
                          className="font-mono text-xs text-electric-400/70 hover:text-electric-400"
                        >
                          {m.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {!m.read && (
                          <button
                            onClick={() => handleMarkRead(m.id)}
                            className="font-mono text-xs px-2 py-0.5 bg-electric-400/10 text-electric-400 rounded-full border border-electric-400/30 hover:bg-electric-400/20 transition-colors"
                          >
                            New
                          </button>
                        )}
                        <p className="font-mono text-xs text-cream-200/30">
                          {new Date(m.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-cream-200/60 text-sm leading-relaxed mb-4">{m.message}</p>
                    <a
                      href={`mailto:${m.email}?subject=Re: Your message&body=Hi ${m.name},%0A%0A`}
                      className="inline-flex items-center gap-1.5 font-mono text-xs text-electric-400/60 hover:text-electric-400 transition-colors"
                    >
                      <Mail size={12} />
                      Reply via email →
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Quotes ── */}
        {activeTab === "quotes" && (
          <div>
            <h2 className="font-display text-2xl text-cream-100 mb-6">Quote Requests</h2>

            {quotes.length === 0 ? (
              <div className="text-center py-16 border border-ink-600 rounded-xl bg-ink-800/40">
                <FileText size={32} className="text-cream-200/20 mx-auto mb-3" />
                <p className="text-cream-200/30 font-mono text-sm">No quote requests yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {quotes.map((q) => (
                  <div
                    key={q.id}
                    className={`bg-ink-800 border rounded-xl p-5 ${
                      q.status === "new" ? "border-amber-500/30" : "border-ink-600"
                    }`}
                  >
                    <div className="flex flex-wrap justify-between items-start gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-semibold text-cream-100">{q.name}</p>
                          {q.company && (
                            <span className="font-mono text-xs text-cream-200/40">· {q.company}</span>
                          )}
                        </div>
                        <a
                          href={`mailto:${q.email}`}
                          className="font-mono text-xs text-electric-400/70 hover:text-electric-400"
                        >
                          {q.email}
                        </a>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        {/* Status selector */}
                        <select
                          value={q.status}
                          onChange={(e) => handleQuoteStatus(q.id, e.target.value)}
                          className={`font-mono text-xs px-2.5 py-1 rounded-full border bg-transparent cursor-pointer
                            focus:outline-none transition-colors
                            ${q.status === "new"      ? "bg-amber-500/10 text-amber-400 border-amber-500/30" : ""}
                            ${q.status === "reviewed" ? "bg-blue-500/10 text-blue-400 border-blue-500/30"    : ""}
                            ${q.status === "replied"  ? "bg-green-500/10 text-green-400 border-green-500/30" : ""}
                            ${q.status === "closed"   ? "bg-cream-200/5 text-cream-200/40 border-ink-600"    : ""}
                          `}
                        >
                          {quoteStatuses.map((s) => (
                            <option key={s} value={s} className="bg-ink-800 text-cream-100">{s}</option>
                          ))}
                        </select>

                        <span className="font-mono text-xs px-2.5 py-1 rounded-full border border-electric-400/20 text-electric-400/70">
                          {PROJECT_TYPE_LABELS[q.project_type] || q.project_type}
                        </span>
                        <p className="font-mono text-xs text-cream-200/30">
                          {new Date(q.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {q.timeline && (
                      <p className="font-mono text-xs text-cream-200/40 mb-2">Timeline: {q.timeline}</p>
                    )}
                    <p className="text-cream-200/60 text-sm leading-relaxed">{q.message}</p>

                    <div className="mt-4 pt-3 border-t border-ink-600">
                      <a
                        href={`mailto:${q.email}?subject=Re: Your project quote request&body=Hi ${q.name},%0A%0AThanks for reaching out...`}
                        className="inline-flex items-center gap-1.5 font-mono text-xs text-electric-400/60 hover:text-electric-400 transition-colors"
                      >
                        <Mail size={12} />
                        Reply via email →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}