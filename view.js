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
      "User Assigned": "👤",
      "Category": "🗂️",
      "Brand": "🏷️",
      "Plat No": "🚘",
      "Brand Type": "🔧",
      "Entitas": "🏢",
      "Status": "✅",
      "Location": "📍",
      "Department": "👥",
      "Condition": "🛠️",
      "Condition Remark": "📝",
      "Purchase Date": "🗓️"
    };
    return icons[label] || "•";
  }

  function renderItem(label, value) {
    return `
      <div class="flex items-start gap-3 bg-gray-50 p-3 rounded-md shadow-sm">
        <div class="mt-1 text-xl">${getIcon(label)}</div>
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

      if (!window.Papa) {
        throw new Error("PapaParse belum dimuat.");
      }

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
      console.error(err);
      container.innerHTML = `<p class="text-red-500 text-center">Gagal memuat data: ${err.message}</p>`;
    }
  }

  fetchAsset();


