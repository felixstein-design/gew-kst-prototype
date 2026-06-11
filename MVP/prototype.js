(function initFigmaCaptureIfRequested() {
  if (!location.hash || location.hash.indexOf('figmacapture=') === -1) return;
  var s = document.createElement('script');
  s.src = 'https://mcp.figma.com/mcp/html-to-design/capture.js';
  s.async = true;
  document.head.appendChild(s);
})();

function openModal(id) {
  document.getElementById(id).classList.remove('hidden');
}
function closeModal(id) {
  document.getElementById(id).classList.add('hidden');
}
function openSidePanel(trigger) {
  var panelId = 'sidePanel';
  if (typeof trigger === 'string') {
    panelId = trigger;
  } else if (trigger && trigger.id) {
    panelId = trigger.id;
  }

  var panel = document.getElementById(panelId === 'sidePanel' ? 'sidePanel' : panelId);
  if (!panel) panel = document.getElementById('sidePanel');
  if (!panel) return;

  var cell = null;
  if (trigger && trigger.closest) {
    cell =
      trigger.closest('td.cell-autofill') ||
      trigger.closest('.taxform-cell.cell-autofill') ||
      trigger.closest('.taxform-cell');
  }
  if (!cell) cell = document.getElementById('cellJahresueberschuss') || document.getElementById('cellEntgelte');

  updateSidePanelSyncState(cell);
  panel.classList.add('open');
}
function closeSidePanel(id) {
  document.getElementById(id || 'sidePanel').classList.remove('open');
}
function updateSidePanelSyncState(cell) {
  var synced = document.getElementById('sidePanelBannerSynced');
  var unsynced = document.getElementById('sidePanelBannerUnsynced');
  var amountEl = document.getElementById('sidePanelValueAmount');
  if (!synced || !unsynced) return;

  var isOverridden = cell && cell.classList.contains('cell-overridden');
  synced.classList.toggle('hidden', isOverridden);
  unsynced.classList.toggle('hidden', !isOverridden);

  if (amountEl && cell) {
    var valueEl =
      cell.querySelector('[data-autofill-value]') ||
      cell.querySelector('.taxform-manual-input') ||
      cell.querySelector('input');
    var raw = valueEl ? (valueEl.textContent || valueEl.value || '').trim() : '';
    amountEl.textContent = raw ? raw.replace('.', ',') + ' €' : amountEl.textContent;
  }
}
function toggleExpand(rowId) {
  document.querySelectorAll('[data-expand="' + rowId + '"]').forEach(function(el) {
    el.classList.toggle('hidden');
  });
  var icon = document.querySelector('[data-expand-icon="' + rowId + '"]');
  if (icon) icon.textContent = icon.textContent === 'expand_more' ? 'expand_less' : 'expand_more';
}
function toggleBookingEntry() {
  var cb = document.getElementById('generateEntry');
  var block = document.getElementById('entryBlock');
  if (!cb || !block) return;
  block.classList.toggle('hidden', !cb.checked);
  if (cb.checked) {
    var amount =
      typeof recalcGewerbesteuer === 'function'
        ? recalcGewerbesteuer()
        : document.getElementById('gewstRueckstellungValue')
          ? getGewstRueckstellungAmount()
          : getGewerbesteuerAmount();
    var preview = document.getElementById('buchungGewerbesteuerPreview');
    if (preview) preview.textContent = formatAmountDotted(amount) + ' €';
  }
}
function showBookingPreview() {
  var el = document.getElementById('bookingPreview');
  if (el) el.classList.add('visible');
}
function markCellEdited(el) {
  var cell = el.closest('td') || el.closest('.taxform-cell') || el;
  if (!cell || !cell.classList.contains('cell-autofill')) return;

  var original = el.getAttribute('data-autofill-value');
  if (original == null) return;

  var current = normalizeEditableAmount(el.textContent != null ? el.textContent : el.value || '');
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
function selectTransmissionCard(which) {
  var sofort = document.getElementById('card-sofort');
  var vorbehalt = document.getElementById('card-vorbehalt');
  var primaryBtn = document.getElementById('transmissionPrimaryBtn');
  var isKst = document.body && document.body.dataset.flow === 'kst';
  if (sofort) sofort.classList.toggle('selected', which === 'sofort');
  if (vorbehalt) vorbehalt.classList.toggle('selected', which === 'vorbehalt');
  if (primaryBtn) {
    if (which === 'sofort') {
      primaryBtn.textContent = 'Senden';
      primaryBtn.href = isKst ? '09_dashboard-eingereicht.html' : '07_dashboard-eingereicht.html';
    } else {
      primaryBtn.textContent = 'Speichern';
      primaryBtn.href = isKst ? '08_dashboard-saved.html' : '06_dashboard-saved.html';
    }
  }
}

var STEUERMESSBETRAG = 1879.5;
var GEWERBESTEUER_STORAGE_KEY = 'gewstMvpGewerbesteuer';
var GEWERBESTEUER_NET_STORAGE_KEY = 'gewstMvpGewerbesteuerNet';

function parseGermanAmount(str) {
  return parseFloat(String(str || '').replace(/\s/g, '').replace(/\./g, '').replace(',', '.')) || 0;
}

function normalizeEditableAmount(str) {
  var s = String(str || '').trim().replace(/\u00a0/g, ' ').replace(/\s/g, '');
  if (s.indexOf(',') !== -1 && s.indexOf('.') !== -1) return s.replace(/,/g, '');
  if (s.indexOf(',') !== -1 && s.indexOf('.') === -1) {
    var parts = s.split(',');
    if (parts.length === 2 && parts[1].length <= 2) return parts[0] + '.' + parts[1];
  }
  return s;
}

function formatAmountSpaced(num) {
  var parts = num.toFixed(2).split('.');
  var intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return intPart + ',' + parts[1];
}

function formatAmountDotted(num) {
  var parts = num.toFixed(2).split('.');
  var intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return intPart + ',' + parts[1];
}

function getGewerbesteuerAmount() {
  var stored = sessionStorage.getItem(GEWERBESTEUER_STORAGE_KEY);
  if (stored != null && stored !== '') return parseFloat(stored) || 0;
  var input = document.getElementById('hebesatzInput');
  if (input) return STEUERMESSBETRAG * parseGermanAmount(input.value) / 100;
  return 0;
}

function getGewstVorauszahlungen7610() {
  if (typeof GEWST_VORAUSZAHLUNGEN_7610 !== 'undefined') return GEWST_VORAUSZAHLUNGEN_7610;
  return 5040;
}

function getGewstRueckstellungAmount() {
  var stored = sessionStorage.getItem(GEWERBESTEUER_NET_STORAGE_KEY);
  if (stored != null && stored !== '') return parseFloat(stored) || 0;
  return Math.max(0, getGewerbesteuerAmount() - getGewstVorauszahlungen7610());
}

function persistGewerbesteuer(gross, net) {
  sessionStorage.setItem(GEWERBESTEUER_STORAGE_KEY, String(gross));
  if (net != null) sessionStorage.setItem(GEWERBESTEUER_NET_STORAGE_KEY, String(net));
}

function recalcGewerbesteuer() {
  var input = document.getElementById('hebesatzInput');
  var gewerbesteuerEl = document.getElementById('gewerbesteuerValue');
  if (!input || !gewerbesteuerEl) return 0;

  var hebesatz = parseGermanAmount(input.value);
  var gross = STEUERMESSBETRAG * hebesatz / 100;
  gewerbesteuerEl.textContent = formatAmountSpaced(gross);

  var rueckstellungEl = document.getElementById('gewstRueckstellungValue');
  var bookingAmount = gross;
  if (rueckstellungEl) {
    var prepayment = getGewstVorauszahlungen7610();
    var net = Math.max(0, gross - prepayment);
    rueckstellungEl.textContent = formatAmountSpaced(net);
    bookingAmount = net;
    persistGewerbesteuer(gross, net);
  } else {
    persistGewerbesteuer(gross);
  }

  var amountDotted = formatAmountDotted(bookingAmount);
  ['bookingExpenseSoll', 'bookingExpenseTotal', 'bookingLiabilityHaben', 'bookingLiabilityTotal'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.textContent = amountDotted;
  });

  var preview = document.getElementById('buchungGewerbesteuerPreview');
  if (preview) preview.textContent = amountDotted + ' €';

  return rueckstellungEl ? bookingAmount : gross;
}

