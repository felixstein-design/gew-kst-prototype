var GEWST_REVIEW_WARNING_TEXT =
  'Es wurden Hinzurechnungen nach § 8 GewStG erfasst. Bitte prüfen Sie, ob der Freibetrag von 200.000 EUR (§ 8 Nr. 1 GewStG) korrekt berücksichtigt wurde.';

var STAMMDATEN_SECTION_IDS = ['allgemein', 'betrieb'];

/** Demo: GewSt-Vorauszahlungen (SKR 7610) — credited in Step 2 only; 7641 is not deducted here. */
var GEWST_VORAUSZAHLUNGEN_7610 = 5040;

var GEWST_BERECHNUNG_ROWS = [
  { label: 'Gewerbeertrag', value: '53 714,47', autofill: true },
  { label: 'Gewerbeertrag (abgerundet auf 100 €)', value: '53 700,00', autofill: true },
  { label: 'Freibetrag (§ 11 GewStG) — GmbH: 0 €', value: '0,00', autofill: true },
  { label: 'Hinzurechnungen nach Freibetrag 200.000 € (25 %)', value: '3 799,11', autofill: true },
  { label: 'Steuermessbetrag (3,5 %)', value: '1 879,50', autofill: true },
  { label: 'Hebesatz der Gemeinde (%)', value: '0,00', manual: true, inputId: 'hebesatzInput' },
  {
    label: 'Festzusetzende Gewerbesteuer',
    value: '0,00',
    autofill: true,
    subtotal: true,
    valueId: 'gewerbesteuerValue'
  }
];

var GEWST_PREPAYMENT_ROWS = [
  {
    label: 'Vorauszahlungen — Konto 7610 (§ 20 GewStG)',
    value: '5 040,00',
    autofill: true,
    deduction: true,
    valueId: 'vorauszahlungen7610Value'
  },
  {
    label: 'Verbleibende GewSt-Rückstellung',
    value: '0,00',
    autofill: true,
    total: true,
    valueId: 'gewstRueckstellungValue'
  }
];

var GEWST_BERECHNUNG_TAIL_ROWS = [
  { label: 'Verbleibender Verlust für Folgejahre', value: '0,00', autofill: true }
];

