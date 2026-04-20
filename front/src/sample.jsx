import { useState, useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────────
// CONFIG — меняй под свой бэкенд
// ─────────────────────────────────────────────
const API_BASE = "http://localhost:8000";

// ─────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Barlow:wght@300;400;500;600&family=Barlow+Condensed:wght@400;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg:#0d0d0d; --bg2:#131313; --bg3:#191919; --bg-input:#0f0f0f;
    --red:#8b0000; --red-mid:#b01212; --red-hi:#cc1a1a; --red-bright:#e02424;
    --dim:#272727; --dim2:#3a3a3a; --muted:#666; --text:#d0d0d0;
    --green:#1a7a1a; --green-hi:#30c030; --radius:3px;
  }
  html,body,#root { height:100%; background:var(--bg); color:var(--text); font-family:'Barlow',sans-serif; font-size:14px; overflow-x:hidden; }
  input,button,select,textarea { font-family:inherit; }
  ::-webkit-scrollbar { width:4px; }
  ::-webkit-scrollbar-track { background:var(--bg2); }
  ::-webkit-scrollbar-thumb { background:var(--red); border-radius:2px; }
  #particles-canvas { position:fixed; inset:0; z-index:0; pointer-events:none; }
  .app-root { position:relative; z-index:1; min-height:100vh; display:flex; flex-direction:column; }

  /* NAV */
  .nav { display:flex; align-items:center; padding:0 24px; height:48px; background:var(--bg2); border-bottom:2px solid var(--red); flex-shrink:0; }
  .nav-logo { font-family:'Share Tech Mono',monospace; font-size:12px; letter-spacing:4px; color:var(--red-hi); text-transform:uppercase; margin-right:28px; }
  .nav-logo em { color:var(--text); font-style:normal; }
  .nav-tabs { display:flex; gap:2px; flex:1; }
  .nav-tab { font-family:'Barlow Condensed',sans-serif; font-size:10px; font-weight:700; letter-spacing:2.5px; text-transform:uppercase; padding:6px 16px; background:transparent; border:1px solid transparent; color:var(--muted); cursor:pointer; border-radius:var(--radius); transition:all .15s; }
  .nav-tab:hover { color:var(--text); border-color:var(--dim2); }
  .nav-tab.active { border-color:var(--red); color:var(--red-hi); background:rgba(139,0,0,.12); }
  .nav-right { display:flex; align-items:center; gap:14px; margin-left:auto; }
  .nav-user { font-family:'Share Tech Mono',monospace; font-size:10px; color:var(--muted); letter-spacing:1px; }
  .nav-user strong { color:var(--red-hi); }
  .btn-logout { font-family:'Barlow Condensed',sans-serif; font-size:10px; font-weight:700; letter-spacing:2px; text-transform:uppercase; padding:5px 12px; background:transparent; border:1px solid var(--red); color:var(--red-hi); cursor:pointer; border-radius:var(--radius); transition:all .15s; }
  .btn-logout:hover { background:var(--red); color:#fff; }

  /* LOGIN */
  .login-page { flex:1; display:flex; align-items:center; justify-content:center; }
  .login-wrap { width:360px; }
  .login-kicker { font-family:'Share Tech Mono',monospace; font-size:10px; letter-spacing:4px; color:var(--red-hi); text-transform:uppercase; margin-bottom:6px; }
  .login-title { font-family:'Barlow Condensed',sans-serif; font-size:38px; font-weight:700; letter-spacing:-1px; color:var(--text); line-height:1; margin-bottom:6px; }
  .login-title span { color:var(--red-hi); }
  .login-sub { font-size:12px; color:var(--muted); margin-bottom:24px; }
  .card { background:var(--bg3); border:1px solid var(--dim); border-top:2px solid var(--red); border-radius:var(--radius); padding:26px; }
  .field { margin-bottom:14px; }
  .field-label { font-family:'Barlow Condensed',sans-serif; font-size:10px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:var(--muted); margin-bottom:6px; }
  .field-input { width:100%; background:var(--bg-input); border:1px solid var(--dim); color:var(--text); font-family:'Share Tech Mono',monospace; font-size:13px; letter-spacing:1px; padding:9px 12px; border-radius:var(--radius); outline:none; transition:border-color .15s; }
  .field-input:focus { border-color:var(--red-mid); }
  .field-input.err { border-color:var(--red-bright); }
  .error-box { display:flex; align-items:center; gap:8px; background:rgba(204,26,26,.1); border:1px solid var(--red); border-left:3px solid var(--red-bright); padding:9px 12px; border-radius:var(--radius); font-family:'Share Tech Mono',monospace; font-size:11px; color:var(--red-bright); letter-spacing:.3px; margin-bottom:14px; }
  .btn-primary { width:100%; padding:10px; background:var(--red); border:1px solid var(--red-mid); color:#fff; font-family:'Barlow Condensed',sans-serif; font-size:11px; font-weight:700; letter-spacing:3px; text-transform:uppercase; cursor:pointer; border-radius:var(--radius); transition:background .15s; margin-top:4px; }
  .btn-primary:hover:not(:disabled) { background:var(--red-mid); }
  .btn-primary:disabled { background:var(--dim); border-color:var(--dim); color:var(--muted); cursor:not-allowed; }
  .login-footer { margin-top:14px; font-size:11px; color:var(--muted); text-align:center; letter-spacing:.3px; }

  /* PAGE */
  .page-body { flex:1; padding:24px 28px; }
  .page-heading { display:flex; align-items:center; gap:10px; font-family:'Barlow Condensed',sans-serif; font-size:10px; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:var(--muted); padding-bottom:12px; margin-bottom:20px; border-bottom:1px solid var(--dim); }
  .page-heading::before { content:''; display:inline-block; width:7px; height:7px; border-radius:50%; background:var(--red-hi); }

  /* SEARCH */
  .search-row { display:flex; gap:8px; margin-bottom:18px; }
  .search-input { flex:1; background:var(--bg3); border:1px solid var(--dim); border-left:3px solid var(--red); color:var(--text); font-family:'Share Tech Mono',monospace; font-size:13px; letter-spacing:.5px; padding:10px 14px; border-radius:var(--radius); outline:none; transition:border-color .15s; }
  .search-input:focus { border-color:var(--red-mid); border-left-color:var(--red-bright); }
  .search-input::placeholder { color:var(--muted); }
  .btn-search { padding:10px 22px; background:var(--red); border:1px solid var(--red-mid); color:#fff; font-family:'Barlow Condensed',sans-serif; font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase; cursor:pointer; border-radius:var(--radius); transition:background .15s; white-space:nowrap; min-width:80px; }
  .btn-search:hover:not(:disabled) { background:var(--red-mid); }
  .btn-search:disabled { background:var(--dim); border-color:var(--dim); color:var(--muted); cursor:not-allowed; }
  .results-label { font-family:'Share Tech Mono',monospace; font-size:10px; letter-spacing:2px; color:var(--muted); text-transform:uppercase; margin-bottom:10px; display:flex; align-items:center; gap:8px; }
  .results-label span { color:var(--red-hi); }
  .file-list { display:flex; flex-direction:column; gap:5px; }
  .file-item { display:flex; align-items:center; gap:12px; padding:11px 14px; background:var(--bg3); border:1px solid var(--dim); border-radius:var(--radius); transition:border-color .15s; }
  .file-item:hover { border-color:var(--dim2); }
  .file-ext { font-family:'Share Tech Mono',monospace; font-size:9px; text-transform:uppercase; letter-spacing:1px; padding:3px 6px; border-radius:2px; border:1px solid var(--dim2); color:var(--muted); min-width:40px; text-align:center; }
  .file-ext.pdf  { border-color:#7a3000; color:#c07030; }
  .file-ext.docx { border-color:#0a2a7a; color:#3060cc; }
  .file-ext.img  { border-color:#0a5a0a; color:#30a030; }
  .file-name { flex:1; font-size:13px; font-weight:500; color:var(--text); }
  .file-score { font-family:'Share Tech Mono',monospace; font-size:10px; color:var(--green-hi); border:1px solid var(--green); border-radius:2px; padding:2px 6px; }
  .badge-secret { font-family:'Barlow Condensed',sans-serif; font-size:9px; font-weight:700; letter-spacing:2px; text-transform:uppercase; padding:2px 8px; background:rgba(139,0,0,.18); border:1px solid var(--red); color:var(--red-hi); border-radius:var(--radius); }
  .file-date { font-family:'Share Tech Mono',monospace; font-size:10px; color:var(--muted); }

  /* LOADER */
  .loader-grid { display:grid; grid-template-columns:1fr 1fr; gap:18px; align-items:start; }
  @media(max-width:780px) { .loader-grid { grid-template-columns:1fr; } }
  .panel { background:var(--bg3); border:1px solid var(--dim); border-top:2px solid var(--red); border-radius:var(--radius); padding:22px; }
  .panel-title { font-family:'Barlow Condensed',sans-serif; font-size:10px; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:var(--muted); margin-bottom:18px; padding-bottom:10px; border-bottom:1px solid var(--dim); display:flex; align-items:center; gap:8px; }
  .drop-zone { border:1px dashed var(--dim2); border-radius:var(--radius); padding:30px 16px; text-align:center; cursor:pointer; transition:all .2s; margin-bottom:12px; }
  .drop-zone:hover,.drop-zone.over { border-color:var(--red-mid); background:rgba(139,0,0,.06); }
  .drop-zone.disabled { opacity:.45; cursor:not-allowed; }
  .drop-icon { font-family:'Share Tech Mono',monospace; font-size:24px; color:var(--muted); margin-bottom:8px; }
  .drop-text { font-size:12px; color:var(--muted); line-height:1.5; }
  .drop-text strong { color:var(--text); }
  .drop-formats { font-family:'Share Tech Mono',monospace; font-size:10px; color:var(--red-hi); margin-top:6px; letter-spacing:1px; }
  .secret-toggle { display:flex; align-items:center; gap:10px; padding:10px 12px; background:rgba(139,0,0,.07); border:1px solid var(--red); border-radius:var(--radius); margin-bottom:12px; cursor:pointer; user-select:none; }
  .secret-toggle.disabled { opacity:.45; cursor:not-allowed; }
  .secret-check { width:15px; height:15px; border:1px solid var(--red-mid); border-radius:2px; background:transparent; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:background .15s; }
  .secret-check.on { background:var(--red); }
  .secret-check-mark { color:#fff; font-size:10px; line-height:1; }
  .secret-lbl { font-family:'Barlow Condensed',sans-serif; font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:var(--red-hi); }
  .secret-hint { font-size:11px; color:var(--muted); margin-left:auto; }
  .file-queue { display:flex; flex-direction:column; gap:4px; margin-bottom:12px; }
  .queue-item { display:flex; align-items:center; gap:8px; padding:7px 10px; background:var(--bg-input); border:1px solid var(--dim); border-radius:var(--radius); }
  .queue-name { flex:1; font-family:'Share Tech Mono',monospace; font-size:11px; color:var(--text); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .queue-size { font-family:'Share Tech Mono',monospace; font-size:10px; color:var(--muted); }
  .queue-rm { background:transparent; border:none; color:var(--muted); cursor:pointer; font-size:13px; padding:0 2px; transition:color .1s; }
  .queue-rm:hover { color:var(--red-bright); }
  .progress-bar { height:2px; background:var(--dim); border-radius:1px; margin-bottom:12px; overflow:hidden; }
  .progress-fill { height:100%; background:var(--red-hi); transition:width .3s; }
  .btn-upload { width:100%; padding:10px; background:var(--red); border:1px solid var(--red-mid); color:#fff; font-family:'Barlow Condensed',sans-serif; font-size:11px; font-weight:700; letter-spacing:3px; text-transform:uppercase; cursor:pointer; border-radius:var(--radius); transition:background .15s; }
  .btn-upload:hover:not(:disabled) { background:var(--red-mid); }
  .btn-upload:disabled { background:var(--dim); border-color:var(--dim); color:var(--muted); cursor:not-allowed; }
  .manage-list { display:flex; flex-direction:column; gap:5px; max-height:460px; overflow-y:auto; }
  .manage-item { display:flex; align-items:center; gap:8px; padding:9px 11px; background:var(--bg-input); border:1px solid var(--dim); border-radius:var(--radius); transition:border-color .15s; }
  .manage-item:hover { border-color:var(--dim2); }
  .manage-name { flex:1; font-family:'Share Tech Mono',monospace; font-size:11px; color:var(--text); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .mbadge { font-family:'Barlow Condensed',sans-serif; font-size:9px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; padding:2px 6px; border-radius:2px; }
  .mbadge.sec { background:rgba(139,0,0,.2); border:1px solid var(--red); color:var(--red-hi); }
  .mbadge.pub { background:rgba(40,40,40,.8); border:1px solid var(--dim2); color:var(--muted); }
  .btn-sm { font-family:'Barlow Condensed',sans-serif; font-size:10px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; padding:4px 10px; background:transparent; border:1px solid var(--dim2); color:var(--muted); cursor:pointer; border-radius:var(--radius); transition:all .15s; white-space:nowrap; }
  .btn-sm:hover { border-color:var(--red-mid); color:var(--text); }
  .btn-sm.del:hover { border-color:var(--red-bright); color:var(--red-bright); background:rgba(204,26,26,.08); }

  /* MODAL */
  .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,.72); z-index:500; display:flex; align-items:center; justify-content:center; }
  .modal-box { background:var(--bg3); border:1px solid var(--dim); border-top:2px solid var(--red-bright); border-radius:var(--radius); padding:24px; width:340px; }
  .modal-title { font-family:'Barlow Condensed',sans-serif; font-size:13px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:var(--red-bright); margin-bottom:10px; }
  .modal-body { font-size:13px; color:var(--text); margin-bottom:20px; line-height:1.5; }
  .modal-actions { display:flex; gap:8px; justify-content:flex-end; }
  .btn-cancel { font-family:'Barlow Condensed',sans-serif; font-size:10px; font-weight:700; letter-spacing:2px; text-transform:uppercase; padding:7px 14px; background:transparent; border:1px solid var(--dim2); color:var(--muted); cursor:pointer; border-radius:var(--radius); transition:all .15s; }
  .btn-cancel:hover { border-color:var(--text); color:var(--text); }
  .btn-confirm-del { font-family:'Barlow Condensed',sans-serif; font-size:10px; font-weight:700; letter-spacing:2px; text-transform:uppercase; padding:7px 14px; background:var(--red); border:1px solid var(--red-mid); color:#fff; cursor:pointer; border-radius:var(--radius); transition:background .15s; }
  .btn-confirm-del:hover { background:var(--red-bright); }

  /* SPINNER */
  .spin { display:inline-block; width:10px; height:10px; border:2px solid var(--dim2); border-top-color:var(--red-hi); border-radius:50%; animation:spin .6s linear infinite; }
  @keyframes spin { to { transform:rotate(360deg); } }

  /* TOAST */
  .toast { position:fixed; bottom:20px; right:20px; z-index:999; padding:11px 16px; background:var(--bg3); border:1px solid var(--dim); border-left:3px solid var(--red-hi); border-radius:var(--radius); font-family:'Share Tech Mono',monospace; font-size:12px; color:var(--text); opacity:0; transform:translateY(8px); transition:all .22s; pointer-events:none; max-width:320px; }
  .toast.show { opacity:1; transform:translateY(0); }
  .toast.ok   { border-left-color:var(--green-hi); }
  .toast.err-t { border-left-color:var(--red-bright); color:var(--red-bright); }

  /* STATUS BAR */
  .status-bar { display:flex; align-items:center; gap:14px; padding:5px 28px; background:var(--bg2); border-top:1px solid var(--dim); font-family:'Share Tech Mono',monospace; font-size:10px; color:var(--muted); letter-spacing:1px; flex-shrink:0; }
  .status-dot { width:6px; height:6px; border-radius:50%; background:var(--red-hi); animation:pulse 2s ease-in-out infinite; }
  .status-dot.ok  { background:var(--green-hi); animation:none; }
  .status-dot.err { background:var(--red-bright); animation:none; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }

  .empty-state { font-family:'Share Tech Mono',monospace; font-size:12px; color:var(--muted); padding:20px 0; letter-spacing:1px; }
`;

// ─────────────────────────────────────────────
// PARTICLES
// ─────────────────────────────────────────────
function ParticlesBg() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current, ctx = c.getContext("2d");
    let raf;
    const N = 38, MAX = 320;
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const dots = Array.from({ length: N }, () => ({
      x: Math.random() * c.width, y: Math.random() * c.height,
      vx: (Math.random() - .5) * .45, vy: (Math.random() - .5) * .45,
      r: 3 + Math.random() * 3,
    }));
    function draw() {
      const W = c.width, H = c.height;
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
        const dx = dots[i].x - dots[j].x, dy = dots[i].y - dots[j].y, d = Math.hypot(dx, dy);
        if (d < MAX) { ctx.beginPath(); ctx.strokeStyle = `rgba(160,20,20,${(1 - d / MAX) * .38})`; ctx.lineWidth = .9; ctx.moveTo(dots[i].x, dots[i].y); ctx.lineTo(dots[j].x, dots[j].y); ctx.stroke(); }
      }
      for (const d of dots) {
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(160,20,20,0.42)"; ctx.fill();
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0 || d.x > W) d.vx *= -1;
        if (d.y < 0 || d.y > H) d.vy *= -1;
      }
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(raf); };
  }, []);
  return <canvas ref={ref} id="particles-canvas" />;
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function extType(name = "") {
  const e = name.split(".").pop().toLowerCase();
  if (e === "pdf") return "pdf";
  if (["docx", "doc"].includes(e)) return "docx";
  return "img";
}

// ─────────────────────────────────────────────
// API
// ─────────────────────────────────────────────
const hdrs = (token) => ({ "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) });

async function apiLogin(username, password) {
  const r = await fetch(`${API_BASE}/auth/login`, { method: "POST", headers: hdrs(), body: JSON.stringify({ username, password }) });
  if (!r.ok) throw new Error("Неверные учётные данные");
  return r.json(); // { token, is_admin }
}

async function apiSearch(query, token) {
  const r = await fetch(`${API_BASE}/documents/search`, { method: "POST", headers: hdrs(token), body: JSON.stringify({ query, top_k: 10 }) });
  if (!r.ok) throw new Error("Ошибка поиска");
  return r.json(); // [{ id, name, date, secret, score }]
}

async function apiList(token) {
  const r = await fetch(`${API_BASE}/documents`, { headers: hdrs(token) });
  if (!r.ok) throw new Error("Ошибка загрузки списка");
  return r.json(); // [{ id, name, date, secret }]
}

async function apiUpload(files, secret, token) {
  const fd = new FormData();
  for (const f of files) fd.append("files", f);
  fd.append("secret", secret ? "true" : "false");
  const r = await fetch(`${API_BASE}/documents/upload`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd });
  if (!r.ok) throw new Error("Ошибка загрузки файлов");
  return r.json();
}

async function apiDelete(id, token) {
  const r = await fetch(`${API_BASE}/documents/${id}`, { method: "DELETE", headers: hdrs(token) });
  if (!r.ok) throw new Error("Ошибка удаления");
}

async function checkHealth() {
  try { const r = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(2500) }); return r.ok; }
  catch { return false; }
}

// ─────────────────────────────────────────────
// TOAST
// ─────────────────────────────────────────────
function Toast({ msg, type }) {
  return <div className={`toast${msg ? " show" : ""} ${type || ""}`}>{msg}</div>;
}

// ─────────────────────────────────────────────
// CONFIRM MODAL
// ─────────────────────────────────────────────
function ConfirmModal({ text, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-title">// подтверждение удаления</div>
        <div className="modal-body">{text}</div>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onCancel}>Отмена</button>
          <button className="btn-confirm-del" onClick={onConfirm}>Удалить</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [login, setLogin] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!login.trim() || !pass.trim()) { setError("Заполните все поля"); return; }
    setLoading(true); setError("");
    try {
      const data = await apiLogin(login, pass);
      onLogin(login, data.is_admin, data.token);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="login-page">
      <div className="login-wrap">
        <div className="login-kicker">// system access</div>
        <div className="login-title">CORP<span>/</span>VAULT</div>
        <div className="login-sub">Используйте учётные данные, выданные компанией</div>
        <div className="card">
          {error && <div className="error-box">✕ &nbsp;{error}</div>}
          <div className="field">
            <div className="field-label">Логин</div>
            <input className={`field-input${error ? " err" : ""}`} value={login}
              onChange={e => setLogin(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()}
              placeholder="user.name" autoComplete="off" />
          </div>
          <div className="field">
            <div className="field-label">Пароль</div>
            <input className={`field-input${error ? " err" : ""}`} type="password" value={pass}
              onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()}
              placeholder="••••••••••" />
          </div>
          <button className="btn-primary" onClick={submit} disabled={loading}>
            {loading ? "ПРОВЕРКА..." : "ВОЙТИ"}
          </button>
        </div>
        <div className="login-footer">CORP//VAULT · Internal Document System · v2.4.1</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// NAV
// ─────────────────────────────────────────────
function Nav({ username, isAdmin, tab, setTab, onLogout }) {
  return (
    <nav className="nav">
      <div className="nav-logo">CORP<em>//</em>VAULT</div>
      <div className="nav-tabs">
        <button className={`nav-tab${tab === "finder" ? " active" : ""}`} onClick={() => setTab("finder")}>Поиск</button>
        <button className={`nav-tab${tab === "loader" ? " active" : ""}`} onClick={() => setTab("loader")}>Управление</button>
      </div>
      <div className="nav-right">
        <div className="nav-user">Сессия: <strong>{username}{isAdmin ? " [ADMIN]" : ""}</strong></div>
        <button className="btn-logout" onClick={onLogout}>Выйти</button>
      </div>
    </nav>
  );
}

// ─────────────────────────────────────────────
// FINDER
// ─────────────────────────────────────────────
function FinderPage({ token, isAdmin, showToast }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const doSearch = async () => {
    if (!query.trim()) { setResults(null); return; }
    setLoading(true);
    try {
      const data = await apiSearch(query, token);
      setResults(data);
    } catch (e) { showToast(e.message, "err-t"); }
    finally { setLoading(false); }
  };

  const visible = (results ?? []).filter(f => isAdmin || !f.secret);

  return (
    <div className="page-body">
      <div className="page-heading">Семантический поиск документов</div>
      <div className="search-row">
        <input className="search-input" placeholder="Введите запрос — AI найдёт похожие документы..."
          value={query} onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && doSearch()} />
        <button className="btn-search" onClick={doSearch} disabled={loading}>
          {loading ? <span className="spin" /> : "Найти"}
        </button>
      </div>

      {results !== null && (
        <>
          <div className="results-label">
            Результаты: <span>{visible.length}</span>
            {loading && <span className="spin" />}
          </div>
          <div className="file-list">
            {visible.map(f => (
              <div key={f.id} className="file-item">
                <div className={`file-ext ${extType(f.name)}`}>{extType(f.name)}</div>
                <div className="file-name">{f.name}</div>
                {f.secret && <div className="badge-secret">секретно</div>}
                {f.score != null && (
                  <div className="file-score" title="Схожесть">{(f.score * 100).toFixed(1)}%</div>
                )}
                <div className="file-date">{f.date ?? ""}</div>
              </div>
            ))}
            {visible.length === 0 && <div className="empty-state">// документы не найдены</div>}
          </div>
        </>
      )}
      {results === null && !loading && (
        <div className="empty-state">// введите запрос — векторный поиск найдёт релевантные документы</div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// LOADER / MANAGE
// ─────────────────────────────────────────────
function LoaderPage({ token, isAdmin, showToast }) {
  const [queue, setQueue] = useState([]);
  const [secret, setSecret] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [files, setFiles] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [confirm, setConfirm] = useState(null);
  const inputRef = useRef(null);

  const refresh = useCallback(async () => {
    setListLoading(true);
    try { setFiles(await apiList(token)); }
    catch (e) { showToast(e.message, "err-t"); }
    finally { setListLoading(false); }
  }, [token]);

  useEffect(() => { refresh(); }, [refresh]);

  const addFiles = (fl) => setQueue(p => [...p, ...Array.from(fl)]);
  const removeQ = (i) => setQueue(p => p.filter((_, idx) => idx !== i));
  const onDrop = useCallback((e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }, []);

  const upload = async () => {
    if (!isAdmin) { showToast("✕ Нет прав для загрузки файлов", "err-t"); return; }
    setUploading(true); setProgress(15);
    try {
      await apiUpload(queue, secret, token);
      setProgress(100);
      setQueue([]); setSecret(false);
      showToast("✓ Файлы успешно загружены", "ok");
      await refresh();
    } catch (e) { showToast(e.message, "err-t"); }
    finally { setUploading(false); setTimeout(() => setProgress(0), 700); }
  };

  const doDelete = async () => {
    if (!confirm) return;
    try {
      await apiDelete(confirm.id, token);
      setFiles(p => p.filter(f => f.id !== confirm.id));
      showToast("✓ Файл удалён", "ok");
    } catch (e) { showToast(e.message, "err-t"); }
    finally { setConfirm(null); }
  };

  const visible = isAdmin ? files : files.filter(f => !f.secret);

  return (
    <div className="page-body">
      {confirm && (
        <ConfirmModal
          text={`Удалить «${confirm.name}»? Это действие необратимо — документ будет удалён из векторной базы.`}
          onConfirm={doDelete}
          onCancel={() => setConfirm(null)}
        />
      )}
      <div className="page-heading">Управление документами</div>
      <div className="loader-grid">

        {/* Upload */}
        <div className="panel">
          <div className="panel-title">// Добавить документ</div>
          {!isAdmin && (
            <div className="error-box" style={{ marginBottom: 14 }}>
              ⚠ Загрузка доступна только администраторам
            </div>
          )}
          <div
            className={`drop-zone${dragging ? " over" : ""}${!isAdmin ? " disabled" : ""}`}
            onClick={() => isAdmin && inputRef.current.click()}
            onDragOver={e => { e.preventDefault(); if (isAdmin) setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
          >
            <div className="drop-icon">⊞</div>
            <div className="drop-text"><strong>Перетащите файлы</strong> или кликните для выбора</div>
            <div className="drop-formats">PDF · DOCX · ZIP · IMG</div>
          </div>
          <input ref={inputRef} type="file" multiple hidden accept=".pdf,.docx,.zip,.png,.jpg,.jpeg"
            onChange={e => addFiles(e.target.files)} />

          <div className={`secret-toggle${!isAdmin ? " disabled" : ""}`}
            onClick={() => isAdmin && setSecret(s => !s)}>
            <div className={`secret-check${secret ? " on" : ""}`}>
              {secret && <span className="secret-check-mark">✓</span>}
            </div>
            <div className="secret-lbl">Гриф секретности</div>
            <div className="secret-hint">только администраторы</div>
          </div>

          <div className="file-queue">
            {queue.map((f, i) => (
              <div key={i} className="queue-item">
                <div className="queue-name">{f.name}</div>
                <div className="queue-size">{(f.size / 1024).toFixed(1)} KB</div>
                <button className="queue-rm" onClick={() => removeQ(i)}>✕</button>
              </div>
            ))}
          </div>

          {progress > 0 && (
            <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
          )}

          <button className="btn-upload" disabled={queue.length === 0 || uploading || !isAdmin} onClick={upload}>
            {uploading ? "ОБРАБОТКА..." : `Загрузить${queue.length > 0 ? ` (${queue.length})` : ""}`}
          </button>
        </div>

        {/* Manage */}
        <div className="panel">
          <div className="panel-title">
            // Все документы
            {listLoading && <span className="spin" />}
          </div>
          <div className="manage-list">
            {visible.map(f => (
              <div key={f.id} className="manage-item">
                <div className={`file-ext ${extType(f.name)}`} style={{ fontSize: 9, padding: "2px 5px", minWidth: 36 }}>
                  {extType(f.name)}
                </div>
                <div className="manage-name" title={f.name}>{f.name}</div>
                <div className={`mbadge ${f.secret ? "sec" : "pub"}`}>{f.secret ? "сек" : "pub"}</div>
                {isAdmin && (
                  <button className="btn-sm del" onClick={() => setConfirm(f)}>Удалить</button>
                )}
              </div>
            ))}
            {!listLoading && visible.length === 0 && <div className="empty-state">// список пуст</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// STATUS BAR
// ─────────────────────────────────────────────
function StatusBar({ apiOk }) {
  return (
    <div className="status-bar">
      <div className={`status-dot${apiOk === true ? " ok" : apiOk === false ? " err" : ""}`} />
      <span>API BUS: {apiOk === null ? "проверка..." : apiOk ? `${API_BASE} · online` : `${API_BASE} · недоступен`}</span>
      <span style={{ marginLeft: "auto", opacity: .45 }}>CORP//VAULT v2.4.1</span>
    </div>
  );
}

// ─────────────────────────────────────────────
// APP ROOT
// ─────────────────────────────────────────────
export default function App() {
  const [authed, setAuthed] = useState(false);
  const [username, setUsername] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState("");
  const [tab, setTab] = useState("finder");
  const [toast, setToast] = useState({ msg: "", type: "" });
  const [apiOk, setApiOk] = useState(null);

  useEffect(() => {
    if (!document.getElementById("cv-styles")) {
      const s = document.createElement("style");
      s.id = "cv-styles"; s.textContent = GLOBAL_CSS;
      document.head.appendChild(s);
    }
    checkHealth().then(ok => setApiOk(ok));
    const iv = setInterval(() => checkHealth().then(ok => setApiOk(ok)), 15000);
    return () => clearInterval(iv);
  }, []);

  const showToast = useCallback((msg, type = "") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 2800);
  }, []);

  const handleLogin = (u, admin, tk) => { setUsername(u); setIsAdmin(admin); setToken(tk); setAuthed(true); };
  const handleLogout = () => { setAuthed(false); setUsername(""); setIsAdmin(false); setToken(""); };

  return (
    <>
      <ParticlesBg />
      <div className="app-root">
        {!authed ? (
          <LoginPage onLogin={handleLogin} />
        ) : (
          <>
            <Nav username={username} isAdmin={isAdmin} tab={tab} setTab={setTab} onLogout={handleLogout} />
            {tab === "finder" && <FinderPage token={token} isAdmin={isAdmin} showToast={showToast} />}
            {tab === "loader" && <LoaderPage token={token} isAdmin={isAdmin} showToast={showToast} />}
          </>
        )}
        <StatusBar apiOk={apiOk} />
      </div>
      <Toast msg={toast.msg} type={toast.type} />
    </>
  );
}