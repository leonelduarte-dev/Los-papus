import { useMemo, useState } from 'react';
import {
  Alert,
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Toolbar,
} from '@mui/material';
import AddLocationAltOutlinedIcon from '@mui/icons-material/AddLocationAltOutlined';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import MyLocationRoundedIcon from '@mui/icons-material/MyLocationRounded';
import PendingActionsRoundedIcon from '@mui/icons-material/PendingActionsRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const STORAGE_KEY = 'bache-report-angostura-reports';
const communities = [
  'Angostura Centro', 'Alhuey', 'La Reforma', 'Gato de Lara', 'Palmitas',
  'Batury', 'Chinitos', 'Campo Plata', 'Otra comunidad',
];
const sampleReports = [
  {
    id: 'BA-1024', street: 'Blvd. 16 de Septiembre', community: 'Angostura Centro',
    description: 'Bache profundo frente a la plaza. Se dificulta el paso de vehículos y peatones.',
    status: 'En revisión', location: '25.365° N, 108.155° O', image: '',
    createdAt: '2026-11-09T10:30:00.000Z',
  },
  {
    id: 'BA-1023', street: 'Calle Ignacio Zaragoza', community: 'Alhuey',
    description: 'Hay varios baches seguidos cerca de la escuela primaria. Precaución al circular.',
    status: 'Pendiente', location: '25.410° N, 108.090° O', image: '',
    createdAt: '2026-11-08T16:20:00.000Z',
  },
  {
    id: 'BA-1022', street: 'Av. Reforma', community: 'La Reforma',
    description: 'Reparación realizada en el cruce principal. Gracias por reportar.',
    status: 'Atendido', location: '25.085° N, 108.045° O', image: '',
    createdAt: '2026-11-05T09:00:00.000Z',
  },
];

function readReports() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return sampleReports;
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : sampleReports;
  } catch {
    return sampleReports;
  }
}

