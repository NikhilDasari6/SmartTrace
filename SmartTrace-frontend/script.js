/* =========================================================
   SmartTrace Frontend Controller
   Robust JSON handling (raw text first)
   ========================================================= */

const API_BASE = "http://127.0.0.1:3000/api";

/* ---------- Init Icons ---------- */
lucide.createIcons();

/* ---------- Theme Toggle ---------- */
document.getElementById("theme-toggle").onclick = () => {
  document.documentElement.classList.toggle("dark");
};

/* ---------- Toast Utility ---------- */
function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");

  toast.className = `
    toast-enter px-4 py-3 rounded-xl shadow-lg text-sm font-semibold
    ${type === "error"
      ? "bg-rose-600 text-white"
      : "bg-indigo-600 text-white"}
  `;
  toast.textContent = message;

  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

/* ---------- Tab Logic ---------- */
const tabGenerate = document.getElementById("tab-btn-generate");
const tabVerify = document.getElementById("tab-btn-verify");
const viewGenerate = document.getElementById("view-generate");
const viewVerify = document.getElementById("view-verify");

tabGenerate.onclick = () => {
  tabGenerate.classList.add("active");
  tabVerify.classList.remove("active");
  viewGenerate.classList.remove("hidden");
  viewVerify.classList.add("hidden");
};

tabVerify.onclick = () => {
  tabVerify.classList.add("active");
  tabGenerate.classList.remove("active");
  viewVerify.classList.remove("hidden");
  viewGenerate.classList.add("hidden");
};

/* ---------- Safe JSON Parser ---------- */
function parseJsonSafely(text) {
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      "Backend returned non-JSON response:\n" + text
    );
  }
}

/* ---------- Bulk Generation ---------- */
document
  .getElementById("btn-generate-batch")
  .addEventListener("click", async () => {

    const units = parseInt(
      document.getElementById("batch-size-input").value
    );

    if (!units || units <= 0) {
      return showToast("Invalid batch size", "error");
    }

    const btn = document.getElementById("btn-generate-batch");
    btn.disabled = true;
    btn.querySelector("span").textContent = "Processing...";

    try {
      const res = await fetch(`${API_BASE}/bulk/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: 1,
          units
        })
      });

      const rawText = await res.text();
      const data = parseJsonSafely(rawText);

      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      document.getElementById("gen-msg-count").textContent =
        `Generated ${data.units_generated} units`;
      document.getElementById("gen-msg-perf").textContent =
        `Cartons: ${data.cartons_generated}, Pallets: ${data.pallet_generated}`;

      document
        .getElementById("generation-output")
        .classList.remove("hidden");

      document.getElementById("stat-primary").textContent =
        data.units_generated;
      document.getElementById("stat-secondary").textContent =
        data.cartons_generated;
      document.getElementById("stat-tertiary").textContent =
        data.pallet_generated;

      showToast("Batch generated successfully");

    } catch (err) {
      console.error(err);
      showToast(err.message, "error");
    }

    btn.disabled = false;
    btn.querySelector("span").textContent = "Generate";
  });

/* ---------- Verification ---------- */
document
  .getElementById("btn-scan-verify")
  .addEventListener("click", async () => {

    const serial = document
      .getElementById("scan-serial-input")
      .value.trim();
    const location = document
      .getElementById("scan-location-input")
      .value.trim();

    if (!serial || !location) {
      return showToast("Enter serial and location", "error");
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

      const rawText = await res.text();
      const data = parseJsonSafely(rawText);

      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      document.getElementById("scan-result-container").innerHTML = `
        <div class="glass-card p-8 rounded-3xl text-center">
          <h2 class="text-2xl font-bold ${
            data.status === "VALID"
              ? "text-emerald-600"
              : data.status === "SUSPECT"
              ? "text-amber-500"
              : "text-rose-600"
          }">
            ${data.status}
          </h2>
          <p class="mt-2 font-mono text-xs break-all">
            ${data.serial_number}
          </p>
        </div>
      `;

      showToast("Scan completed");

    } catch (err) {
      console.error(err);
      showToast(err.message, "error");
    }
  });

