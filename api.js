function fakeDelay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// -------------------------------
// GENERATION
// -------------------------------

let generated = 0;
let total = 0;

async function startGeneration() {
  const productCode = document.getElementById("productCode").value;
  const quantity = parseInt(document.getElementById("quantity").value);

  if (!productCode || !quantity) {
    alert("Enter product code and quantity");
    return;
  }

  generated = 0;
  total = quantity;

  const progressText = document.getElementById("progressText");
  const progressPercent = document.getElementById("progressPercent");
  const progressBar = document.getElementById("progressBar");

  progressText.innerText = "Starting...";
  progressPercent.innerText = "0%";
  progressBar.value = 0;

  const interval = setInterval(() => {
    generated += Math.floor(Math.random() * 300) + 200;

    if (generated >= total) {
      generated = total;
      clearInterval(interval);
      progressText.innerText = "✅ Completed";
    } else {
      progressText.innerText = `${generated} / ${total} generated`;
    }

    const percent = Math.floor((generated / total) * 100);
    progressBar.value = percent;
    progressPercent.innerText = percent + "%";
  }, 500);
}

// -------------------------------
// VERIFY
// -------------------------------

async function verify() {
  const serial = document.getElementById("serial").value;
  const verificationCode = document.getElementById("verificationCode").value;
  const location = document.getElementById("location").value;

  if (!serial || !verificationCode || !location) {
    alert("Fill all fields");
    return;
  }

  await fakeDelay(700);

  const random = Math.random();
  let response;

  if (random < 0.6) {
    response = {
      status: "VALID",
      message: "Item is genuine",
      trace: [
        "🏭 Manufactured: 2026-01-10",
        "📦 Packed into Carton: C123",
        "🪵 Packed into Pallet: P987",
        "🚚 Shipped: 2026-01-12",
        "📍 Scanned at: " + location
      ]
    };
  } else if (random < 0.85) {
    response = {
      status: "SUSPECT",
      message: "Already scanned elsewhere",
      trace: [
        "⚠️ Duplicate detected",
        "📍 Last scan: Mumbai",
        "📍 Current scan: " + location
      ]
    };
  } else {
    response = {
      status: "INVALID",
      message: "Code not found in system",
      trace: []
    };
  }

  showResult(response);
}

// -------------------------------
// UI UPDATE
// -------------------------------

function showResult(res) {
  const box = document.getElementById("resultBox");
  const traceBox = document.getElementById("traceBox");

  box.className = "result";

  if (res.status === "VALID") {
    box.classList.add("valid");
    box.innerText = "✅ VALID: " + res.message;
  } else if (res.status === "SUSPECT") {
    box.classList.add("suspect");
    box.innerText = "⚠️ SUSPECT: " + res.message;
  } else {
    box.classList.add("invalid");
    box.innerText = "❌ INVALID: " + res.message;
  }

  traceBox.innerHTML = "";

  if (res.trace && res.trace.length > 0) {
    traceBox.innerHTML = "<h3>🧵 Red Thread (Traceability)</h3>";
    res.trace.forEach(item => {
      const div = document.createElement("div");
      div.className = "timeline-item";
      div.innerText = item;
      traceBox.appendChild(div);
    });
  }
}