function saveReports(reports) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
}

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function Brand({ compact = false }) {
  return (
    <a className={`brand ${compact ? 'brand-compact' : ''}`} href="#inicio" aria-label="Bache Report Angostura, inicio">
      <span className="brand-mark"><FmdGoodOutlinedIcon /></span>
      <span className="brand-name">Bache<span>Report</span><small>ANGOSTURA · SINALOA</small></span>
    </a>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [['#reportes', 'Reportes'], ['#mapa', 'Mapa'], ['#estadisticas', 'Estadísticas'], ['#informacion', 'Nosotros']];
  return (
    <AppBar position="sticky" elevation={0} className="topbar">
      <Container maxWidth="lg">
        <Toolbar disableGutters className="toolbar">
          <Brand />
          <nav className={`nav-links ${menuOpen ? 'nav-open' : ''}`} aria-label="Navegación principal">
            {links.map(([href, label]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
          </nav>
          <Button className="nav-cta" variant="contained" onClick={() => { scrollTo('reportar'); setMenuOpen(false); }}>
            <AddLocationAltOutlinedIcon /> Reportar bache
          </Button>
          <IconButton className="menu-toggle" aria-label="Abrir menú" onClick={() => setMenuOpen(!menuOpen)}><MenuRoundedIcon /></IconButton>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

function Hero({ reports }) {
  return (
    <section className="hero-section" id="inicio">
      <Container maxWidth="lg" className="hero-container">
        <div className="hero-copy">
          <div className="eyebrow"><span className="live-dot" /> UNA COMUNIDAD QUE SE MUEVE</div>
          <h1>Calles más seguras,<br /><span>comunidad más fuerte.</span></h1>
          <p>Tu reporte hace la diferencia. Ayúdanos a identificar los baches de Angostura y dar seguimiento a cada mejora.</p>
          <div className="hero-actions">
            <Button className="hero-button" variant="contained" onClick={() => scrollTo('reportar')}>Reportar un bache <ArrowForwardRoundedIcon /></Button>
            <Button className="text-button" onClick={() => scrollTo('reportes')}>Ver reportes <VisibilityOutlinedIcon /></Button>
          </div>
          <div className="hero-note">
            <div className="avatar-stack"><Avatar>👋</Avatar><Avatar>🚗</Avatar><Avatar>🌵</Avatar></div>
            <span><strong>{reports.length} reportes comunitarios</strong><br />Cada aviso ayuda a mejorar el camino.</span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-photo">
            <div className="photo-shade" />
            <div className="photo-caption"><span className="caption-pin"><FmdGoodOutlinedIcon /></span><span><b>Angostura, Sinaloa</b><small>La comunidad en acción</small></span></div>
            <div className="floating-card"><span className="float-icon"><CheckCircleOutlineRoundedIcon /></span><span><b>Tu voz cuenta</b><small>Reportar toma menos de 2 min</small></span></div>
          </div>
          <div className="hero-stamp"><span>JUNTOS</span><b>HACEMOS</b><span>CAMINO</span><small>ANGOSTURA · SINALOA</small></div>
        </div>
      </Container>
      <div className="hero-bottom-line" />
    </section>
  );
}

function SectionHeading({ eyebrow, title, highlight, description, action }) {
  return (
    <div className="section-heading">
      <div><span className="section-eyebrow">{eyebrow}</span><h2>{title} <em>{highlight}</em></h2>{description && <p>{description}</p>}</div>
      {action}
    </div>
  );
}

function ReportForm({ onSubmit, notify }) {
  const [form, setForm] = useState({ street: '', community: '', description: '', location: '' });
  const [image, setImage] = useState('');
  const [fileName, setFileName] = useState('');
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState({});
  const setField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: '' }));
  };
  const useLocation = () => {
    if (!navigator.geolocation) {
      notify('Este navegador no permite obtener la ubicación. Puedes escribirla manualmente.', 'warning');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => setForm((current) => ({ ...current, location: `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}` })),
      () => notify('No se pudo obtener tu ubicación. Revisa los permisos o escríbela manualmente.', 'error'),
      { timeout: 10000 },
    );
  };
  const chooseImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      notify('Selecciona un archivo de imagen válido.', 'error');
      event.target.value = '';
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      notify('La fotografía debe pesar menos de 2 MB para guardarse en este navegador.', 'warning');
      event.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => { setImage(String(reader.result)); setFileName(file.name); };
    reader.onerror = () => notify('No se pudo leer la fotografía. Intenta con otro archivo.', 'error');
    reader.readAsDataURL(file);
  };
  const submit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.street.trim()) nextErrors.street = 'Escribe el nombre de la calle.';
    if (!form.community) nextErrors.community = 'Selecciona una colonia o comunidad.';
    if (form.description.trim().length < 10) nextErrors.description = 'Cuéntanos un poco más (mínimo 10 caracteres).';
    if (!form.location.trim()) nextErrors.location = 'Agrega una ubicación o usa tu ubicación actual.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      notify('Revisa los campos marcados para poder enviar el reporte.', 'error');
      return;
    }
    setBusy(true);
    try {
      const saved = onSubmit({ ...form, street: form.street.trim(), description: form.description.trim(), image });
      if (!saved) return;
      setForm({ street: '', community: '', description: '', location: '' });
      setImage('');
      setFileName('');
      event.target.reset();
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="report-section anchor-section" id="reportar">
      <Container maxWidth="lg">
        <div className="form-layout">
          <div className="form-intro">
            <span className="section-eyebrow">TU REPORTE IMPORTA</span>
            <h2>Ayúdanos a<br /><em>mejorar el camino.</em></h2>
            <p>Comparte los detalles del bache y nuestro registro comunitario quedará actualizado para que todos puedan consultarlo.</p>
            <div className="privacy-note"><ShieldOutlinedIcon /><span><b>Tu información, protegida</b><small>Solo pedimos los datos necesarios para ubicar el problema.</small></span></div>
            <div className="steps-note"><span>01</span><span>Describe</span><i /><span>02</span><span>Ubica</span><i /><span>03</span><span>Comparte</span></div>
          </div>
          <Card className="form-card" elevation={0}>
            <CardContent>
              <div className="form-card-title"><span className="form-icon"><AddLocationAltOutlinedIcon /></span><div><h3>Nuevo reporte</h3><p>Los campos con * son obligatorios</p></div></div>
              <form onSubmit={submit} noValidate>
                <TextField fullWidth label="Calle o avenida *" placeholder="Ej. Blvd. 16 de Septiembre" value={form.street} onChange={setField('street')} error={Boolean(errors.street)} helperText={errors.street} />
                <FormControl fullWidth error={Boolean(errors.community)}>
                  <InputLabel id="community-label">Colonia o comunidad *</InputLabel>
                  <Select labelId="community-label" label="Colonia o comunidad *" value={form.community} onChange={setField('community')} displayEmpty>
                    <MenuItem value="" disabled>Selecciona una comunidad</MenuItem>
                    {communities.map((community) => <MenuItem value={community} key={community}>{community}</MenuItem>)}
                  </Select>
                  {errors.community && <span className="field-error">{errors.community}</span>}
                </FormControl>
                <TextField fullWidth multiline minRows={3} label="¿Qué sucede? *" placeholder="Describe el tamaño, ubicación exacta o algún punto de referencia..." value={form.description} onChange={setField('description')} error={Boolean(errors.description)} helperText={errors.description || 'Incluye detalles que ayuden a encontrar el bache.'} />
                <div className="location-row">
                  <TextField fullWidth label="Ubicación *" placeholder="Coordenadas o punto de referencia" value={form.location} onChange={setField('location')} error={Boolean(errors.location)} helperText={errors.location} InputProps={{ startAdornment: <InputAdornment position="start"><FmdGoodOutlinedIcon className="input-pin" /></InputAdornment> }} />
                  <Button className="location-button" onClick={useLocation} aria-label="Usar mi ubicación"><MyLocationRoundedIcon /></Button>
                </div>
                <input id="photo-upload" className="visually-hidden" type="file" accept="image/*" onChange={chooseImage} />
                <label className={`upload-box ${image ? 'has-image' : ''}`} htmlFor="photo-upload">
                  {image ? <img src={image} alt="Vista previa del bache" /> : <span className="upload-icon"><ImageOutlinedIcon /></span>}
                  <span className="upload-copy"><b>{fileName || 'Agrega una fotografía'}</b><small>{image ? 'Toca para cambiar la foto' : 'Una imagen ayuda a dimensionar el problema · Opcional'}</small></span>
                  {image && <IconButton className="remove-photo" aria-label="Quitar fotografía" onClick={(event) => { event.preventDefault(); setImage(''); setFileName(''); document.getElementById('photo-upload').value = ''; }}><CloseRoundedIcon /></IconButton>}
                </label>
                <Button type="submit" fullWidth className="submit-button" variant="contained" disabled={busy}>{busy ? 'Enviando...' : 'Enviar reporte'} <SendRoundedIcon /></Button>
                <div className="form-footnote"><ShieldOutlinedIcon /> Demo comunitaria · No conectada con el Ayuntamiento</div>
              </form>
            </CardContent>
          </Card>
        </div>
      </Container>
    </section>
  );
}