function initBerechnungPage() {
  var input = document.getElementById('hebesatzInput');
  if (!input) return;
  input.addEventListener('input', recalcGewerbesteuer);
  input.addEventListener('blur', recalcGewerbesteuer);
  recalcGewerbesteuer();
}

function initTransmissionPage() {
  var isKst = document.body && document.body.dataset.flow === 'kst';
  if (isKst) {
    var steuerschuldEl = document.getElementById('steuerschuldValue');
    if (!steuerschuldEl) return;
    steuerschuldEl.textContent = formatAmountDotted(getKstTaxTotal()) + ' €';
    return;
  }

  var festsetzungEl = document.getElementById('transmissionFestsetzungValue');
  var vorauszahlungenEl = document.getElementById('transmissionVorauszahlungenValue');
  var steuerschuldEl = document.getElementById('steuerschuldValue');
  if (festsetzungEl && vorauszahlungenEl && steuerschuldEl) {
    var gross = getGewerbesteuerAmount();
    var prepayment = getGewstVorauszahlungen7610();
    var net = getGewstRueckstellungAmount();
    festsetzungEl.textContent = formatAmountDotted(gross) + ' €';
    vorauszahlungenEl.textContent = '− ' + formatAmountDotted(prepayment) + ' €';
    steuerschuldEl.textContent = formatAmountDotted(net) + ' €';
    return;
  }

  if (!steuerschuldEl) return;
  steuerschuldEl.textContent = formatAmountDotted(getGewerbesteuerAmount()) + ' €';
}
var FORM_PREVIEW_PAGE_COUNT = 9;
function getPrototypeAssetBase() {
  var script = document.querySelector('script[src*="prototype.js"]');
  if (!script) return new URL('../../assets/gewst1a/page-', window.location.href).href;
  var scriptUrl = new URL(script.getAttribute('src'), window.location.href);
  return new URL('../assets/gewst1a/page-', scriptUrl).href;
}
var FORM_PREVIEW_IMAGE_BASE = getPrototypeAssetBase();
var FORM_PREVIEW_FIELDS = {
  1: [
    { kind: 'text', top: 22.5, left: 40.5, width: 55, value: 'BERLIN MITTE' },
    { kind: 'text', top: 26.8, left: 40.5, width: 55, value: '27 123 45678' },
    { kind: 'text', top: 28.8, left: 40.5, width: 55, value: 'HAUSMANN & PARTNER GMBH' },
    { kind: 'text', top: 36.8, left: 40.5, width: 55, value: 'IT-DIENSTLEISTUNGEN' }
  ],
  2: [
    { kind: 'text', top: 44.5, left: 40.5, width: 18, value: '10115' },
    { kind: 'text', top: 44.5, left: 58, width: 38, value: 'BERLIN' },
    { kind: 'amount', top: 53.6, left: 55, width: 41, value: '5 4 6 1 2 , 3 6' }
  ],
  3: [
    { kind: 'amount', top: 11.8, left: 55, width: 41, value: '1 6 1 , 1 0' },
    { kind: 'amount', top: 27.2, left: 55, width: 41, value: '6 5 9 6 , 5 2' },
    { kind: 'amount', top: 38.4, left: 55, width: 41, value: '2 3 1 1 5 , 9 7' },
    { kind: 'amount', top: 43.8, left: 55, width: 41, value: '8 6 3 2 , 2 3' }
  ],
  5: [
    { kind: 'amount', top: 6.2, left: 55, width: 41, value: '7 9 8 7 , 0 0' }
  ]
};

