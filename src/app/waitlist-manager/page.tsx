"use client";

import { Nunito } from "next/font/google";
import { useState } from "react";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  display: "swap",
});

const BRAND = {
  red: "#E8170F",
  redLight: "#FADADD",
  cream: "#F5EFE6",
  brown: "#5C3A1E",
  pink: "#F472B6",
  pinkDark: "#EC4899",
  blue: "#1A56DB",
  teal: "#0F4C75",
  white: "#FFFFFF",
  black: "#111111",
  blush: "#F9D0D3",
};

const SOURCES = ["Instagram Ad", "Facebook Ad", "TikTok Ad", "Story Ad", "Referral", "Other"];
const INTERESTS = ["Classic Crew", "No-Show", "Ankle Sport", "Thermal Cosy", "Kids Range", "Gift Bundle"];
const STATUSES = ["Waiting", "Contacted", "Converted", "Dropped"];

const STATUS_COLORS: Record<
  string,
  { bg: string; text: string; dot: string }
> = {
  Waiting: { bg: "#FFF3CD", text: "#856404", dot: "#FFC107" },
  Contacted: { bg: "#CCE5FF", text: "#004085", dot: "#007BFF" },
  Converted: { bg: "#D4EDDA", text: "#155724", dot: "#28A745" },
  Dropped: { bg: "#F8D7DA", text: "#721C24", dot: "#DC3545" },
};

function SocksmithLogo({ color = "#FFFFFF", size = 36 }: { color?: string; size?: number }) {
  return (
    <svg viewBox="0 0 340 160" style={{ width: size * 2.1, height: size, display: "block" }}>
      <text
        x="4"
        y="76"
        fontFamily="'Arial Black','Impact',sans-serif"
        fontWeight="900"
        fontSize="86"
        fill={color}
        letterSpacing="-3"
      >
        socks.
      </text>
      <text
        x="14"
        y="155"
        fontFamily="'Arial Black','Impact',sans-serif"
        fontWeight="900"
        fontSize="86"
        fill={color}
        letterSpacing="-3"
      >
        smith
      </text>
    </svg>
  );
}

const initialEntries = [
  {
    id: 1,
    name: "Adaeze Okonkwo",
    phone: "+234 811 234 5678",
    email: "adaeze@gmail.com",
    source: "Instagram Ad",
    interest: "Classic Crew",
    status: "Waiting",
    note: "Wants 3 pairs",
    date: "2025-04-20",
  },
  {
    id: 2,
    name: "Kofi Mensah",
    phone: "+233 244 876 543",
    email: "kofi.m@yahoo.com",
    source: "TikTok Ad",
    interest: "Ankle Sport",
    status: "Contacted",
    note: "Interested in bulk",
    date: "2025-04-21",
  },
  {
    id: 3,
    name: "Fatima Bello",
    phone: "+234 903 456 7890",
    email: "",
    source: "Story Ad",
    interest: "Thermal Cosy",
    status: "Converted",
    note: "Ordered 5 pairs",
    date: "2025-04-22",
  },
  {
    id: 4,
    name: "Emeka Dike",
    phone: "+234 807 123 4567",
    email: "emeka.d@outlook.com",
    source: "Facebook Ad",
    interest: "Gift Bundle",
    status: "Waiting",
    note: "",
    date: "2025-04-23",
  },
  {
    id: 5,
    name: "Zara Osei",
    phone: "+44 7911 234567",
    email: "zara.osei@gmail.com",
    source: "Referral",
    interest: "No-Show",
    status: "Waiting",
    note: "Lagos delivery",
    date: "2025-04-24",
  },
];

let nextId = 6;

type Entry = (typeof initialEntries)[number];