function StatusChip({ status }) {
  const className = status === 'Atendido' ? 'status-done' : status === 'En revisión' ? 'status-review' : 'status-pending';
  return <Chip className={`status-chip ${className}`} label={<><span className="status-dot" />{status}</>} size="small" />;
}

function ReportCard({ report }) {
  const date = new Date(report.createdAt).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
  return (
    <Card className="report-card" elevation={0}>
      <div className="report-image" style={report.image ? { backgroundImage: `url("${report.image}")` } : undefined}>
        {!report.image && <div className="image-placeholder"><FmdGoodOutlinedIcon /><span>Angostura, Sinaloa</span></div>}
        <StatusChip status={report.status} />
      </div>
      <CardContent className="report-card-content">
        <div className="report-meta"><span>{report.id}</span><span>{date}</span></div>
        <h3>{report.street}</h3>
        <div className="report-place"><FmdGoodOutlinedIcon />{report.community}</div>
        <p>{report.description}</p>
        <Divider />
        <div className="report-location"><AddLocationAltOutlinedIcon /><span>{report.location}</span></div>
      </CardContent>
    </Card>
  );
}

function Reports({ reports }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('Todos');
  const filtered = useMemo(() => reports.filter((report) => {
    const matchesText = `${report.street} ${report.community} ${report.description}`.toLowerCase().includes(query.toLowerCase());
    return matchesText && (status === 'Todos' || report.status === status);
  }), [reports, query, status]);
  return (
    <section className="reports-section anchor-section" id="reportes">
      <Container maxWidth="lg">
        <SectionHeading eyebrow="EN NUESTRAS CALLES" title="Reportes de la" highlight="comunidad" description="Consulta los reportes compartidos y conoce su estado." action={<Button className="outline-button" onClick={() => scrollTo('reportar')}> <AddLocationAltOutlinedIcon /> Nuevo reporte</Button>} />
        <div className="report-filters">
          <TextField value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por calle, colonia..." aria-label="Buscar reportes" InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon /></InputAdornment> }} />
          <FormControl className="filter-select"><InputLabel id="filter-status-label">Estado</InputLabel><Select labelId="filter-status-label" value={status} label="Estado" onChange={(event) => setStatus(event.target.value)}>{['Todos', 'Pendiente', 'En revisión', 'Atendido'].map((value) => <MenuItem value={value} key={value}>{value}</MenuItem>)}</Select></FormControl>
        </div>
        {filtered.length ? <div className="reports-grid">{filtered.map((report) => <ReportCard key={report.id} report={report} />)}</div> : <div className="empty-state"><SearchRoundedIcon /><b>No encontramos reportes</b><span>Prueba con otra búsqueda o cambia el filtro.</span></div>}
        <div className="results-note">Mostrando {filtered.length} de {reports.length} reportes · Información guardada en este navegador</div>
      </Container>
    </section>
  );
}