var pdfPreviewState = {
  scale: 1,
  pageCount: FORM_PREVIEW_PAGE_COUNT,
  rendered: false,
  rendering: false,
  basePageWidth: 820
};

function appendFormPreviewOverlays(wrapper, pageNum) {
  var fields = FORM_PREVIEW_FIELDS[pageNum];
  if (!fields || !fields.length) return;

  var layer = document.createElement('div');
  layer.className = 'pdf-export-overlays';
  fields.forEach(function(field) {
    var el = document.createElement('div');
    el.className = 'pdf-field-overlay pdf-field-overlay--' + field.kind;
    el.style.top = field.top + '%';
    el.style.left = field.left + '%';
    el.style.width = field.width + '%';
    el.textContent = field.value;
    layer.appendChild(el);
  });
  wrapper.appendChild(layer);
}

function drawFieldsOnCanvas(ctx, pageNum, width, height) {
  var fields = FORM_PREVIEW_FIELDS[pageNum] || [];
  fields.forEach(function(field) {
    var fontSize = Math.max(8, height * 0.017);
    ctx.font = '700 ' + fontSize + 'px "Courier New", monospace';
    ctx.fillStyle = '#141a1f';
    ctx.textAlign = field.kind === 'amount' ? 'right' : 'left';
    ctx.textBaseline = 'top';
    var x = (field.left / 100) * width;
    var y = (field.top / 100) * height;
    if (field.kind === 'amount') x += (field.width / 100) * width;
    ctx.fillText(field.value, x, y);
  });
}

