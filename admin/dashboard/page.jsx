"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Plus, Edit, Trash2, Eye } from "lucide-react";

const API = process.env.NEXT_PUBLIC_LARAVEL_API_URL || "http://localhost:8000/api";

async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("projects");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/admin/login"); return; }

    Promise.all([
      apiFetch("/admin/me"),
      apiFetch("/projects"),
      apiFetch("/messages"),
    ])
      .then(([me, proj, msgs]) => {
        setAdmin(me.admin);
        setProjects(proj.data || proj);
        setMessages(msgs.data || msgs);
      })
      .catch(() => {
        localStorage.removeItem("token");
        router.push("/admin/login");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/admin/login");
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this project?")) return;
    await apiFetch(`/projects/${id}`, { method: "DELETE" });
    setProjects((p) => p.filter((x) => x.id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ink-900 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-electric-400/30 border-t-electric-400 rounded-full animate-spin" />
      </div>
    );
  }

  const tabs = [
    { id: "projects", label: `Projects (${projects.length})` },
    { id: "messages", label: `Messages (${messages.length})` },
  ];

  return (
    <div className="min-h-screen bg-ink-900 pt-0">
      {/* Admin Header */}
      <header className="bg-ink-800 border-b border-ink-600 px-6 py-4 flex items-center justify-between">
        <div>
          <p className="font-mono text-xs text-electric-400 tracking-widest uppercase mb-0.5">Admin</p>
          <h1 className="font-display text-xl text-cream-100">Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-sm text-cream-200/40 hidden sm:block">
            {admin?.name}
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 font-mono text-xs px-4 py-2 border border-red-400/30
                       text-red-400 rounded-lg hover:bg-red-400/10 transition-all"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 border border-ink-600 rounded-lg p-1 w-fit">
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

        {/* Projects Tab */}
        {activeTab === "projects" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display text-2xl text-cream-100">Projects</h2>
              <button className="flex items-center gap-2 font-mono text-sm bg-electric-500 hover:bg-electric-400
                                 text-white px-4 py-2 rounded-lg transition-colors">
                <Plus size={14} />
                Add Project
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
                        title="View"
                      >
                        <Eye size={16} />
                      </a>
                      <button className="p-2 text-electric-400/60 hover:text-electric-400 transition-colors" title="Edit">
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-2 text-red-400/60 hover:text-red-400 transition-colors"
                        title="Delete"
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

        {/* Messages Tab */}
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
                        <a href={`mailto:${m.email}`} className="font-mono text-xs text-electric-400/70 hover:text-electric-400">
                          {m.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        {!m.read && (
                          <span className="font-mono text-xs px-2 py-0.5 bg-electric-400/10 text-electric-400 rounded-full border border-electric-400/30">
                            New
                          </span>
                        )}
                        <p className="font-mono text-xs text-cream-200/30">
                          {new Date(m.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-cream-200/60 text-sm leading-relaxed">{m.message}</p>
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
