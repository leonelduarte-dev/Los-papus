const STORAGE_KEY = 'bachea-reports-v1';
const form = document.getElementById('report-form');
const list = document.getElementById('reports-list');
const emptyState = document.getElementById('empty-state');
const listFooter = document.getElementById('list-footer');
const filter = document.getElementById('risk-filter');
const riskPreview = document.getElementById('risk-preview');
const toast = document.getElementById('toast');
const measureInputs = ['length', 'width', 'depth'].map(id => document.getElementById(id));
let reports = loadReports();
let toastTimer;

function loadReports() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(stored) ? stored.filter(item => item && item.id && item.address) : [];
  } catch { return []; }
}
function saveReports() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(reports)); return true; }
  catch { showToast('No se pudo guardar. Libera espacio en tu navegador e inténtalo de nuevo.'); return false; }
}
function assessRisk(length, width, depth) {
  const area = (length * width) / 10000;
  if (depth >= 15 || area >= 0.5) return { level: 'Crítico', key: 'critical', note: 'Riesgo muy alto: conviene señalizar y atender pronto.' };
  if (depth >= 10 || area >= 0.25) return { level: 'Alto', key: 'high', note: 'Puede causar daños. Se recomienda atención prioritaria.' };
  if (depth >= 5 || area >= 0.1) return { level: 'Medio', key: 'medium', note: 'Puede afectar a vehículos y ciclistas.' };
  return { level: 'Bajo', key: 'low', note: 'Daño menor; conviene dar seguimiento.' };
}
function getMeasureValues() { return measureInputs.map(input => Number.parseFloat(input.value) || 0); }
function updateRiskPreview() {
  const [length, width, depth] = getMeasureValues();
  if (!length || !width || !depth) {
    riskPreview.className = 'risk-preview';
    document.getElementById('risk-title').textContent = 'Riesgo por calcular';
    document.getElementById('risk-description').textContent = 'Ingresa las medidas para estimar el nivel de riesgo.';
    return;
  }
  const risk = assessRisk(length, width, depth);
  riskPreview.className = `risk-preview risk-${risk.key}`;
  document.getElementById('risk-title').textContent = `Riesgo ${risk.level.toLowerCase()}`;
  document.getElementById('risk-description').textContent = risk.note;
}
measureInputs.forEach(input => input.addEventListener('input', updateRiskPreview));

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}
function formatDate(value) {
  return new Intl.DateTimeFormat('es', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value));
}
function renderReports() {
  const selected = filter.value;
  const visible = reports.filter(report => selected === 'all' || report.risk === selected);
  list.innerHTML = visible.map(report => {
    const lat = Number.parseFloat(report.latitude);
    const lon = Number.parseFloat(report.longitude);
    const hasCoords = Number.isFinite(lat) && Number.isFinite(lon);
    const mapUrl = hasCoords ? `https://www.openstreetmap.org/?mlat=${encodeURIComponent(lat)}&mlon=${encodeURIComponent(lon)}#map=17/${encodeURIComponent(lat)}/${encodeURIComponent(lon)}` : '';
    const area = ((Number(report.length) * Number(report.width)) / 10000).toFixed(2);
    return `<article class="report-card"><div class="report-top"><div class="report-address"><span class="report-pin">⌖</span><span>${esc(report.address)}</span></div><span class="risk-badge badge-${esc(report.risk.toLowerCase())}">${esc(report.risk)}</span></div><div class="report-meta"><span>↔ ${esc(report.length)} × ${esc(report.width)} × ${esc(report.depth)} cm</span><span>▧ ${area} m²</span><span>${esc(formatDate(report.createdAt))}</span></div>${report.notes ? `<p class="report-notes">${esc(report.notes)}</p>` : ''}<div class="report-actions">${hasCoords ? `<a href="${mapUrl}" target="_blank" rel="noopener noreferrer">Abrir en mapa ↗</a>` : '<span style="font-size:9px;color:#9aa49d">Sin coordenadas</span>'}<button type="button" class="delete-one" data-delete="${esc(report.id)}" aria-label="Borrar reporte de ${esc(report.address)}">Borrar</button></div></article>`;
  }).join('');
  const highCount = reports.filter(report => report.risk === 'Alto' || report.risk === 'Crítico').length;
  const totalArea = reports.reduce((sum, report) => sum + Number(report.length) * Number(report.width) / 10000, 0);
  document.getElementById('stat-total').textContent = reports.length;
  document.getElementById('stat-high').textContent = highCount;
  document.getElementById('stat-area').textContent = totalArea.toFixed(2);
  document.getElementById('nav-count').textContent = reports.length;
  document.getElementById('report-count').textContent = reports.length;
  emptyState.hidden = reports.length > 0;
  list.hidden = reports.length === 0 || visible.length === 0;
  listFooter.hidden = reports.length === 0;
  if (reports.length && visible.length === 0) {
    list.hidden = true;
    emptyState.hidden = false;
    emptyState.innerHTML = '<div class="empty-illustration"><span>⌕</span><i></i></div><h3>No hay reportes con este riesgo</h3><p>Prueba con otro filtro para ver los reportes registrados.</p>';
  } else if (reports.length === 0) {
    emptyState.innerHTML = '<div class="empty-illustration"><span>⌖</span><i></i></div><h3>Tu comunidad empieza aquí</h3><p>Aún no hay baches registrados. Agrega el primero y ayuda a que tu calle sea más segura.</p><a href="#registrar" class="empty-link">Registrar el primer bache <span>→</span></a>';
  }
}
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}