function syncOverlayFontSizes() {
  document.querySelectorAll('.pdf-export-page').forEach(function(pageEl) {
    var size = Math.max(8, Math.round(pageEl.clientWidth * 0.012));
    pageEl.querySelectorAll('.pdf-field-overlay').forEach(function(el) {
      el.style.fontSize = size + 'px';
    });
  });
}

function updatePdfPreviewUi() {
  var zoomLabel = document.getElementById('pdfZoomLabel');
  if (zoomLabel) zoomLabel.textContent = Math.round(pdfPreviewState.scale * 100) + '%';
  var totalEl = document.getElementById('pdfPageTotal');
  if (totalEl) totalEl.textContent = String(pdfPreviewState.pageCount);
  document.querySelectorAll('.pdf-export-page').forEach(function(pageEl) {
    pageEl.style.width = Math.round(pdfPreviewState.basePageWidth * pdfPreviewState.scale) + 'px';
  });
  syncOverlayFontSizes();
}

function showPdfPreviewError(message) {
  var container = document.getElementById('pdfPreviewPages');
  if (!container) return;
  container.innerHTML = '<div class="pdf-export-loading">' + message + '</div>';
}

function pdfPreviewGoToPage(pageNum) {
  var num = parseInt(pageNum, 10);
  if (!num || num < 1) num = 1;
  if (pdfPreviewState.pageCount && num > pdfPreviewState.pageCount) num = pdfPreviewState.pageCount;
  var page = document.getElementById('pdfPreviewPage-' + num);
  var input = document.getElementById('pdfPageInput');
  if (input) input.value = String(num);
  if (page) page.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function pdfPreviewPrevPage() {
  var input = document.getElementById('pdfPageInput');
  var current = input ? parseInt(input.value, 10) || 1 : 1;
  pdfPreviewGoToPage(Math.max(1, current - 1));
}

function pdfPreviewNextPage() {
  var input = document.getElementById('pdfPageInput');
  var current = input ? parseInt(input.value, 10) || 1 : 1;
  pdfPreviewGoToPage(current + 1);
}

function pdfPreviewZoom(delta) {
  pdfPreviewState.scale = Math.min(2, Math.max(0.55, pdfPreviewState.scale + delta));
  updatePdfPreviewUi();
}

function pdfPreviewFitWidth() {
  var scroll = document.getElementById('pdfPreviewScroll');
  if (!scroll) return;
  var padding = 48;
  pdfPreviewState.scale = Math.min(2, Math.max(0.55, (scroll.clientWidth - padding) / pdfPreviewState.basePageWidth));
  updatePdfPreviewUi();
}

function downloadBlob(bytes, filename) {
  var blob = new Blob([bytes], { type: 'application/pdf' });
  var url = URL.createObjectURL(blob);
  var link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function exportFormPreviewPdf() {
  if (typeof PDFLib === 'undefined' || !pdfPreviewState.rendered) return;

  var pdfDoc = await PDFLib.PDFDocument.create();
  var pageEls = document.querySelectorAll('.pdf-export-page');

  for (var i = 0; i < pageEls.length; i++) {
    var pageEl = pageEls[i];
    var img = pageEl.querySelector('img');
    if (!img || !img.complete || !img.naturalWidth) continue;

    var pageNum = i + 1;
    var width = img.naturalWidth;
    var height = img.naturalHeight;
    var merged = document.createElement('canvas');
    merged.width = width;
    merged.height = height;
    var ctx = merged.getContext('2d');
    ctx.drawImage(img, 0, 0);
    drawFieldsOnCanvas(ctx, pageNum, width, height);

    var jpegBytes = await fetch(merged.toDataURL('image/jpeg', 0.94)).then(function(r) { return r.arrayBuffer(); });
    var image = await pdfDoc.embedJpg(jpegBytes);
    var page = pdfDoc.addPage([image.width, image.height]);
    page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
  }

  downloadBlob(await pdfDoc.save(), 'GewSt1A_2025_Vorschau.pdf');
}

async function downloadGewstFormFromTransmission() {
  var btn = document.getElementById('downloadFormBtn');
  var originalHtml = btn ? btn.innerHTML : '';
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'PDF wird erstellt …';
  }
  try {
    if (!pdfPreviewState.rendered) {
      await renderFormPreviewPdf(false);
    }
    await exportFormPreviewPdf();
  } catch (err) {
    console.error(err);
    alert('PDF konnte nicht erstellt werden. Bitte Prototyp über einen lokalen Webserver öffnen.');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = originalHtml;
    }
  }
}

