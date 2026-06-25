// In production, replace this with your actual backend URL (e.g., https://smarttrace-api.onrender.com/api)
const API_BASE = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://127.0.0.1:3000/api"
  : "/api"; // Assumes a reverse proxy or same-domain deployment


/* =========================================================
   INIT ICONS (MANDATORY)
   ========================================================= */
lucide.createIcons();

/* =========================================================
   THEME TOGGLE
   ========================================================= */
document.getElementById("theme-toggle").addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
});

/* =========================================================
   TOAST
   ========================================================= */
function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `
    px-4 py-3 rounded-xl shadow-lg text-sm font-semibold
    ${type === "error" ? "bg-rose-600 text-white" : "bg-indigo-600 text-white"}
  `;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

/* =========================================================
   SAFE JSON PARSER
   ========================================================= */
function parseJsonSafely(text) {
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Backend returned non-JSON response:\n" + text);
  }
}

/* =========================================================
   TAB SWITCHING (THIS FIXES YOUR ISSUE)
   ========================================================= */
const tabGenerate = document.getElementById("tab-btn-generate");
const tabVerify = document.getElementById("tab-btn-verify");
const viewGenerate = document.getElementById("view-generate");
const viewVerify = document.getElementById("view-verify");

tabGenerate.addEventListener("click", () => {
  tabGenerate.classList.add("active");
  tabVerify.classList.remove("active");
  viewGenerate.classList.remove("hidden");
  viewVerify.classList.add("hidden");
});

tabVerify.addEventListener("click", () => {
  tabVerify.classList.add("active");
  tabGenerate.classList.remove("active");
  viewVerify.classList.remove("hidden");   // ← THIS WAS MISSING
  viewGenerate.classList.add("hidden");
});

/* =========================================================
   BULK GENERATION
   ========================================================= */
document.getElementById("btn-generate-batch").addEventListener("click", async () => {
  const units = parseInt(document.getElementById("batch-size-input").value);
  if (!units || units <= 0) {
    showToast("Invalid batch size", "error");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/bulk/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: 1, units })
    });

    const text = await res.text();
    const data = parseJsonSafely(text);
    if (!res.ok) throw new Error(data.error);

    document.getElementById("generation-output").classList.remove("hidden");
    document.getElementById("gen-msg-count").textContent =
      `Generated ${data.units_generated} units`;
    document.getElementById("gen-msg-perf").textContent =
      `Cartons: ${data.cartons_generated}, Pallets: ${data.pallet_generated}`;

    document.getElementById("stat-primary").textContent = data.units_generated;
    document.getElementById("stat-secondary").textContent = data.cartons_generated;
    document.getElementById("stat-tertiary").textContent = data.pallet_generated;

    showToast("Batch generated successfully");
  } catch (err) {
    showToast(err.message, "error");
  }
});

/* =========================================================
   SCAN & VERIFY (NOW CLICKABLE)
   ========================================================= */
document.getElementById("btn-scan-verify").addEventListener("click", async () => {
  const serial = document.getElementById("scan-serial-input").value.trim();
  const location = document.getElementById("scan-location-input").value.trim();

  if (!serial || !location) {
    showToast("Enter serial and location", "error");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serial_number: serial,
        scan_location: location
      })
    });

    const text = await res.text();
    const data = parseJsonSafely(text);
    if (!res.ok) throw new Error(data.error);

    document.getElementById("scan-result-container").innerHTML = `
      <div class="glass-card p-8 rounded-3xl text-center">
        <h2 class="text-2xl font-bold text-emerald-600">${data.status}</h2>
        <p class="font-mono text-xs mt-2 break-all">${data.serial_number}</p>
      </div>
    `;

    document.getElementById("stat-scans").textContent =
      Number(document.getElementById("stat-scans").textContent) + 1;

    showToast("Verification successful");
  } catch (err) {
    showToast(`Verification failed: ${err.message}`, "error");
  }
});

