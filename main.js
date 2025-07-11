const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTI-SPAhj1XTcYOCFPZdkJwocC4Djmm0dsiocUNmQCEK5zsJLNKK7eBVN8Tdms1N0wafsq5bq71oh2A/pub?output=csv';

fetch(sheetUrl)
  .then(res => res.text())
  .then(text => {
    const rows = text.trim().split('\n').map(r => r.split(','));
    const headers = rows[0].map(h => h.trim());
    const data = rows.slice(1);

    const table = document.querySelector('#assetTable');
    table.innerHTML = ''; // Kosongkan isi sebelumnya

    // Buat Header Tabel
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    headers.forEach(h => {
      const th = document.createElement('th');
      th.textContent = h;
      th.className = 'px-3 py-2 border bg-gray-100 text-left text-sm font-semibold';
      headerRow.appendChild(th);
    });

    // Tambah kolom aksi
    const thAction = document.createElement('th');
    thAction.textContent = 'Aksi';
    thAction.className = 'px-3 py-2 border bg-gray-100 text-sm font-semibold';
    headerRow.appendChild(thAction);

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Buat Body Tabel
    const tbody = document.createElement('tbody');

    data.forEach(row => {
      if (row.length < headers.length) return; // skip incomplete rows

      const obj = Object.fromEntries(row.map((v, i) => [headers[i], v.trim()]));
      const tr = document.createElement('tr');

      headers.forEach(h => {
        const td = document.createElement('td');
        td.textContent = obj[h] || "";
        td.className = 'px-3 py-2 border text-sm';
        tr.appendChild(td);
      });

      // Tambah kolom aksi
      const tdAction = document.createElement('td');
      tdAction.className = 'px-3 py-2 border text-sm';

      if (obj.id && obj.id.trim() !== "") {
        const link = document.createElement('a');
        link.href = `view.html?id=${obj.id}`;
        link.textContent = '🔍 Lihat';
        link.className = 'text-blue-600 underline hover:text-blue-800';
        tdAction.appendChild(link);
      } else {
        tdAction.textContent = '-';
      }

      tr.appendChild(tdAction);
      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
  })
  .catch(err => {
    console.error('Gagal mengambil data:', err);
    const table = document.querySelector('#assetTable');
    table.innerHTML = '<tr><td colspan="100%" class="text-red-500">Gagal memuat data</td></tr>';
  });