function printFormPreview() {
  window.print();
}

function loadImage(src) {
  return new Promise(function(resolve, reject) {
    var img = new Image();
    img.onload = function() { resolve(img); };
    img.onerror = function() { reject(new Error('Bild konnte nicht geladen werden: ' + src)); };
    img.src = src;
  });
}

async function renderFormPreviewPdf(force) {
  if (pdfPreviewState.rendering) return;
  if (pdfPreviewState.rendered && !force) return;

  pdfPreviewState.rendering = true;
  var container = document.getElementById('pdfPreviewPages');
  if (!container) {
    pdfPreviewState.rendering = false;
    return;
  }

  container.innerHTML = '';

  try {
    for (var pageNum = 1; pageNum <= FORM_PREVIEW_PAGE_COUNT; pageNum++) {
      var src = FORM_PREVIEW_IMAGE_BASE + pageNum + '.jpg';
      var img = await loadImage(src);
      var wrapper = document.createElement('div');
      wrapper.className = 'pdf-export-page';
      wrapper.id = 'pdfPreviewPage-' + pageNum;
      wrapper.style.width = Math.round(pdfPreviewState.basePageWidth * pdfPreviewState.scale) + 'px';

      var pageImg = document.createElement('img');
      pageImg.src = src;
      pageImg.alt = 'GewSt 1 A Seite ' + pageNum;
      pageImg.width = img.naturalWidth;
      pageImg.height = img.naturalHeight;
      wrapper.appendChild(pageImg);
      appendFormPreviewOverlays(wrapper, pageNum);
      container.appendChild(wrapper);
    }

    pdfPreviewState.rendered = true;
    updatePdfPreviewUi();
    syncOverlayFontSizes();
  } catch (err) {
    showPdfPreviewError('Vordruck konnte nicht geladen werden. Bitte Prototyp über einen lokalen Webserver öffnen.');
    console.error(err);
  }

  pdfPreviewState.rendering = false;
}

function initDashboardPage() {
  var gewerbesteuerEl = document.getElementById('dashboardGewerbesteuer');
  if (!gewerbesteuerEl) return;
  var amount = getGewerbesteuerAmount();
  gewerbesteuerEl.textContent = amount > 0 ? formatAmountDotted(amount) : '—';
}

/* ── KSt flow ─────────────────────────────────────────────── */
var KST_TAXABLE_INCOME = 2856.97;
var KST_DEFAULT_RATE = 15;
var KST_STORAGE_KEY = 'kstMvpTaxTotal';

function getKstTaxTotal() {
  var stored = sessionStorage.getItem(KST_STORAGE_KEY);
  if (stored != null && stored !== '') return parseFloat(stored) || 0;
  var input = document.getElementById('kstRateInput');
  if (input) return recalcKstTax(false);
  return KST_TAXABLE_INCOME * KST_DEFAULT_RATE / 100 * 1.055;
}