var GEWST_FORM_SECTIONS = [
  {
    id: 'allgemein',
    title: 'Allgemeine Angaben',
    page: 1,
    showIn: ['edit'],
    stammdaten: true,
    rows: [
      { line: 1, label: 'An das Finanzamt', value: 'Berlin Mitte', kind: 'text', manual: true },
      { line: 2, label: 'Steuernummer', value: '27 123 45678', kind: 'text', manual: true },
      { line: 3, label: 'Unternehmen/Firma', value: 'Hausmann & Partner GmbH', kind: 'text', manual: true },
      { line: 4, label: 'Gegenstand des Unternehmens', value: 'IT-Dienstleistungen', kind: 'text', manual: true },
      { line: 5, label: 'Wirtschafts-Identifikationsnummer', code: '39', value: 'DE123456789', kind: 'text', manual: true },
      { line: 10, label: 'Der Gewerbebetrieb wird als Einzelunternehmen betrieben.', kind: 'checkbox', checked: false },
      {
        line: 14,
        label: 'Rechtsform des Unternehmens',
        code: '37',
        kind: 'dropdown',
        value: 'GmbH',
        options: ['GmbH', 'UG', 'GmbH & Co. KG', 'Einzelunternehmen', 'GbR'],
        disabled: true
      }
    ]
  },
  {
    id: 'betrieb',
    title: 'Angaben zum Gewerbebetrieb',
    page: 2,
    showIn: ['edit'],
    stammdaten: true,
    rows: [
      { line: 26, label: 'Betriebsstätten bestanden im Kalenderjahr 2024 in mehreren Gemeinden.', kind: 'yesno', value: '2' },
      { line: 30, label: 'Postleitzahl der einzigen Betriebsstätte', value: '10115', kind: 'text', manual: true },
      { line: 31, label: 'Gemeinde / Ort der einzigen Betriebsstätte', value: 'Berlin', kind: 'text', manual: true },
      { line: 33, label: 'Hebenummer (Steuernummer) der Gemeinde', value: '27 123 45678', kind: 'text', manual: true }
    ]
  },
  {
    id: 'gewinn',
    title: 'Gewinn aus Gewerbebetrieb',
    page: 2,
    rows: [
      {
        line: 39,
        label: 'Gewinn aus Gewerbebetrieb vor Anwendung des § 7 Satz 4 GewStG',
        code: '10',
        value: '54.612,36',
        kind: 'amount',
        autofill: true
      }
    ]
  },
  {
    id: 'hinzurechnungen',
    title: 'Hinzurechnungen — Finanzierungsanteile nach § 8 Nr. 1 GewStG',
    page: 3,
    subtitle: 'Des (ersten) Wirtschaftsjahres',
    rows: [
      {
        line: 50,
        label: 'Entgelte für Schulden — Zinsen (§ 8 Nr. 1 Buchstabe a GewStG)',
        code: '31',
        value: '161,10',
        kind: 'amount',
        manual: true,
        sidePanel: true,
        cellId: 'cellEntgelte',
        reviewWarning: true
      },
      {
        line: 51,
        label: 'Renten und dauernde Lasten (§ 8 Nr. 1 Buchstabe b GewStG)',
        code: '32',
        value: '0,00',
        kind: 'amount',
        manual: true
      },
      {
        line: 53,
        label: 'Miet-/Leasingraten bewegliche Güter (§ 8 Nr. 1 Buchstabe d GewStG)',
        code: '34',
        value: '6.596,52',
        kind: 'amount',
        manual: true,
        reviewWarning: true
      },
      {
        line: 55,
        label: 'Miet-/Leasingraten unbewegliche Güter / Immobilien (§ 8 Nr. 1 Buchstabe e GewStG)',
        code: '35',
        value: '23.115,97',
        kind: 'amount',
        manual: true,
        reviewWarning: true
      },
      {
        line: 56,
        label: 'Lizenzen / Konzessionen (§ 8 Nr. 1 Buchstabe f GewStG)',
        code: '36',
        value: '8.632,23',
        kind: 'amount',
        manual: true,
        reviewWarning: true
      },
      {
        line: 57,
        label: 'Im Betrag laut Zeile 56 enthaltene Vergütungen i. S. d. § 50a Abs. 1 Nr. 3 EStG',
        code: '37',
        value: '0,00',
        kind: 'amount',
        manual: true
      }
    ]
  },
  {
    id: 'hinzurechnungen-weitere',
    title: 'Weitere Hinzurechnungen',
    page: 4,
    rows: [
      {
        line: 69,
        label: 'Ausländische Steuern auf Gewinne/Anteile (§ 8 Nr. 12 GewStG)',
        code: '22',
        value: '0,00',
        kind: 'amount',
        manual: true
      },
      {
        line: 77,
        label: 'Hinzurechnungsbetrag nach § 8 Nr. 5 GewStG (Körperschaften)',
        code: '26',
        value: '0,00',
        kind: 'amount',
        manual: true
      }
    ]
  },
  {
    id: 'kuerzungen',
    title: 'Kürzungen nach § 9 GewStG',
    page: 5,
    rows: [
      {
        line: 83,
        label: 'Einheitswert des Grundbesitzes (Stichtag 01.01.)',
        value: '0,00',
        kind: 'amount',
        manual: true
      },
      {
        line: 86,
        label: 'Maßgebender Einheitswert → Kürzung 1,2 % (§ 9 Nr. 1 GewStG)',
        code: '051',
        value: '0,00',
        kind: 'amount',
        manual: true
      },
      {
        line: 89,
        label: 'Anteil am Gewinn der Personengesellschaft',
        kind: 'text',
        value: '',
        na: true
      },
      {
        line: '89d',
        label: 'Summe der Anteile am Gewinn von Personengesellschaften (§ 9 Nr. 2 GewStG)',
        code: '031',
        value: '7.987,00',
        kind: 'amount',
        manual: true
      },
      {
        line: 92,
        label: 'Zuwendungen zur Förderung steuerbegünstigter Zwecke (§ 9 Nr. 5 GewStG)',
        code: '071',
        value: '0,00',
        kind: 'amount',
        manual: true
      }
    ]
  },
  {
    id: 'verlust',
    title: 'Verlustabzug',
    page: 7,
    rows: [
      {
        line: 134,
        label: 'Verlustabzug aus vorangegangenen Erhebungszeiträumen',
        code: '044',
        value: '0,00',
        kind: 'amount',
        manual: true
      }
    ]
  },
  {
    id: 'schluss',
    title: 'Schlusserklärung',
    page: 9,
    showIn: [],
    rows: [
      { line: 200, label: 'Mitwirkung eines Steuerberaters bei der Anfertigung', kind: 'yesno', value: '1' },
      { line: 201, label: 'Name (Steuerberater)', value: 'Müller', kind: 'text', manual: true },
      { line: 202, label: 'Vorname', value: 'Anna', kind: 'text', manual: true },
      { line: 209, label: 'Ort / Datum', value: 'Berlin · 15.05.2025', kind: 'text', manual: true }
    ]
  }
];