export default function WaitlistManagerPage() {
  const [entries, setEntries] = useState<Entry[]>(initialEntries);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [sortField, setSortField] = useState<keyof Entry>("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [activeTab, setActiveTab] = useState<"list" | "insights">("list");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    source: "Instagram Ad",
    interest: "Classic Crew",
    status: "Waiting",
    note: "",
    date: new Date().toISOString().slice(0, 10),
  });
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  const stats = {
    total: entries.length,
    waiting: entries.filter((e) => e.status === "Waiting").length,
    contacted: entries.filter((e) => e.status === "Contacted").length,
    converted: entries.filter((e) => e.status === "Converted").length,
    dropped: entries.filter((e) => e.status === "Dropped").length,
    convRate: entries.length
      ? Math.round((entries.filter((e) => e.status === "Converted").length / entries.length) * 100)
      : 0,
  };

  const filtered = entries
    .filter((e) => filter === "All" || e.status === filter)
    .filter((e) => {
      const q = search.toLowerCase();
      return (
        !q ||
        e.name.toLowerCase().includes(q) ||
        e.phone.includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.interest.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const va = String(a[sortField] ?? "");
      const vb = String(b[sortField] ?? "");
      if (sortDir === "asc") return va > vb ? 1 : -1;
      return va < vb ? 1 : -1;
    });

  const openAdd = () => {
    setForm({
      name: "",
      phone: "",
      email: "",
      source: "Instagram Ad",
      interest: "Classic Crew",
      status: "Waiting",
      note: "",
      date: new Date().toISOString().slice(0, 10),
    });
    setEditId(null);
    setShowForm(true);
  };

  const openEdit = (entry: Entry) => {
    setForm({ ...entry });
    setEditId(entry.id);
    setShowForm(true);
  };

  const saveForm = () => {
    if (!form.name.trim() || !form.phone.trim()) {
      showToast("Name and phone are required.", "error");
      return;
    }
    if (editId != null) {
      setEntries((prev) => prev.map((e) => (e.id === editId ? { ...form, id: editId } : e)));
      showToast("Entry updated.");
    } else {
      setEntries((prev) => [...prev, { ...form, id: nextId++ }]);
      showToast("New entry added to waitlist!");
    }
    setShowForm(false);
  };

  const deleteEntry = (id: number) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    showToast("Entry removed.", "error");
  };

  const updateStatus = (id: number, status: string) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
    showToast(`Marked as ${status}.`);
  };

  const toggleSort = (field: keyof Entry) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const sourceBreakdown = SOURCES.map((s) => ({
    label: s,
    count: entries.filter((e) => e.source === s).length,
  })).filter((s) => s.count > 0);

  const interestBreakdown = INTERESTS.map((i) => ({
    label: i,
    count: entries.filter((e) => e.interest === i).length,
  })).filter((i) => i.count > 0);

  return (
    <div
      className={nunito.className}
      style={{
        minHeight: "100vh",
        background: BRAND.cream,
        color: BRAND.black,
      }}
    >
      <div
        style={{
          background: BRAND.black,
          padding: "18px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 100,
          boxShadow: "0 2px 16px rgba(0,0,0,0.18)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <SocksmithLogo color={BRAND.white} size={30} />
          <div style={{ borderLeft: `2px solid ${BRAND.red}`, paddingLeft: 14 }}>
            <div
              style={{
                color: BRAND.white,
                fontWeight: 900,
                fontSize: 15,
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              Waitlist Manager
            </div>
            <div
              style={{
                color: BRAND.redLight,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              Enquiry CRM
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={openAdd}
          style={{
            background: BRAND.red,
            color: BRAND.white,
            border: "none",
            borderRadius: 10,
            padding: "10px 22px",
            fontWeight: 900,
            fontSize: 14,
            cursor: "pointer",
            letterSpacing: 1,
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "inherit",
          }}
        >
          <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Add Entry
        </button>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 12,
            marginBottom: 24,
          }}
        >
          {[
            { label: "Total Enquiries", val: stats.total, bg: BRAND.black, text: BRAND.white, accent: BRAND.red },
            { label: "Waiting", val: stats.waiting, bg: BRAND.white, text: BRAND.black, accent: "#FFC107" },
            { label: "Contacted", val: stats.contacted, bg: BRAND.white, text: BRAND.black, accent: "#007BFF" },
            { label: "Converted", val: stats.converted, bg: BRAND.white, text: BRAND.black, accent: "#28A745" },
            { label: "Dropped", val: stats.dropped, bg: BRAND.white, text: BRAND.black, accent: "#DC3545" },
            { label: "Conv. Rate", val: `${stats.convRate}%`, bg: BRAND.red, text: BRAND.white, accent: BRAND.white },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: s.bg,
                borderRadius: 14,
                padding: "16px 18px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
                borderTop: `4px solid ${s.accent}`,
              }}
            >
              <div style={{ fontSize: 28, fontWeight: 900, color: s.text, lineHeight: 1 }}>{s.val}</div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: s.text,
                  opacity: 0.65,
                  marginTop: 4,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {(["list", "insights"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              style={{
                background: activeTab === tab ? BRAND.red : BRAND.white,
                color: activeTab === tab ? BRAND.white : BRAND.black,
                border: "none",
                borderRadius: 8,
                padding: "8px 20px",
                fontWeight: 800,
                fontSize: 13,
                cursor: "pointer",
                fontFamily: "inherit",
                textTransform: "capitalize",
                letterSpacing: 0.5,
              }}
            >
              {tab === "list" ? "📋 Waitlist" : "📊 Insights"}
            </button>
          ))}
        </div>

        {activeTab === "list" && (
          <>
            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                marginBottom: 16,
                alignItems: "center",
              }}
            >
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, phone, interest…"
                style={{
                  flex: 1,
                  minWidth: 200,
                  padding: "10px 14px",
                  borderRadius: 9,
                  border: `2px solid ${BRAND.redLight}`,
                  fontSize: 13,
                  fontFamily: "inherit",
                  outline: "none",
                  background: BRAND.white,
                }}
              />
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {["All", ...STATUSES].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setFilter(s)}
                    style={{
                      background: filter === s ? BRAND.red : BRAND.white,
                      color: filter === s ? BRAND.white : BRAND.black,
                      border: `2px solid ${filter === s ? BRAND.red : "#ddd"}`,
                      borderRadius: 8,
                      padding: "7px 14px",
                      fontWeight: 800,
                      fontSize: 12,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div
              style={{
                background: BRAND.white,
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              }}
            >
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: BRAND.black, color: BRAND.white }}>
                      {(
                        [
                          ["#", null],
                          ["Name", "name"],
                          ["Phone", "phone"],
                          ["Source", "source"],
                          ["Interest", "interest"],
                          ["Status", "status"],
                          ["Date", "date"],
                          ["Note", null],
                          ["Actions", null],
                        ] as const
                      ).map(([label, field]) => (
                        <th
                          key={label}
                          onClick={() => field && toggleSort(field)}
                          style={{
                            padding: "13px 14px",
                            textAlign: "left",
                            fontWeight: 900,
                            fontSize: 11,
                            letterSpacing: 1.5,
                            textTransform: "uppercase",
                            cursor: field ? "pointer" : "default",
                            userSelect: "none",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {label} {field && sortField === field && (sortDir === "asc" ? "↑" : "↓")}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={9} style={{ textAlign: "center", padding: 40, color: "#aaa", fontWeight: 700 }}>
                          No entries match your filter.
                        </td>
                      </tr>
                    )}
                    {filtered.map((e, i) => {
                      const sc = STATUS_COLORS[e.status] ?? STATUS_COLORS.Waiting;
                      return (
                        <tr
                          key={e.id}
                          style={{
                            borderBottom: "1px solid #f0f0f0",
                            background: i % 2 === 0 ? BRAND.white : "#FAFAFA",
                          }}
                        >
                          <td style={{ padding: "12px 14px", fontWeight: 900, color: "#bbb" }}>{i + 1}</td>
                          <td style={{ padding: "12px 14px", fontWeight: 800 }}>{e.name}</td>
                          <td style={{ padding: "12px 14px", color: BRAND.teal, fontWeight: 700 }}>{e.phone}</td>
                          <td style={{ padding: "12px 14px" }}>
                            <span
                              style={{
                                background: BRAND.redLight,
                                color: BRAND.red,
                                borderRadius: 6,
                                padding: "3px 9px",
                                fontSize: 11,
                                fontWeight: 800,
                              }}
                            >
                              {e.source}
                            </span>
                          </td>
                          <td style={{ padding: "12px 14px", fontWeight: 700 }}>{e.interest}</td>
                          <td style={{ padding: "12px 14px" }}>
                            <select
                              value={e.status}
                              onChange={(ev) => updateStatus(e.id, ev.target.value)}
                              style={{
                                background: sc.bg,
                                color: sc.text,
                                border: "none",
                                borderRadius: 7,
                                padding: "4px 10px",
                                fontWeight: 800,
                                fontSize: 12,
                                cursor: "pointer",
                                fontFamily: "inherit",
                              }}
                            >
                              {STATUSES.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td style={{ padding: "12px 14px", color: "#888", fontSize: 12 }}>{e.date}</td>
                          <td
                            style={{
                              padding: "12px 14px",
                              color: "#666",
                              maxWidth: 120,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {e.note || "—"}
                          </td>
                          <td style={{ padding: "12px 14px", whiteSpace: "nowrap" }}>
                            <button
                              type="button"
                              onClick={() => openEdit(e)}
                              style={{
                                background: BRAND.cream,
                                border: "none",
                                borderRadius: 6,
                                padding: "5px 12px",
                                fontWeight: 800,
                                fontSize: 12,
                                cursor: "pointer",
                                marginRight: 6,
                                fontFamily: "inherit",
                              }}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteEntry(e.id)}
                              style={{
                                background: "#FEE2E2",
                                color: "#DC3545",
                                border: "none",
                                borderRadius: 6,
                                padding: "5px 12px",
                                fontWeight: 800,
                                fontSize: 12,
                                cursor: "pointer",
                                fontFamily: "inherit",
                              }}
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div
                style={{
                  padding: "12px 18px",
                  borderTop: "1px solid #f0f0f0",
                  fontSize: 12,
                  color: "#aaa",
                  fontWeight: 700,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>
                  Showing {filtered.length} of {entries.length} entries
                </span>
                <span style={{ color: BRAND.red }}>socks.smith waitlist · internal use only</span>
              </div>
            </div>
          </>
        )}

        {activeTab === "insights" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            <div
              style={{
                background: BRAND.white,
                borderRadius: 16,
                padding: 24,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              }}
            >
              <div style={{ fontWeight: 900, fontSize: 15, marginBottom: 16, letterSpacing: 0.5 }}>Status Breakdown</div>
              {STATUSES.map((s) => {
                const count = entries.filter((e) => e.status === s).length;
                const pct = entries.length ? (count / entries.length) * 100 : 0;
                const sc = STATUS_COLORS[s];
                return (
                  <div key={s} style={{ marginBottom: 14 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 5,
                        fontWeight: 700,
                        fontSize: 13,
                      }}
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <span
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            background: sc.dot,
                            display: "inline-block",
                          }}
                        />
                        {s}
                      </span>
                      <span style={{ color: "#888" }}>
                        {count} ({Math.round(pct)}%)
                      </span>
                    </div>
                    <div style={{ background: "#f0f0f0", borderRadius: 20, height: 8, overflow: "hidden" }}>
                      <div
                        style={{
                          width: `${pct}%`,
                          background: sc.dot,
                          height: "100%",
                          borderRadius: 20,
                          transition: "width 0.6s ease",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              style={{
                background: BRAND.white,
                borderRadius: 16,
                padding: 24,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              }}
            >
              <div style={{ fontWeight: 900, fontSize: 15, marginBottom: 16, letterSpacing: 0.5 }}>Enquiry Sources</div>
              {sourceBreakdown.length === 0 && <div style={{ color: "#aaa" }}>No data yet.</div>}
              {sourceBreakdown.map((s) => {
                const pct = entries.length ? (s.count / entries.length) * 100 : 0;
                return (
                  <div key={s.label} style={{ marginBottom: 14 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 5,
                        fontWeight: 700,
                        fontSize: 13,
                      }}
                    >
                      <span>{s.label}</span>
                      <span style={{ color: "#888" }}>{s.count}</span>
                    </div>
                    <div style={{ background: "#f0f0f0", borderRadius: 20, height: 8, overflow: "hidden" }}>
                      <div
                        style={{
                          width: `${pct}%`,
                          background: BRAND.red,
                          height: "100%",
                          borderRadius: 20,
                          transition: "width 0.6s ease",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              style={{
                background: BRAND.white,
                borderRadius: 16,
                padding: 24,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              }}
            >
              <div style={{ fontWeight: 900, fontSize: 15, marginBottom: 16, letterSpacing: 0.5 }}>Product Interest</div>
              {interestBreakdown.length === 0 && <div style={{ color: "#aaa" }}>No data yet.</div>}
              {interestBreakdown.map((s) => {
                const pct = entries.length ? (s.count / entries.length) * 100 : 0;
                return (
                  <div key={s.label} style={{ marginBottom: 14 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 5,
                        fontWeight: 700,
                        fontSize: 13,
                      }}
                    >
                      <span>{s.label}</span>
                      <span style={{ color: "#888" }}>{s.count}</span>
                    </div>
                    <div style={{ background: "#f0f0f0", borderRadius: 20, height: 8, overflow: "hidden" }}>
                      <div
                        style={{
                          width: `${pct}%`,
                          background: BRAND.brown,
                          height: "100%",
                          borderRadius: 20,
                          transition: "width 0.6s ease",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              style={{
                background: BRAND.black,
                borderRadius: 16,
                padding: 24,
                boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                color: BRAND.white,
              }}
            >
              <div style={{ fontWeight: 900, fontSize: 15, marginBottom: 16, letterSpacing: 0.5 }}>
                🎯 Conversion Summary
              </div>
              <div style={{ fontSize: 52, fontWeight: 900, color: BRAND.red, lineHeight: 1 }}>{stats.convRate}%</div>
              <div style={{ fontSize: 13, color: "#aaa", marginTop: 6, marginBottom: 20 }}>
                of enquiries converted to customers
              </div>
              <div style={{ borderTop: "1px solid #333", paddingTop: 16 }}>
                {(
                  [
                    ["🟡 In Pipeline", stats.waiting + stats.contacted],
                    ["✅ Won", stats.converted],
                    ["❌ Lost", stats.dropped],
                  ] as const
                ).map(([label, val]) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 10,
                      fontWeight: 700,
                      fontSize: 13,
                    }}
                  >
                    <span style={{ color: "#ccc" }}>{label}</span>
                    <span style={{ color: BRAND.white }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {showForm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
          onClick={() => setShowForm(false)}
          onKeyDown={(ev) => ev.key === "Escape" && setShowForm(false)}
          role="presentation"
        >
          <div
            style={{
              background: BRAND.white,
              borderRadius: 20,
              padding: "32px 28px",
              width: "100%",
              maxWidth: 480,
              boxShadow: "0 8px 40px rgba(0,0,0,0.22)",
            }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="waitlist-form-title"
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
              <div id="waitlist-form-title" style={{ fontWeight: 900, fontSize: 18 }}>
                {editId != null ? "✏️ Edit Entry" : "➕ New Enquiry"}
              </div>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{
                  background: BRAND.redLight,
                  border: "none",
                  borderRadius: 8,
                  width: 32,
                  height: 32,
                  cursor: "pointer",
                  fontWeight: 900,
                  color: BRAND.red,
                  fontSize: 16,
                }}
              >
                ✕
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {(
                [
                  ["name", "Full Name *", "text"],
                  ["phone", "Phone Number *", "tel"],
                  ["email", "Email (optional)", "email"],
                  ["date", "Date", "date"],
                ] as const
              ).map(([field, label, type]) => (
                <div
                  key={field}
                  style={{
                    gridColumn: field === "name" || field === "phone" ? "1 / -1" : undefined,
                  }}
                >
                  <label
                    style={{
                      display: "block",
                      fontWeight: 800,
                      fontSize: 12,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      marginBottom: 5,
                      color: "#555",
                    }}
                  >
                    {label}
                  </label>
                  <input
                    type={type}
                    value={form[field as keyof typeof form] as string}
                    onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: 9,
                      border: "2px solid #eee",
                      fontSize: 14,
                      fontFamily: "inherit",
                      outline: "none",
                      boxSizing: "border-box",
                      transition: "border 0.2s",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = BRAND.red;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#eee";
                    }}
                  />
                </div>
              ))}
              {(
                [
                  ["source", "Ad Source", SOURCES],
                  ["interest", "Product Interest", INTERESTS],
                  ["status", "Status", STATUSES],
                ] as const
              ).map(([field, label, options]) => (
                <div key={field}>
                  <label
                    style={{
                      display: "block",
                      fontWeight: 800,
                      fontSize: 12,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      marginBottom: 5,
                      color: "#555",
                    }}
                  >
                    {label}
                  </label>
                  <select
                    value={form[field as keyof typeof form] as string}
                    onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: 9,
                      border: "2px solid #eee",
                      fontSize: 14,
                      fontFamily: "inherit",
                      outline: "none",
                      boxSizing: "border-box",
                      background: BRAND.white,
                    }}
                  >
                    {options.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
              <div style={{ gridColumn: "1 / -1" }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: 800,
                    fontSize: 12,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    marginBottom: 5,
                    color: "#555",
                  }}
                >
                  Note
                </label>
                <textarea
                  value={form.note}
                  onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                  rows={2}
                  placeholder="Any special request, size preference, etc."
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 9,
                    border: "2px solid #eee",
                    fontSize: 14,
                    fontFamily: "inherit",
                    outline: "none",
                    resize: "vertical",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={saveForm}
              style={{
                background: BRAND.red,
                color: BRAND.white,
                border: "none",
                borderRadius: 10,
                padding: "13px 0",
                fontWeight: 900,
                fontSize: 15,
                cursor: "pointer",
                width: "100%",
                marginTop: 18,
                fontFamily: "inherit",
                letterSpacing: 1,
              }}
            >
              {editId != null ? "Save Changes" : "Add to Waitlist"}
            </button>
          </div>
        </div>
      )}

      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 28,
            right: 24,
            background: toast.type === "error" ? "#DC3545" : BRAND.black,
            color: BRAND.white,
            borderRadius: 12,
            padding: "13px 22px",
            fontWeight: 800,
            fontSize: 14,
            zIndex: 300,
            boxShadow: "0 6px 24px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            animation: "fadeIn 0.3s",
          }}
        >
          {toast.type === "error" ? "⚠️" : "✅"} {toast.msg}
        </div>
      )}

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