const mapPins = [
  { x: 27, y: 62 }, { x: 44, y: 39 }, { x: 58, y: 55 },
  { x: 70, y: 29 }, { x: 77, y: 68 }, { x: 38, y: 78 },
];

function MapSection({ reports }) {
  const [selected, setSelected] = useState(null);
  return (
    <section className="map-section anchor-section" id="mapa">
      <Container maxWidth="lg">
        <SectionHeading eyebrow="UBICACIÓN DE REPORTES" title="Cada punto" highlight="cuenta." description="Una vista demostrativa de reportes registrados en distintas zonas." />
        <div className="map-layout">
          <div className="map-canvas">
            <div className="map-wash" />
            <div className="map-grid-lines" />
            <div className="map-water">ANGOSTURA</div>
            <div className="map-label label-one">Centro</div><div className="map-label label-two">Alhuey</div><div className="map-label label-three">La Reforma</div><div className="map-label label-four">Palmitas</div>
            <div className="map-road road-main" /><div className="map-road road-secondary" /><div className="map-road road-third" />
            {mapPins.slice(0, Math.min(6, reports.length)).map((pin, index) => {
              const status = reports[index].status;
              return <button key={reports[index].id} aria-label={`Ver reporte ${reports[index].id}`} className={`map-pin ${status === 'Atendido' ? 'pin-done' : status === 'En revisión' ? 'pin-review' : ''} ${selected === index ? 'pin-selected' : ''}`} style={{ left: `${pin.x}%`, top: `${pin.y}%` }} onClick={() => setSelected(selected === index ? null : index)}><FmdGoodOutlinedIcon /></button>;
            })}
            {selected !== null && reports[selected] && <div className="map-tooltip" style={{ left: `${mapPins[selected].x}%`, top: `${mapPins[selected].y}%` }}><b>{reports[selected].street}</b><span>{reports[selected].status} · Ubicación aproximada</span></div>}
            <div className="map-simulation"><InfoOutlinedIcon /> Representación simulada · Sin conexión a mapas</div>
          </div>
          <aside className="map-aside">
            <span className="section-eyebrow">ANGOSTURA Y SUS COMUNIDADES</span>
            <h3>La información<br />nos une.</h3>
            <p>Esta vista es una demostración visual. Los puntos representan reportes de ejemplo y no corresponden a ubicaciones verificadas.</p>
            <div className="map-legend"><span><i className="legend-pending" />Pendiente</span><span><i className="legend-review" />En revisión</span><span><i className="legend-done" />Atendido</span></div>
            <Button className="map-link" onClick={() => scrollTo('reportes')}>Explorar reportes <ArrowForwardRoundedIcon /></Button>
          </aside>
        </div>
      </Container>
    </section>
  );
}

