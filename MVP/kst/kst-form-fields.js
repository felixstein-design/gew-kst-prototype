var KST_REVIEW_WARNING_TEXT =
  'Es wurden Hinzurechnungen nach § 8 KStG erfasst. Bitte prüfen Sie die Vollständigkeit und korrekte Zuordnung der Beträge.';

var STAMMDATEN_SECTION_IDS = ['allgemein', 'unternehmen'];

var KST_FORM_SECTIONS = [
  {
    id: 'allgemein',
    title: 'Allgemeine Angaben',
    showIn: ['edit'],
    stammdaten: true,
    rows: [
      { line: 1, label: 'An das Finanzamt', value: 'Berlin Mitte', kind: 'text', manual: true },
      { line: 2, label: 'Steuernummer', value: '27 123 45678', kind: 'text', manual: true },
      { line: 3, label: 'Unternehmen/Firma', value: 'Hausmann & Partner GmbH', kind: 'text', manual: true },
      { line: 4, label: 'Wirtschafts-Identifikationsnummer', value: 'DE123456789', kind: 'text', manual: true },
      {
        line: 5,
        label: 'Rechtsform',
        kind: 'dropdown',
        value: 'GmbH',
        options: ['GmbH', 'AG', 'UG', 'Genossenschaft'],
        disabled: true
      }
    ]
  },
  {
    id: 'unternehmen',
    title: 'Angaben zum Unternehmen',
    showIn: ['edit'],
    stammdaten: true,
    rows: [
      { line: 10, label: 'Geschäftsjahr', value: '2025', kind: 'text', manual: true },
      { line: 11, label: 'Stichtag', value: '31.12.2025', kind: 'text', manual: true, disabled: true }
    ]
  },
  {
    id: 'ausgang',
    title: 'I. §7 KStG — Ausgangsgröße',
    rows: [
      {
        line: 1,
        label: 'Jahresüberschuss/Jahresfehlbetrag',
        value: '2.856,97',
        kind: 'amount',
        autofill: true,
        sidePanel: true,
        cellId: 'cellJahresueberschuss'
      }
    ]
  },
  {
    id: 'hinzurechnungen',
    title: 'II. §8 KStG — Hinzurechnungen',
    rows: [
      { line: 2, label: 'KSt/Soli-Aufwand (§10 Nr. 2 KStG)', value: '0,00', kind: 'amount', autofill: true },
      { line: 3, label: 'Gewerbesteuer (§4 Abs. 5b EStG)', value: '0,00', kind: 'amount', autofill: true },
      { line: 4, label: 'Nicht abziehbare Geschenke', value: '0,00', kind: 'amount', autofill: true },
      { line: 5, label: 'Nicht abzugsfähige Strafen/Verspätungszuschläge', value: '0,00', kind: 'amount', autofill: true },
      {
        line: 6,
        label: 'Nicht abzugsfähige Bewirtungskosten',
        value: '0,00',
        kind: 'amount',
        manual: true,
        reviewWarning: true
      },
      { line: 7, label: 'Nicht abzugsfähige Werbe-/Repräsentationskosten', value: '0,00', kind: 'amount', autofill: true },
      {
        line: 8,
        label: 'Sonstige nicht abziehbare Aufwendungen',
        value: '0,00',
        kind: 'amount',
        manual: true,
        reviewWarning: true
      },
      { line: 9, label: '50% nicht abziehbare Aufsichtsratsvergütung', value: '0,00', kind: 'amount', autofill: true },
      { line: 10, label: 'Steuernebenkosten n.a. (§4 Abs. 5b)', value: '0,00', kind: 'amount', autofill: true },
      {
        line: 11,
        label: 'Verdeckte Gewinnausschüttung',
        value: '0,00',
        kind: 'amount',
        manual: true,
        reviewWarning: true
      },
      { line: 12, label: 'Teilwertabschreibungen §8b Abs. 3 S. 1', value: '0,00', kind: 'amount', autofill: true },
      { line: 13, label: 'Veräußerungsverluste §8b Abs. 3 S. 2', value: '0,00', kind: 'amount', autofill: true },
      { line: 14, label: 'Veräußerungskosten Beteiligungen', value: '0,00', kind: 'amount', autofill: true }
    ]
  },
  {
    id: 'kuerzungen',
    title: 'III. §8b KStG — Kürzungen',
    rows: [
      { line: 15, label: 'Dividenden aus Kapitalgesellschaften (brutto)', value: '0,00', kind: 'amount', autofill: true },
      { line: 16, label: '95% steuerfreie Dividenden (§8b Abs. 1/5)', value: '0,00', kind: 'amount', autofill: true },
      { line: 17, label: 'Veräußerungsgewinne Beteiligungen (brutto)', value: '0,00', kind: 'amount', autofill: true },
      { line: 18, label: '95% steuerfreie Veräußerungsgewinne (§8b Abs. 2/3)', value: '0,00', kind: 'amount', autofill: true },
      { line: 19, label: 'Erträge aus Personengesellschaften', value: '0,00', kind: 'amount', autofill: true },
      { line: 20, label: 'Steuerfreie Investitionszulagen', value: '0,00', kind: 'amount', autofill: true }
    ]
  },
  {
    id: 'summary',
    title: 'Steuerliches Ergebnis',
    rows: [
      {
        line: 21,
        label: 'Steuerliches Ergebnis (I + II − III)',
        value: '2.856,97',
        kind: 'amount',
        autofill: true
      }
    ]
  }
];

