// Stránka Kávy – DataTable nad polem COFFEES (js/data.js) a modal s detailem

const ROAST_BADGES = {
  Filtr: 'badge-filtr',
  Espresso: 'badge-espresso',
  Omni: 'badge-omni',
};

const BREW_TIPS = {
  Filtr: 'V60 nebo Chemex, 15 g kávy na 250 g vody o teplotě 93–95 °C, celkový čas 2:30–3:00.',
  Espresso: 'Espresso 18 g → 36 g nápoje za 27–30 s při 93 °C. Skvěle chutná i s mlékem.',
  Omni: 'Univerzální pražení – zkuste espresso (18 g → 38 g) i filtr (15 g na 250 g vody).',
};

const formatScore = n => n.toLocaleString('cs-CZ', { minimumFractionDigits: 1, maximumFractionDigits: 2 });

const table = new DataTable('#coffeeTable', {
  data: COFFEES,
  responsive: true,
  pageLength: 10,
  lengthMenu: [10, 25, 50, 100],
  order: [[5, 'desc']],
  columns: [
    {
      data: 'nazev',
      responsivePriority: 1,
      render: (data, type, row) => type === 'display'
        ? `<strong>${data}</strong><div class="small text-body-secondary">${row.odruda}</div>`
        : data,
    },
    { data: 'prazirna', responsivePriority: 3 },
    { data: 'zeme', responsivePriority: 4 },
    { data: 'zpracovani', responsivePriority: 6 },
    {
      data: 'prazeni',
      responsivePriority: 5,
      render: (data, type) => type === 'display'
        ? `<span class="badge ${ROAST_BADGES[data]}">${data}</span>`
        : data,
    },
    {
      data: 'sca',
      className: 'text-end',
      responsivePriority: 7,
      render: (data, type) => type === 'display' ? `<span class="sca-score">${formatScore(data)}</span>` : data,
    },
    {
      data: 'cena',
      className: 'text-end text-nowrap',
      responsivePriority: 8,
      render: (data, type) => type === 'display' ? `${data} Kč` : data,
    },
    {
      data: 'id',
      orderable: false,
      searchable: false,
      className: 'text-center',
      responsivePriority: 2,
      render: id => `<button type="button" class="btn btn-sm btn-outline-coffee btn-detail" data-id="${id}" aria-label="Detail kávy"><i class="bi bi-eye"></i></button>`,
    },
  ],
  language: {
    search: 'Hledat:',
    lengthMenu: 'Zobrazit _MENU_ záznamů',
    info: 'Zobrazeno _START_ až _END_ z celkem _TOTAL_ káv',
    infoEmpty: 'Žádné záznamy',
    infoFiltered: '(filtrováno z celkem _MAX_ káv)',
    zeroRecords: 'Nenalezena žádná odpovídající káva',
    emptyTable: 'V tabulce nejsou žádná data',
    paginate: { first: '«', previous: '‹', next: '›', last: '»' },
  },
});

// Filtr podle profilu pražení (přepínací tlačítka)
document.querySelectorAll('input[name="roastFilter"]').forEach(radio => {
  radio.addEventListener('change', () => {
    const value = radio.value;
    table.column(4).search(value ? `^${value}$` : '', true, false).draw();
  });
});

// Filtr podle pražírny z URL, např. kavy.html?prazirna=Doubleshot
const roaster = new URLSearchParams(location.search).get('prazirna');
if (roaster) {
  table.column(1).search(`^${DataTable.util.escapeRegex(roaster)}$`, true, false).draw();
  document.getElementById('roasterFilterName').textContent = roaster;
  document.getElementById('roasterFilterAlert').classList.remove('d-none');
}

// Modal s detailem kávy
const modal = new bootstrap.Modal('#coffeeModal');

document.getElementById('coffeeTable').addEventListener('click', e => {
  const btn = e.target.closest('.btn-detail');
  if (!btn) return;
  const c = COFFEES.find(item => item.id === Number(btn.dataset.id));

  document.getElementById('coffeeModalLabel').textContent = c.nazev;
  document.getElementById('coffeeModalRoaster').innerHTML = `<i class="bi bi-fire me-1"></i>${c.prazirna}`;
  document.getElementById('coffeeModalDesc').textContent = c.popis;
  document.getElementById('coffeeModalNotes').innerHTML = c.tony
    .map(t => `<span class="badge note-badge me-1">${t}</span>`).join('');
  document.getElementById('coffeeModalTable').innerHTML = [
    ['Země původu', c.zeme],
    ['Region', c.region],
    ['Odrůda', c.odruda],
    ['Zpracování', c.zpracovani],
    ['Nadmořská výška', `${c.vyska} m n. m.`],
    ['Pražení', `<span class="badge ${ROAST_BADGES[c.prazeni]}">${c.prazeni}</span>`],
    ['SCA skóre', formatScore(c.sca)],
    ['Cena', `${c.cena} Kč / 250 g`],
  ].map(([k, v]) => `<tr><th scope="row" class="w-50">${k}</th><td>${v}</td></tr>`).join('');
  document.getElementById('coffeeModalBrew').textContent = BREW_TIPS[c.prazeni];

  modal.show();
});