function Statistics({ reports }) {
  const counts = [
    { title: 'Reportes recibidos', value: reports.length, icon: <TrendingUpRoundedIcon />, tone: 'blue' },
    { title: 'Pendientes', value: reports.filter((r) => r.status === 'Pendiente').length, icon: <PendingActionsRoundedIcon />, tone: 'orange' },
    { title: 'En revisión', value: reports.filter((r) => r.status === 'En revisión').length, icon: <VisibilityOutlinedIcon />, tone: 'purple' },
    { title: 'Atendidos', value: reports.filter((r) => r.status === 'Atendido').length, icon: <CheckCircleOutlineRoundedIcon />, tone: 'green' },
  ];
  return (
    <section className="stats-section anchor-section" id="estadisticas">
      <Container maxWidth="lg">
        <SectionHeading eyebrow="TRANSPARENCIA COMUNITARIA" title="Cada reporte" highlight="suma." description="Seguimiento claro para que la comunidad conozca el avance." />
        <div className="stats-grid">{counts.map((item) => <Card className={`stat-card ${item.tone}`} elevation={0} key={item.title}><div className="stat-top"><span className="stat-icon">{item.icon}</span><span className="stat-trend">EN TOTAL</span></div><b className="stat-number">{item.value.toString().padStart(2, '0')}</b><span className="stat-title">{item.title}</span></Card>)}</div>
        <p className="stats-footnote"><InfoOutlinedIcon /> Estadísticas calculadas a partir de los datos guardados en este navegador.</p>
      </Container>
    </section>
  );
}

function About() {
  return (
    <section className="about-section anchor-section" id="informacion">
      <Container maxWidth="lg">
        <div className="about-panel">
          <div className="about-icon"><FavoriteBorderRoundedIcon /></div>
          <div className="about-copy"><span className="section-eyebrow">HECHO PARA NUESTRA COMUNIDAD</span><h2>Una calle mejor<br />empieza <em>contigo.</em></h2><p>Bache Report Angostura es una iniciativa comunitaria de demostración para registrar y consultar problemas en las calles. Facilita compartir información y dar visibilidad a cada reporte.</p><div className="about-features"><span><CheckCircleOutlineRoundedIcon />Registro fácil</span><span><CheckCircleOutlineRoundedIcon />Seguimiento visible</span><span><CheckCircleOutlineRoundedIcon />Datos en tu navegador</span></div></div>
          <div className="about-note"><ConstructionRoundedIcon /><b>Importante</b><span>Esta aplicación es una demostración independiente. No es un canal oficial ni envía reportes al Ayuntamiento.</span></div>
        </div>
      </Container>
    </section>
  );
}

function Footer() {
  return <footer className="footer"><Container maxWidth="lg"><div className="footer-main"><Brand compact /><span>Una iniciativa comunitaria para imaginar mejores caminos.</span><a href="#inicio">Volver arriba ↑</a></div><Divider /><div className="footer-bottom"><span>© 2026 Bache Report Angostura</span><span>Demo frontend · Sin conexión con el Ayuntamiento</span></div></Container></footer>;
}

export default function App() {
  const [reports, setReports] = useState(readReports);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const notify = (message, severity = 'success') => setToast({ open: true, message, severity });
  const addReport = (details) => {
    const report = { ...details, id: `BA-${Date.now().toString().slice(-6)}`, status: 'Pendiente', createdAt: new Date().toISOString() };
    const updated = [report, ...reports];
    try {
      saveReports(updated);
      setReports(updated);
      notify('¡Reporte registrado! Ya puedes consultarlo en la lista de reportes.');
      setTimeout(() => scrollTo('reportes'), 450);
      return true;
    } catch {
      notify('No se pudo guardar el reporte en este navegador. Libera espacio y vuelve a intentarlo.', 'error');
      return false;
    }
  };
  return (
    <Box className="app-shell">
      <Header />
      <main>
        <Hero reports={reports} />
        <div className="trust-strip"><Container maxWidth="lg"><span><CheckCircleOutlineRoundedIcon /> Sin registro de cuenta</span><i /><span><ShieldOutlinedIcon /> Datos guardados localmente</span><i /><span><FavoriteBorderRoundedIcon /> Construido en comunidad</span></Container></div>
        <ReportForm onSubmit={addReport} notify={notify} />
        <Reports reports={reports} />
        <MapSection reports={reports} />
        <Statistics reports={reports} />
        <About />
      </main>
      <Footer />
      <Snackbar open={toast.open} autoHideDuration={5000} onClose={() => setToast({ ...toast, open: false })} anchorOrigin={{ vertical: isSmall ? 'top' : 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setToast({ ...toast, open: false })} severity={toast.severity} variant="filled" className="toast-alert">{toast.message}</Alert>
      </Snackbar>
    </Box>
  );
}