function getKstFormSectionsForMode(mode) {
  return KST_FORM_SECTIONS.filter(function(section) {
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

function renderKstFormValueCell(row, mode, options) {
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
      var textDisabled = row.disabled ? ' disabled' : '';
      return (
        '<input type="text" class="taxform-manual-input taxform-manual-input--text" value="' +
        escapeHtml(row.value) +
        '" aria-label="' +
        escapeHtml(row.label) +
        '"' +
        textDisabled +
        '>'
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
        escapeHtml(KST_REVIEW_WARNING_TEXT) +
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

function renderKstFormDataRow(row, mode, options) {
  options = options || {};
  var showWarnings = mode === 'review' || options.consistencyActive;
  var valueCell = renderKstFormValueCell(row, mode, options);
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

function countKstReviewWarnings(mode, consistencyActive) {
  var count = 0;
  var showWarnings = mode === 'review' || consistencyActive;
  if (!showWarnings) return 0;
  KST_FORM_SECTIONS.forEach(function(section) {
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
  KST_FORM_SECTIONS.forEach(function(section) {
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
        return renderKstFormDataRow(row, mode, options).replace(
          'class="taxform-row',
          'class="taxform-row' + extraClass
        );
      })
      .join('');
  });
  return html;
}

function renderKstFormSheetBody(mode, options) {
  options = options || {};
  var html = '';
  var sections = getKstFormSectionsForMode(mode);
  var stammdatenInEdit = mode === 'edit' && sections.some(function(s) { return s.stammdaten; });

  if (stammdatenInEdit) {
    html +=
      '<tr class="taxform-foldout-head">' +
      '<td colspan="4">' +
      '<button type="button" class="taxform-foldout-toggle" id="stammdatenToggle" aria-expanded="false" onclick="toggleStammdatenFoldout()">' +
      '<span class="ms taxform-foldout-icon" id="stammdatenToggleIcon">chevron_right</span>' +
      '<span>Stammdaten</span>' +
      '<span class="taxform-foldout-hint">Allgemeine Angaben · Unternehmen</span>' +
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
        return renderKstFormDataRow(row, mode, options);
      })
      .join('');
  });

  return html;
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

function renderKstDeclarationForm(container, options) {
  if (!container) return;
  options = options || {};
  var mode = options.mode || 'edit';
  var consistencyActive = !!options.consistencyActive;
  var reviewCount = countKstReviewWarnings(mode, consistencyActive);
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
    '<h2 class="taxform-period">Geschäftsjahr 2025</h2>' +
    '<span class="taxform-form-id">KSt 1 A · Körperschaftsteuererklärung</span>' +
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
    renderKstFormSheetBody(mode, options) +
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

function triggerKstConsistencyCheck() {
  var mount = document.getElementById('kstFormMount');
  if (!mount) return;
  renderKstDeclarationForm(mount, { mode: 'edit', consistencyActive: true });
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

function initKstFormPage() {
  var mount = document.getElementById('kstFormMount');
  if (!mount) return;

  var mode = document.body.dataset.kstFormMode || 'edit';
  renderKstDeclarationForm(mount, { mode: mode });
}

function updateTaxformModifiedBadge() {
  var badge = document.getElementById('taxformModifiedBadge');
  if (!badge) return;
  var count = document.querySelectorAll('.taxform-cell.cell-overridden').length;
  badge.textContent = count + ' Zelle' + (count === 1 ? '' : 'n') + ' geändert';
  badge.style.display = count > 0 ? '' : 'none';
}
