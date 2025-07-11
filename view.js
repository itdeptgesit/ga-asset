const urlParams = new URLSearchParams(window.location.search);
const assetId = urlParams.get("id");

const sheetUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTI-SPAhj1XTcYOCFPZdkJwocC4Djmm0dsiocUNmQCEK5zsJLNKK7eBVN8Tdms1N0wafsq5bq71oh2A/pub?output=csv";

function formatDate(dateStr) {
  if (!dateStr) return "-";
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "-";
  }
}

function getIcon(label) {
  const icons = {
    "User Assigned": `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 0115 0" /></svg>`,
    "Category": `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.5 6.75h15M4.5 12h15M4.5 17.25h15" /></svg>`,
    "Brand": `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6v12m6-6H6" /></svg>`,
    "Plat No": `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="6" width="18" height="12" rx="2" ry="2" stroke-width="1.5"/></svg>`,
    "Brand Type": `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="9" stroke-width="1.5"/><path d="M14 10l-4 4m0-4l4 4" stroke-width="1.5"/></svg>`,
    "Entitas": `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" stroke-width="1.5"/></svg>`,
    "Status": `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7" stroke-width="1.5"/></svg>`,
    "Location": `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3S9 6.343 9 8s1.343 3 3 3z" stroke-width="1.5"/><path d="M12 21c-4.97-5-8-8.03-8-11a8 8 0 1116 0c0 2.97-3.03 6-8 11z" stroke-width="1.5"/></svg>`,
    "Department": `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M8 9h8v6H8z" stroke-width="1.5"/></svg>`,
    "Condition": `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7" stroke-width="1.5"/></svg>`,
    "Condition Remark": `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="4" y="6" width="16" height="12" rx="2" ry="2" stroke-width="1.5"/></svg>`,
    "Purchase Date": `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M8 7V3m8 4V3M5 11h14M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke-width="1.5"/></svg>`
  };
  return icons[label] || `<div class="h-5 w-5 text-gray-400">•</div>`;
}

function renderItem(label, value) {
  return `
    <div class="flex items-start gap-3 bg-gray-50 p-3 rounded-md shadow-sm">
      <div class="mt-1">${getIcon(label)}</div>
      <div>
        <p class="text-gray-600 text-xs uppercase font-semibold tracking-wide">${label}</p>
        <p class="text-gray-800 font-medium break-words">${value || "-"}</p>
      </div>
    </div>
  `;
}

async function fetchAsset() {
  const container = document.getElementById("app");

  if (!assetId) {
    container.innerHTML = `<p class="text-center text-red-600 font-semibold">Asset ID tidak ditemukan di URL</p>`;
    return;
  }

  try {
    const res = await fetch(sheetUrl);
    const csv = await res.text();
    const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true });
    const asset = parsed.data.find((a) => a.id?.trim() === assetId.trim());

    if (!asset) {
      container.innerHTML = `<p class="text-center text-red-600 font-semibold">Data aset dengan ID <code>${assetId}</code> tidak ditemukan.</p>`;
      return;
    }

    container.innerHTML = `
      <div class="mb-6 text-center">
        <h1 class="text-3xl font-bold text-gray-800">GA Asset Detail</h1>
      </div>

      <div class="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 space-y-6">
        <div class="text-center space-y-1">
          <p class="text-3xl md:text-4xl font-bold text-gray-900">${asset["Item Name"] || "-"}</p>
          <p class="text-sm text-gray-500 font-mono">NO ID : ${asset["id"] || "-"}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
          ${renderItem("User Assigned", asset["User Assigned"])}
          ${renderItem("Category", asset["Category"])}
          ${renderItem("Brand", asset["Brand"])}
          ${renderItem("Plat No", asset["Plat No"])}
          ${renderItem("Brand Type", asset["Brand Type"])}
          ${renderItem("Entitas", asset["Entitas"])}
          ${renderItem("Status", asset["Status"])}
          ${renderItem("Location", asset["Location"])}
          ${renderItem("Department", asset["Department"])}
          ${renderItem("Condition", asset["Condition"])}
          ${renderItem("Condition Remark", asset["Condition Remark"])}
          ${renderItem("Purchase Date", formatDate(asset["Purchase Date"]))}
        </div>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<p class="text-red-500 text-center">Gagal memuat data: ${err.message}</p>`;
  }
}

fetchAsset();
