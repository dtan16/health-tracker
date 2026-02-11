import { useEffect, useState } from "react";

// const API_BASE = "http://localhost:4000/api";
const API_BASE =
  import.meta.env.PROD
    ? "https://health-tracker-api-bpfk.onrender.com/api"
    : "http://localhost:4000/api";

const inputStyle = {
  padding: "0.5rem 0.6rem",
  borderRadius: "0.5rem",
  border: "1px solid #444",
  background: "#111",
  color: "#f5f5f5",
};

function App() {
  const [statusMessage, setStatusMessage] = useState("Loading...");
  const [date, setDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );

  const [calories, setCalories] = useState("");
  const [waterMl, setWaterMl] = useState("");
  const [sleepHours, setSleepHours] = useState("");

  // macros
  const [carbs, setCarbs] = useState("");
  const [protein, setProtein] = useState("");
  const [fats, setFats] = useState("");

  // weight + unit
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState("kg");

  const [logs, setLogs] = useState([]);
  const [saving, setSaving] = useState(false);

  // Goals (simple defaults)
  const [goalCalories, setGoalCalories] = useState(2200);
  const [goalWaterMl, setGoalWaterMl] = useState(2000);
  const [goalSleepHours, setGoalSleepHours] = useState(8);

  // Check backend health once
  useEffect(() => {
    fetch(`${API_BASE}/health`)
      .then((res) => res.json())
      .then((data) => setStatusMessage(data.message))
      .catch(() => setStatusMessage("Could not connect to backend 😢"));
  }, []);

  // Load logs from backend
  const fetchLogs = () => {
    fetch(`${API_BASE}/logs`)
      .then((res) => res.json())
      .then((data) => setLogs(data))
      .catch((err) => console.error("Failed to load logs", err));
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`${API_BASE}/logs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          calories,
          waterMl,
          sleepHours,
          carbs,
          protein,
          fats,
          weight,
          weightUnit,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.error || "Failed to save log");
        return;
      }

      fetchLogs();
    } catch (err) {
      console.error(err);
      alert("Network error while saving");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#111",
        color: "#f5f5f5",
        fontFamily: "system-ui",
        padding: "2.5rem 1.5rem",
      }}
    >
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>
          Health Tracker
        </h1>

        {/* Backend status */}
        <section style={{ marginBottom: "2rem" }}>
          <p style={{ marginBottom: "0.5rem" }}>Backend status:</p>
          <pre
            style={{
              background: "#222",
              padding: "0.75rem 1rem",
              borderRadius: "0.75rem",
              opacity: 0.9,
            }}
          >
            {statusMessage}
          </pre>
        </section>

        {/* Goals */}
        <section
          style={{
            marginBottom: "2rem",
            background: "#181818",
            padding: "1.5rem",
            borderRadius: "1rem",
          }}
        >
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Goals</h2>

          <div style={{ display: "grid", gap: "0.75rem", maxWidth: "380px" }}>
            <label style={{ display: "grid", gap: "0.25rem" }}>
              <span>Daily Calories Goal</span>
              <input
                type="number"
                value={goalCalories}
                onChange={(e) => setGoalCalories(Number(e.target.value))}
                style={inputStyle}
              />
            </label>

            <label style={{ display: "grid", gap: "0.25rem" }}>
              <span>Daily Water Goal (ml)</span>
              <input
                type="number"
                value={goalWaterMl}
                onChange={(e) => setGoalWaterMl(Number(e.target.value))}
                style={inputStyle}
              />
            </label>

            <label style={{ display: "grid", gap: "0.25rem" }}>
              <span>Sleep Goal (hours)</span>
              <input
                type="number"
                step="0.1"
                value={goalSleepHours}
                onChange={(e) => setGoalSleepHours(Number(e.target.value))}
                style={inputStyle}
              />
            </label>
          </div>
        </section>

        {/* Today log form */}
        <section
          style={{
            marginBottom: "2.5rem",
            background: "#181818",
            padding: "1.5rem",
            borderRadius: "1rem",
          }}
        >
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
            Today&apos;s Log
          </h2>

          <form
            onSubmit={handleSubmit}
            style={{
              display: "grid",
              gap: "0.75rem",
              maxWidth: "380px",
            }}
          >
            <label style={{ display: "grid", gap: "0.25rem" }}>
              <span>Date</span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={inputStyle}
              />
            </label>

            <label style={{ display: "grid", gap: "0.25rem" }}>
              <span>Calories</span>
              <input
                type="number"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                placeholder="e.g. 2100"
                style={inputStyle}
              />
            </label>

            <label style={{ display: "grid", gap: "0.25rem" }}>
              <span>Carbs (g)</span>
              <input
                type="number"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                placeholder="e.g. 250"
                style={inputStyle}
              />
            </label>

            <label style={{ display: "grid", gap: "0.25rem" }}>
              <span>Protein (g)</span>
              <input
                type="number"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                placeholder="e.g. 120"
                style={inputStyle}
              />
            </label>

            <label style={{ display: "grid", gap: "0.25rem" }}>
              <span>Fats (g)</span>
              <input
                type="number"
                value={fats}
                onChange={(e) => setFats(e.target.value)}
                placeholder="e.g. 70"
                style={inputStyle}
              />
            </label>

            <label style={{ display: "grid", gap: "0.25rem" }}>
              <span>Water (ml)</span>
              <input
                type="number"
                value={waterMl}
                onChange={(e) => setWaterMl(e.target.value)}
                placeholder="e.g. 2000"
                style={inputStyle}
              />
            </label>

            <label style={{ display: "grid", gap: "0.25rem" }}>
              <span>Sleep (hours)</span>
              <input
                type="number"
                step="0.1"
                value={sleepHours}
                onChange={(e) => setSleepHours(e.target.value)}
                placeholder="e.g. 7.5"
                style={inputStyle}
              />
            </label>

            <label style={{ display: "grid", gap: "0.25rem" }}>
              <span>Weight</span>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g. 70"
                  style={{ ...inputStyle, flex: 1 }}
                />
                <select
                  value={weightUnit}
                  onChange={(e) => setWeightUnit(e.target.value)}
                  style={{
                    ...inputStyle,
                    maxWidth: "90px",
                    cursor: "pointer",
                  }}
                >
                  <option value="kg">kg</option>
                  <option value="lb">lb</option>
                </select>
              </div>
            </label>

            <button
              type="submit"
              disabled={saving || !date}
              style={{
                marginTop: "0.5rem",
                padding: "0.6rem 1rem",
                borderRadius: "999px",
                border: "none",
                background: saving ? "#555" : "#f97316",
                color: "#111",
                fontWeight: 600,
                cursor: saving ? "default" : "pointer",
              }}
            >
              {saving ? "Saving..." : "Save Daily Log"}
            </button>
          </form>
        </section>

        {/* Recent Logs */}
        <section>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
            Recent Logs
          </h2>

          {logs.length === 0 ? (
            <p style={{ opacity: 0.8 }}>No logs yet. Add your first one!</p>
          ) : (
            <div style={{ display: "grid", gap: "0.75rem" }}>
              {logs.map((log) => (
                <article
                  key={log.id}
                  style={{
                    background: "#181818",
                    padding: "0.75rem 1rem",
                    borderRadius: "0.75rem",
                    fontSize: "0.95rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "0.35rem",
                    }}
                  >
                    <strong>
                      {new Date(log.date).toLocaleDateString("en-US")}
                    </strong>
                    <span style={{ opacity: 0.7, fontSize: "0.85rem" }}>
                      Calories: {log.calories || 0}
                    </span>
                  </div>

                  <div style={{ opacity: 0.9, marginBottom: "0.25rem" }}>
                    🥣 Carbs {log.carbs || 0} g · 🥩 Protein{" "}
                    {log.protein || 0} g · 🧈 Fats {log.fats || 0} g
                  </div>

                  <div style={{ opacity: 0.85 }}>
                    💧 {log.waterMl || 0} ml · 😴 {log.sleepHours || 0} hours ·
                    ⚖️{" "}
                    {log.weight != null
                      ? `${log.weight} ${log.weightUnit || ""}`
                      : "—"}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default App;