function getGewstFormSectionsForMode(mode) {
  return GEWST_FORM_SECTIONS.filter(function(section) {
    var showIn = section.showIn || ['edit', 'review'];
    return showIn.indexOf(mode) !== -1;
  });
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderGewstFormValueCell(row, mode, options) {
  options = options || {};
  if (row.na) return '';

  if (row.kind === 'dropdown') {
    var options = (row.options || [])
      .map(function(option) {
        var selected = option === row.value ? ' selected' : '';
        return (
          '<option value="' + escapeHtml(option) + '"' + selected + '>' + escapeHtml(option) + '</option>'
        );
      })
      .join('');
    var disabled = row.disabled ? ' disabled' : '';
    return (
      '<select class="taxform-select"' +
      disabled +
      ' aria-label="' +
      escapeHtml(row.label) +
      '">' +
      options +
      '</select>'
    );
  }

  if (row.kind === 'checkbox') {
    return '<span class="taxform-field-text">' + (row.checked ? '1 = Ja' : '—') + '</span>';
  }

  if (row.kind === 'yesno') {
    return '<span class="taxform-field-text">' + escapeHtml(row.value || '—') + '</span>';
  }

  if (row.kind === 'text') {
    if (row.manual && mode === 'edit') {
      return (
        '<input type="text" class="taxform-manual-input taxform-manual-input--text" value="' +
        escapeHtml(row.value) +
        '" aria-label="' +
        escapeHtml(row.label) +
        '">'
      );
    }
    return '<span class="taxform-field-text">' + escapeHtml(row.value || '') + '</span>';
  }

  var classes = ['taxform-cell'];
  if (row.autofill) classes.push('cell-autofill');
  if (row.sidePanel) classes.push('gewst-row-open');

  var showWarnings = mode === 'review' || options.consistencyActive;
  var reviewWarning =
    showWarnings && row.reviewWarning
      ? '<span class="cell-review-warning" tabindex="0" aria-label="Prüfhinweis">' +
        '<span class="ms filled">report</span>' +
        '<span class="review-warning-tooltip" role="tooltip"><p>' +
        escapeHtml(GEWST_REVIEW_WARNING_TEXT) +
        '</p></span></span>'
      : '';

  var overrideIcon =
    '<span class="cell-override-icon" aria-label="Manuell geändert"><span class="ms">edit_note</span></span>';

  var openBtn = row.sidePanel
    ? '<button type="button" class="cell-open-btn" onclick="openSidePanel(this)">Details</button>'
    : '';

  var showOverrideIcon =
    (row.autofill && !row.manual) || (row.manual && row.kind === 'amount');

  var editable;
  if (row.manual && mode === 'edit' && row.kind === 'amount') {
    editable =
      '<input type="text" class="taxform-manual-input" value="' +
      escapeHtml(row.value) +
      '" data-original-value="' +
      escapeHtml(row.value) +
      '" aria-label="' +
      escapeHtml(row.label) +
      '" onblur="markManualAmountEdited(this)">';
  } else if (row.autofill && row.sidePanel && mode === 'edit') {
    editable =
      '<span contenteditable="true" data-autofill-value="' +
      escapeHtml(row.value) +
      '" onblur="markCellEdited(this)">' +
      escapeHtml(row.value) +
      '</span>';
  } else {
    editable = '<span class="taxform-field-amount">' + escapeHtml(row.value) + '</span>';
  }

  return (
    '<div class="' +
    classes.join(' ') +
    '"' +
    (row.cellId ? ' id="' + row.cellId + '"' : '') +
    '>' +
    '<span class="cell-value-group">' +
    reviewWarning +
    (showOverrideIcon ? overrideIcon : '') +
    openBtn +
    editable +
    '</span></div>'
  );
}

function renderGewstFormDataRow(row, mode, options) {
  options = options || {};
  var showWarnings = mode === 'review' || options.consistencyActive;
  var valueCell = renderGewstFormValueCell(row, mode, options);
  var valueClasses = 'taxform-value';
  if (row.na) {
    valueClasses += ' taxform-value--na';
  } else if (row.kind === 'dropdown' || row.kind === 'text' || row.kind === 'amount' || row.kind === 'yesno' || row.kind === 'checkbox') {
    valueClasses += ' taxform-value--input';
  }

  return (
    '<tr class="taxform-row' +
    (showWarnings && row.reviewWarning ? ' taxform-row--review-target' : '') +
    '" data-line="' +
    row.line +
    '">' +
    '<td class="taxform-col-z">' +
    row.line +
    '</td>' +
    '<td class="taxform-col-desc">' +
    escapeHtml(row.label) +
    '</td>' +
    '<td class="taxform-col-kz">' +
    (row.code ? escapeHtml(row.code) : '') +
    '</td>' +
    '<td class="' +
    valueClasses +
    '">' +
    valueCell +
    '</td></tr>'
  );
}

function countGewstReviewWarnings(mode, consistencyActive) {
  var count = 0;
  var showWarnings = mode === 'review' || consistencyActive;
  if (!showWarnings) return 0;
  GEWST_FORM_SECTIONS.forEach(function(section) {
    var showIn = section.showIn || ['edit', 'review'];
    if (showIn.indexOf(mode) === -1) return;
    section.rows.forEach(function(row) {
      if (row.reviewWarning) count += 1;
    });
  });
  return count;
}

function renderStammdatenFoldoutRows(mode, rowClass, options) {
  options = options || {};
  var html = '';
  var extraClass = rowClass ? ' ' + rowClass : '';
  GEWST_FORM_SECTIONS.forEach(function(section) {
    if (!section.stammdaten) return;
    html +=
      '<tr class="taxform-group-head taxform-group-head--nested' +
      extraClass +
      '"><td colspan="4">' +
      escapeHtml(section.title) +
      '</td></tr>';
    if (section.subtitle) {
      html +=
        '<tr class="taxform-group-sub' +
        extraClass +
        '"><td colspan="4">' +
        escapeHtml(section.subtitle) +
        '</td></tr>';
    }
    html += section.rows
      .map(function(row) {
        return renderGewstFormDataRow(row, mode, options).replace(
          'class="taxform-row',
          'class="taxform-row' + extraClass
        );
      })
      .join('');
  });
  return html;
}

function renderGewstFormSheetBody(mode, options) {
  options = options || {};
  var html = '';
  var sections = getGewstFormSectionsForMode(mode);
  var stammdatenInEdit = mode === 'edit' && sections.some(function(s) { return s.stammdaten; });

  if (stammdatenInEdit) {
    html +=
      '<tr class="taxform-foldout-head">' +
      '<td colspan="4">' +
      '<button type="button" class="taxform-foldout-toggle" id="stammdatenToggle" aria-expanded="false" onclick="toggleStammdatenFoldout()">' +
      '<span class="ms taxform-foldout-icon" id="stammdatenToggleIcon">chevron_right</span>' +
      '<span>Stammdaten</span>' +
      '<span class="taxform-foldout-hint">Allgemeine Angaben · Betriebsstätte</span>' +
      '</button></td></tr>';
    html += renderStammdatenFoldoutRows(mode, 'taxform-foldout-row hidden', options);
    html +=
      '<tr class="taxform-foldout-separator hidden" id="stammdatenSeparator" aria-hidden="true">' +
      '<td colspan="4"></td></tr>';
  }

  sections.forEach(function(section) {
    if (section.stammdaten) return;

    html +=
      '<tr class="taxform-group-head" id="section-' +
      section.id +
      '"><td colspan="4">' +
      escapeHtml(section.title) +
      '</td></tr>';

    if (section.subtitle) {
      html +=
        '<tr class="taxform-group-sub"><td colspan="4">' +
        escapeHtml(section.subtitle) +
        '</td></tr>';
    }

    html += section.rows
      .map(function(row) {
        return renderGewstFormDataRow(row, mode, options);
      })
      .join('');
  });

  return html;
}

function renderBerechnungRowHtml(row) {
  var valueHtml;
  if (row.manual) {
    valueHtml =
      '<input type="text" class="taxform-manual-input" id="' +
      row.inputId +
      '" value="' +
      escapeHtml(row.value) +
      '" aria-label="' +
      escapeHtml(row.label) +
      '">';
  } else {
    var idAttr = row.valueId ? ' id="' + row.valueId + '"' : '';
    var inner = row.total
      ? '<strong><span class="taxform-field-amount"' + idAttr + '>' + escapeHtml(row.value) + '</span></strong>'
      : '<span class="taxform-field-amount"' + idAttr + '>' + escapeHtml(row.value) + '</span>';
    valueHtml = inner;
  }
  var cellClass = row.autofill ? 'taxform-cell cell-autofill' : 'taxform-cell';
  var rowClasses = ['taxform-row'];
  if (row.total) rowClasses.push('taxform-row--total');
  if (row.subtotal) rowClasses.push('taxform-row--subtotal');
  if (row.deduction) rowClasses.push('taxform-row--deduction');
  return (
    '<tr class="' +
    rowClasses.join(' ') +
    '">' +
    '<td class="taxform-col-desc">' +
    (row.total ? '<strong>' + escapeHtml(row.label) + '</strong>' : escapeHtml(row.label)) +
    '</td>' +
    '<td class="taxform-value taxform-value--input">' +
    '<div class="' +
    cellClass +
    '">' +
    '<span class="taxform-field-amount">' +
    valueHtml +
    '</span></div></td></tr>'
  );
}

function renderBerechnungBlockHtml() {
  var rows = GEWST_BERECHNUNG_ROWS.map(renderBerechnungRowHtml).join('');
  var prepaymentRows = GEWST_PREPAYMENT_ROWS.map(renderBerechnungRowHtml).join('');

  return (
    '<div class="taxform-berechnung-block">' +
    '<table class="taxform-sheet taxform-sheet--simple">' +
    '<thead><tr><th class="taxform-col-desc"></th><th class="taxform-col-amount">Betrag in EUR</th></tr></thead>' +
    '<tbody><tr class="taxform-group-head"><td colspan="2">Berechnung der Gewerbesteuer</td></tr>' +
    rows +
    '<tr class="taxform-group-head taxform-group-head--prepayment"><td colspan="2">Vorauszahlungen / Rückstellung</td></tr>' +
    '<tr class="taxform-row taxform-row--hint"><td colspan="2" class="taxform-berechnung-hint">' +
    'Nur Konto 7610 (Vorauszahlungen) wird angerechnet. Nachzahlungen Vorjahr (7641) werden nicht abgezogen.' +
    '</td></tr>' +
    prepaymentRows +
    GEWST_BERECHNUNG_TAIL_ROWS.map(renderBerechnungRowHtml).join('') +
    '</tbody></table></div>'
  );
}

function toggleStammdatenFoldout() {
  var rows = document.querySelectorAll('.taxform-foldout-row');
  var toggle = document.getElementById('stammdatenToggle');
  var icon = document.getElementById('stammdatenToggleIcon');
  if (!rows.length || !toggle) return;
  var willOpen = rows[0].classList.contains('hidden');
  rows.forEach(function(row) {
    row.classList.toggle('hidden', !willOpen);
  });
  var separator = document.getElementById('stammdatenSeparator');
  if (separator) separator.classList.toggle('hidden', !willOpen);
  var sheet = document.querySelector('.taxform-sheet');
  if (sheet) sheet.classList.toggle('taxform-foldout-is-open', willOpen);
  toggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
  if (icon) icon.textContent = willOpen ? 'expand_more' : 'chevron_right';
}

function renderGewstDeclarationForm(container, options) {
  if (!container) return;
  options = options || {};
  var mode = options.mode || 'edit';
  var consistencyActive = !!options.consistencyActive;
  var reviewCount = countGewstReviewWarnings(mode, consistencyActive);
  var showControls = mode === 'review' || consistencyActive;

  var controlsHtml = showControls
    ? '<div class="taxform-controls" id="taxformControls">' +
      '<span class="taxform-controls-label">Konsistenzprüfung</span>' +
      '<span class="taxform-badge taxform-badge--warning">' +
      reviewCount +
      ' Hinweis' +
      (reviewCount === 1 ? '' : 'e') +
      '</span></div>'
    : '';

  var headerHtml =
    '<div class="taxform-sheet-header">' +
    '<div class="taxform-sheet-header-main">' +
    '<h2 class="taxform-period">Erhebungsjahr 2025</h2>' +
    '<span class="taxform-form-id">GewSt 1 A · Gewerbesteuererklärung</span>' +
    '</div>' +
    '<span class="taxform-saved"><span class="ms">cloud_done</span> Gespeichert</span>' +
    '</div>';

  var sheetHtml =
    '<div class="taxform-sheet-wrap">' +
    '<table class="taxform-sheet">' +
    '<thead><tr>' +
    '<th class="taxform-col-z">Z</th>' +
    '<th class="taxform-col-desc"></th>' +
    '<th class="taxform-col-kz">KZ</th>' +
    '<th class="taxform-col-amount">Betrag in EUR</th>' +
    '</tr></thead><tbody>' +
    renderGewstFormSheetBody(mode, options) +
    '</tbody></table></div>';

  container.className =
    'taxform-container taxform-container--' +
    mode +
    (consistencyActive ? ' taxform-container--consistency-active' : '');
  container.innerHTML = controlsHtml + headerHtml + sheetHtml;

  if (mode === 'review' || consistencyActive) {
    container.setAttribute('data-review-mode', 'true');
  } else {
    container.removeAttribute('data-review-mode');
  }
}

function triggerConsistencyCheck() {
  var mount = document.getElementById('gewstFormMount');
  if (!mount) return;
  renderGewstDeclarationForm(mount, { mode: 'edit', consistencyActive: true });
  var btn = document.getElementById('consistencyCheckBtn');
  if (btn) btn.classList.add('hidden');
  var firstWarning = mount.querySelector('.cell-review-warning');
  if (firstWarning) {
    firstWarning.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function markManualAmountEdited(input) {
  var cell = input.closest('.taxform-cell');
  if (!cell || !input) return;

  var original = input.getAttribute('data-original-value');
  if (original == null) {
    original = input.defaultValue || input.value || '';
    input.setAttribute('data-original-value', original);
  }

  var current = normalizeEditableAmount(input.value || '');
  var origNorm = normalizeEditableAmount(original);
  cell.classList.toggle('cell-overridden', current !== '' && current !== origNorm);

  var panel = document.getElementById('sidePanel');
  if (panel && panel.classList.contains('open')) {
    updateSidePanelSyncState(cell);
  }
  if (typeof updateTaxformModifiedBadge === 'function') {
    updateTaxformModifiedBadge();
  }
}

function initGewstFormPage() {
  var mount = document.getElementById('gewstFormMount');
  if (!mount) return;

  var mode = document.body.dataset.gewstFormMode || 'edit';
  renderGewstDeclarationForm(mount, { mode: mode });
}

function updateTaxformModifiedBadge() {
  var badge = document.getElementById('taxformModifiedBadge');
  if (!badge) return;
  var count = document.querySelectorAll('.taxform-cell.cell-overridden').length;
  badge.textContent = count + ' Zelle' + (count === 1 ? '' : 'n') + ' geändert';
  badge.style.display = count > 0 ? '' : 'none';
}