function recalcKstTax(persist) {
  if (persist == null) persist = true;
  var rateInput = document.getElementById('kstRateInput');
  var kstEl = document.getElementById('kstAmountValue');
  var soliEl = document.getElementById('kstSoliValue');
  var totalEl = document.getElementById('kstTotalTaxValue');
  var rate = rateInput ? parseGermanAmount(String(rateInput.value).replace('%', '')) : KST_DEFAULT_RATE;
  var kst = KST_TAXABLE_INCOME * rate / 100;
  var soli = kst * 0.055;
  var total = kst + soli;

  if (kstEl) kstEl.textContent = formatAmountSpaced(kst);
  if (soliEl) soliEl.textContent = formatAmountSpaced(soli);
  if (totalEl) totalEl.textContent = formatAmountSpaced(total);

  var rateTaxEl = document.getElementById('kstRateTaxValue');
  if (rateTaxEl) rateTaxEl.textContent = formatAmountSpaced(kst);

  var amountDotted = formatAmountDotted(total);
  ['kstBookingExpenseSoll', 'kstBookingExpenseTotal', 'kstBookingLiabilityHaben', 'kstBookingLiabilityTotal'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.textContent = amountDotted;
  });

  if (persist) sessionStorage.setItem(KST_STORAGE_KEY, String(total));
  return total;
}

function initKstBuchungssaetzePage() {
  var input = document.getElementById('kstRateInput');
  if (!input) return;
  input.addEventListener('input', function() { recalcKstTax(true); });
  input.addEventListener('blur', function() { recalcKstTax(true); });
  recalcKstTax(true);
}

function initKstBerechnungPage() {
  if (document.getElementById('kstRateInput')) return;
  var kstEl = document.getElementById('kstAmountValue');
  if (!kstEl || !document.getElementById('kstTotalTaxValue')) return;
  var total = getKstTaxTotal();
  var kst = total / 1.055;
  var soli = total - kst;
  kstEl.textContent = formatAmountSpaced(kst);
  var soliEl = document.getElementById('kstSoliValue');
  if (soliEl) soliEl.textContent = formatAmountSpaced(soli);
  var totalEl = document.getElementById('kstTotalTaxValue');
  if (totalEl) totalEl.textContent = formatAmountSpaced(total);
}

function initKstDashboardPage() {
  var kstEl = document.getElementById('dashboardKstAmount');
  if (!kstEl) return;
  var total = getKstTaxTotal();
  var kstOnly = total / 1.055;
  var soli = total - kstOnly;
  kstEl.textContent = formatAmountDotted(kstOnly);
  var soliEl = document.getElementById('dashboardKstSoli');
  if (soliEl) soliEl.textContent = formatAmountDotted(soli);
  var entriesEl = document.getElementById('dashboardKstEntries');
  if (entriesEl) entriesEl.textContent = total > 0 ? formatAmountDotted(total) : '—';
}

function initKstFormPreview() {
  var page = document.getElementById('kstPreviewPage');
  if (!page) return;
  pdfPreviewState.pageCount = 1;
  pdfPreviewState.rendered = true;
  pdfPreviewState.basePageWidth = 820;
  updatePdfPreviewUi();
}

function exportKstPreviewMock() {
  var img = document.querySelector('#kstPreviewPage img');
  if (!img || !img.src) return;
  var link = document.createElement('a');
  link.href = img.src;
  link.download = 'KSt_2025_Vorschau.png';
  document.body.appendChild(link);
  link.click();
  link.remove();
}

async function downloadKstFormFromTransmission() {
  var btn = document.getElementById('downloadFormBtn');
  var originalHtml = btn ? btn.innerHTML : '';
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'PDF wird erstellt …';
  }
  try {
    initKstFormPreview();
    exportKstPreviewMock();
  } catch (err) {
    console.error(err);
    alert('Export konnte nicht erstellt werden.');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = originalHtml;
    }
  }
}

document.addEventListener('DOMContentLoaded', function() {
  initBerechnungPage();
  initTransmissionPage();
  initDashboardPage();
  initKstBuchungssaetzePage();
  initKstBerechnungPage();
  initKstDashboardPage();
  initKstFormPreview();
  if (typeof initGewstFormPage === 'function') initGewstFormPage();
  if (typeof initKstFormPage === 'function') initKstFormPage();

  if (document.getElementById('pdfPreviewPages') && !document.getElementById('kstPreviewPage')) {
    renderFormPreviewPdf(false).then(function() {
      pdfPreviewFitWidth();
      pdfPreviewGoToPage(1);
    });
  }
});
