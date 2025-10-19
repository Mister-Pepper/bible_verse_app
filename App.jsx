import { useState } from "react";

const API = "https://labs.bible.org/api/?type=json";

function format(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return "No verse found.";
  return arr.map(v => `${v.bookname} ${v.chapter}:${v.verse} — ${v.text.trim()}`).join("\n");
}

export default function App() {
  return (
    <div style={s.page}>
      <div style={s.card}>
        <h1 style={s.h1}>Bible Verses</h1>
        <p style={s.muted}>Minimal, functional. Random or by reference.</p>

        <RandomVerse />
        <Divider />
        <SpecificVerse />
      </div>
    </div>
  );
}

// verse functions
function RandomVerse() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function getRandom() {
    try {
      setLoading(true);
      const r = await fetch(`${API}&passage=random`);
      const data = await r.json();
      setText(format(data));
    } catch {
      setText("Error loading verse.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <h2 style={s.h2}>Random Verse</h2>
      <button style={s.btn} onClick={getRandom} disabled={loading}>
        {loading ? "Loading…" : "Get Random Verse"}
      </button>
      {text && <pre style={s.box}>{text}</pre>}
    </section>
  );
}

// verse function
function SpecificVerse() {
  const [ref, setRef] = useState("John 3:16");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function getSpecific() {
    const q = ref.trim();
    if (!q) return;
    try {
      setLoading(true);
      const r = await fetch(`${API}&passage=${encodeURIComponent(q)}`);
      const data = await r.json();
      setText(format(data));
    } catch {
      setText("Error loading verse.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <h2 style={s.h2}>Specific Verse</h2>
      <div style={s.row}>
        <input
          value={ref}
          onChange={(e) => setRef(e.target.value)}
          placeholder="e.g., John 3:16"
          style={s.input}
        />
        <button style={s.btn} onClick={getSpecific} disabled={loading}>
          {loading ? "Loading…" : "Get Verse"}
        </button>
      </div>
      {text && <pre style={s.box}>{text}</pre>}
    </section>
  );
}

function Divider() {
  return <hr style={s.hr} />;
}

// styling preferences 
const s = {
  page: {
    minHeight: "100vh",
    background: "#f7f7f7",
    display: "grid",
    placeItems: "center",
    padding: 24,
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
    color: "#111",
  },
  card: {
    width: "100%",
    maxWidth: 720,
    background: "#fff",
    border: "1px solid #e7e7e7",
    borderRadius: 12,
    padding: 20,
    boxShadow: "0 8px 20px rgba(0,0,0,.05)",
  },
  h1: { margin: 0, fontSize: 28 },
  h2: { margin: "16px 0 8px", fontSize: 18 },
  muted: { marginTop: 6, color: "#666", fontSize: 14 },
  row: { display: "flex", gap: 8, alignItems: "center", margin: "8px 0" },
  input: {
    flex: 1,
    padding: "10px 12px",
    border: "1px solid #ccc",
    borderRadius: 10,
    background: "#fafafa",
  },
  btn: {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #ccc",
    background: "#111",
    color: "#fff",
    cursor: "pointer",
  },
  box: {
    whiteSpace: "pre-wrap",
    background: "#fafafa",
    border: "1px solid #eee",
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
    lineHeight: 1.45,
  },
  hr: { border: 0, borderTop: "1px solid #eee", margin: "18px 0" },
};
