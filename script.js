const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTI-SPAhj1XTcYOCFPZdkJwocC4Djmm0dsiocUNmQCEK5zsJLNKK7eBVN8Tdms1N0wafsq5bq71oh2A/pub?output=csv';

let fullData = [];
let filteredData = [];
let currentPage = 1;
let rowsPerPage = 10;

Papa.parse(sheetUrl, {
  download: true,
  header: true,
  skipEmptyLines: true,
  complete: results => {
    fullData = results.data.map(row => {
      const { Timestamp, qr_link, qr_code_image, ...rest } = row;
      return rest;
    });
    filteredData = [...fullData];
    renderTable();
  },
  error: err => console.error('Gagal memuat data:', err)
});

function getPaginatedData() {
  const start = (currentPage - 1) * rowsPerPage;
  return filteredData.slice(start, start + rowsPerPage);
}

function renderTable() {
  const table = document.getElementById('assetTable');
  const thead = table.querySelector('thead tr');
  const tbody = table.querySelector('tbody');
  thead.innerHTML = '';
  tbody.innerHTML = '';

  if (filteredData.length === 0) {
    tbody.innerHTML = '<tr><td colspan="100%" class="p-4 text-center text-gray-500">Tidak ada data.</td></tr>';
    return;
  }

  const keys = Object.keys(filteredData[0]);
  const reorderedKeys = ['id', ...keys.filter(k => k !== 'id')];

  // Header
  reorderedKeys.forEach(header => {
    const th = document.createElement('th');
    th.textContent = header;
    th.className = 'px-4 py-3 border-b font-semibold tracking-wide text-xs uppercase bg-gray-100';
    thead.appendChild(th);
  });

  const thAction = document.createElement('th');
  thAction.textContent = 'Aksi';
  thAction.className = 'px-4 py-3 border-b font-semibold tracking-wide text-xs uppercase bg-gray-100';
  thead.appendChild(thAction);

  // Rows
  getPaginatedData().forEach((row, index) => {
    const tr = document.createElement('tr');
    tr.className = index % 2 === 0 ? 'bg-white hover:bg-gray-50 transition' : 'bg-gray-50 hover:bg-gray-100 transition';

    reorderedKeys.forEach(key => {
      const td = document.createElement('td');
      td.textContent = row[key] || '-';
      td.className = 'px-4 py-2 whitespace-nowrap text-gray-700';
      tr.appendChild(td);
    });

    const tdAction = document.createElement('td');
    tdAction.className = 'px-4 py-2 whitespace-nowrap';

    if (row.id && row.id.trim() !== '') {
      tdAction.innerHTML = `
        <a href="view.html?id=${row.id}" title="Lihat Detail"
          class="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm font-medium">
          <i data-lucide="eye" class="w-4 h-4"></i> Lihat
        </a>`;
    } else {
      tdAction.textContent = '-';
    }

    tr.appendChild(tdAction);
    tbody.appendChild(tr);
  });

  if (window.lucide?.createIcons) lucide.createIcons();

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  document.getElementById('pageInfo').textContent = `Halaman ${currentPage} dari ${totalPages}`;
  document.getElementById('prevPage').disabled = currentPage === 1;
  document.getElementById('nextPage').disabled = currentPage === totalPages;
}

// Search
document.getElementById('searchInput').addEventListener('input', function (e) {
  const keyword = e.target.value.toLowerCase();
  filteredData = fullData.filter(row =>
    Object.values(row).some(value =>
      (value || '').toLowerCase().includes(keyword)
    )
  );
  currentPage = 1;
  renderTable();
});

// Pagination controls
document.getElementById('prevPage').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    renderTable();
  }
});

document.getElementById('nextPage').addEventListener('click', () => {
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderTable();
  }
});

document.getElementById('rowsPerPage').addEventListener('change', function () {
  rowsPerPage = parseInt(this.value);
  currentPage = 1;
  renderTable();
});