form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const length = Number(data.get('length'));
  const width = Number(data.get('width'));
  const depth = Number(data.get('depth'));
  if (![length, width, depth].every(Number.isFinite) || length <= 0 || width <= 0 || depth < 0) {
    showToast('Revisa las medidas ingresadas.');
    return;
  }
  const risk = assessRisk(length, width, depth);
  const report = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    address: String(data.get('address')).trim(),
    latitude: String(data.get('latitude') || '').trim(),
    longitude: String(data.get('longitude') || '').trim(),
    length, width, depth, risk: risk.level,
    notes: String(data.get('notes') || '').trim(),
    createdAt: new Date().toISOString()
  };
  reports.unshift(report);
  if (!saveReports()) { reports.shift(); return; }
  form.reset();
  updateRiskPreview();
  filter.value = 'all';
  renderReports();
  showToast('¡Reporte registrado en este dispositivo!');
  document.getElementById('reportes').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

filter.addEventListener('change', renderReports);
list.addEventListener('click', event => {
  const button = event.target.closest('[data-delete]');
  if (!button) return;
  reports = reports.filter(report => report.id !== button.dataset.delete);
  if (saveReports()) { renderReports(); showToast('Reporte eliminado.'); }
});
document.getElementById('clear-button').addEventListener('click', () => {
  if (!reports.length || !window.confirm('¿Borrar todos los reportes guardados en este dispositivo?')) return;
  const previous = reports;
  reports = [];
  if (saveReports()) { renderReports(); showToast('Se borraron tus reportes.'); }
  else reports = previous;
});
document.getElementById('locate-button').addEventListener('click', () => {
  if (!navigator.geolocation) { showToast('Tu navegador no permite obtener la ubicación.'); return; }
  const button = document.getElementById('locate-button');
  button.disabled = true;
  button.innerHTML = '<span>◎</span> Obteniendo ubicación…';
  navigator.geolocation.getCurrentPosition(position => {
    document.getElementById('latitude').value = position.coords.latitude.toFixed(6);
    document.getElementById('longitude').value = position.coords.longitude.toFixed(6);
    button.disabled = false;
    button.innerHTML = '<span>◎</span> Ubicación agregada';
    showToast('Ubicación agregada al formulario.');
  }, error => {
    button.disabled = false;
    button.innerHTML = '<span>◎</span> Usar mi ubicación actual';
    showToast(error.code === 1 ? 'Permite el acceso a tu ubicación en el navegador.' : 'No se pudo obtener tu ubicación. Intenta de nuevo.');
  }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 });
});
renderReports();
