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
    "User Assigned": `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 15c2.753 0 5.304.835 7.379 2.258M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>`,
    "Category": `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>`,
    "Brand": `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 4v16m8-8H4" /></svg>`,
    "Plat No": `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 10h18M3 14h18M3 6h18M3 18h18"/></svg>`,
    "Brand Type": `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" /><path d="M14 10l-4 4m0-4l4 4" /></svg>`,
    "Entitas": `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a8 8 0 100 16 8 8 0 000-16z"/></svg>`,
    "Status": `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7" /></svg>`,
    "Location": `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5 9 6.343 9 8s1.343 3 3 3z" /><path d="M12 21c-4.97-5-8-8.03-8-11a8 8 0 1116 0c0 2.97-3.03 6-8 11z" /></svg>`,
    "Department": `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor"><path d="M13 7H7v6h6V7z" /></svg>`,
    "Condition": `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12l2 2 4-4" /></svg>`,
    "Condition Remark": `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5z"/></svg>`,
    "Purchase Date": `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M8 7V3m8 4V3M3 11h18M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>`
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
      <h1 class="text-3xl font-bold text-center text-gray-800 mb-6">GA Asset Detail</h1>

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
