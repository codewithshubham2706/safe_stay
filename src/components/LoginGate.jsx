import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { loginUser, registerUser } from '../services/apiService';
import { ShieldCheck, Lock, Smartphone, User, Key, Sparkles, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function LoginGate({ onLoginSuccess }) {
  const { login } = useAuth();
  const [isDark, setIsDark] = React.useState(() => document.body.classList.contains('theme-dark'));

  // Track theme changes live so the login page re-renders in the active theme
  React.useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.body.classList.contains('theme-dark'));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [role, setRole] = useState('student');
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('Female');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [persistMobile, setPersistMobile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = mode === 'signup'
        ? await registerUser({ fullName, email, password, role, gender })
        : await loginUser(email, password, role);
      if (data?.token) {
        login(data.user, data.token, persistMobile);
        if (onLoginSuccess) onLoginSuccess(data.user);
      } else {
        setError('Authentication failed. Please check credentials.');
      }
    } catch (err) {
      setError(err.message || (mode === 'signup' ? 'Registration failed. Please try again.' : 'Login failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (demoRole) => {
    setLoading(true);
    setError(null);
    const demoEmail = demoRole === 'student'
      ? 'student@safestay.edu'
      : demoRole === 'landlord'
        ? 'landlord@safestay.com'
        : 'admin@safestay.gov';
    try {
      const data = await loginUser(demoEmail, 'Demo123!', demoRole);
      login(data.user, data.token, persistMobile);
      if (onLoginSuccess) onLoginSuccess(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { id: 'student',  label: '🎓 Student',  color: '#6366f1' },
    { id: 'landlord', label: '🏠 Landlord', color: '#06b6d4' },
    { id: 'admin',    label: '🛡️ Admin',   color: '#10b981' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: isDark
        ? 'linear-gradient(135deg, #0b0f19 0%, #111827 50%, #0b1220 100%)'
        : 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0fdf4 100%)',
      fontFamily: 'var(--font-sans)',
    }}>
      {/* Left decorative panel */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 48px',
        background: 'linear-gradient(160deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
        position: 'relative',
        overflow: 'hidden',
      }} className="hide-mobile">
        {/* Decorative circles */}
        <div style={{ position:'absolute', width:300, height:300, borderRadius:'50%', background:'rgba(255,255,255,0.06)', top:-80, right:-80 }}/>
        <div style={{ position:'absolute', width:200, height:200, borderRadius:'50%', background:'rgba(255,255,255,0.06)', bottom:-40, left:-60 }}/>
        <div style={{ position:'absolute', width:150, height:150, borderRadius:'50%', background:'rgba(255,255,255,0.05)', bottom:100, right:-30 }}/>

        <ShieldCheck size={64} color="rgba(255,255,255,0.9)" style={{ marginBottom: 32 }} />
        <h2 style={{ fontSize:32, fontFamily:'var(--font-heading)', color:'#fff', textAlign:'center', marginBottom:16, lineHeight:1.2 }}>
          Project Safe-Stay
        </h2>
        <p style={{ fontSize:16, color:'rgba(255,255,255,0.80)', textAlign:'center', lineHeight:1.7, maxWidth:320 }}>
          AI-powered structural safety audit, spatial discovery &amp; verified accommodation for students across India.
        </p>

        <div style={{ marginTop:48, display:'flex', flexDirection:'column', gap:16, width:'100%', maxWidth:320 }}>
          {[
            { icon:'🛡️', text:'Structural Vulnerability Index (SVI)' },
            { icon:'🤖', text:'AI Lifestyle & Budget Concierge' },
            { icon:'🗺️', text:'Google Maps Spatial Discovery' },
            { icon:'🚨', text:'Emergency SOS Network' },
          ].map((f,i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:12, background:'rgba(255,255,255,0.12)', padding:'12px 16px', borderRadius:12 }}>
              <span style={{ fontSize:22 }}>{f.icon}</span>
              <span style={{ fontSize:14, color:'#fff', fontWeight:500 }}>{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right login form */}
      <div className="login-form-panel" style={{
        width: '100%',
        maxWidth: 480,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '48px 40px',
        background: 'var(--panel-solid)',
        boxShadow: '-8px 0 40px rgba(0,0,0,0.06)',
      }}>
        {/* Mobile logo */}
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:32 }}>
          <div style={{
            width:44, height:44, borderRadius:12,
            background:'linear-gradient(135deg,#6366f1,#8b5cf6)',
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow:'0 4px 14px rgba(99,102,241,0.35)',
          }}>
            <ShieldCheck size={26} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize:20, fontFamily:'var(--font-heading)', color:'var(--text-primary)', margin:0 }}>Safe-Stay</h1>
            <p style={{ fontSize:12, color:'var(--accent-indigo)', margin:0, fontWeight:600 }}>AI Structural Safety Platform</p>
          </div>
        </div>

        <h2 style={{ fontSize:26, fontFamily:'var(--font-heading)', color:'var(--text-primary)', marginBottom:6 }}>
          {mode === 'signup' ? 'Create your account 🛡️' : 'Welcome back 👋'}
        </h2>
        <p style={{ fontSize:14, color:'var(--text-secondary)', marginBottom:28 }}>
          {mode === 'signup' ? 'Register to save audits, report safely and use the AI concierge.' : 'Sign in to access live safety data and the AI concierge.'}
        </p>

        {/* Mode Tabs: Sign In / Sign Up */}
        <div style={{ display:'flex', background:'var(--bg-chip)', borderRadius:12, padding:4, marginBottom:16, gap:4 }}>
          {[['signin', 'Sign In'], ['signup', 'Create Account']].map(([m, lbl]) => (
            <button key={m} type="button" onClick={() => { setMode(m); setError(null); }}
              style={{
                flex:1, padding:'8px 8px', borderRadius:9, border:'none',
                fontSize:13, fontWeight:700, cursor:'pointer',
                background: mode === m ? 'var(--panel-solid)' : 'transparent',
                color: mode === m ? '#6366f1' : 'var(--text-secondary)',
                transition:'all 0.2s ease',
              }}>{lbl}</button>
          ))}
        </div>

        {/* Role Tabs */}
        <div style={{ display:'flex', background:'var(--bg-chip)', borderRadius:12, padding:4, marginBottom:24, gap:4 }}>
          {roles.map(r => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRole(r.id)}
              style={{
                flex:1, padding:'9px 8px', borderRadius:9, border:'none',
                fontSize:13, fontWeight:700, cursor:'pointer',
                background: role === r.id ? 'var(--panel-solid)' : 'transparent',
                color: role === r.id ? r.color : 'var(--text-secondary)',
                boxShadow: role === r.id ? '0 1px 4px rgba(0,0,0,0.10)' : 'none',
                transition:'all 0.2s ease',
              }}
            >{r.label}</button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div style={{
            display:'flex', alignItems:'center', gap:8,
            padding:'11px 14px', borderRadius:10, marginBottom:16,
            background:'var(--bg-danger-soft)', border:'1px solid var(--border-danger-soft)', color:'var(--text-danger-strong)', fontSize:13,
          }}>
            <AlertCircle size={16} style={{ flexShrink:0 }} /> {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {mode === 'signup' && (
            <div>
              <label style={{ display:'block', fontSize:13, fontWeight:600, color:'var(--text-label)', marginBottom:6 }}>Full Name</label>
              <input
                type="text"
                placeholder="Your full name"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="field-input"
              />
            </div>
          )}

          <div>
            <label style={{ display:'block', fontSize:13, fontWeight:600, color:'var(--text-label)', marginBottom:6 }}>Email</label>
            <div style={{ position:'relative' }}>
              <User size={16} color="#94a3b8" style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)' }} />
              <input
                type="email"
                placeholder={role === 'student' ? 'student@university.edu' : 'owner@example.com'}
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="field-input"
                style={{ paddingLeft:38 }}
              />
            </div>
          </div>

          <div>
            <label style={{ display:'block', fontSize:13, fontWeight:600, color:'var(--text-label)', marginBottom:6 }}>Password</label>
            <div style={{ position:'relative' }}>
              <Key size={16} color="#94a3b8" style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="field-input"
                style={{ paddingLeft:38, paddingRight:42 }}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                style={{ position:'absolute', right:13, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#94a3b8', padding:0 }}>
                {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
              </button>
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label style={{ display:'block', fontSize:13, fontWeight:600, color:'var(--text-label)', marginBottom:6 }}>Gender</label>
              <select value={gender} onChange={e => setGender(e.target.value)} className="field-input">
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
          )}

          {/* Session Mode */}
          <div style={{ background:'var(--bg-info-soft)', border:'1px solid var(--border-info-soft)', borderRadius:10, padding:'12px 14px' }}>
            <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', fontSize:13 }}>
              <input type="checkbox" checked={persistMobile} onChange={e => setPersistMobile(e.target.checked)} style={{ accentColor:'#6366f1', width:16, height:16 }} />
              <Smartphone size={15} color="#6366f1" />
              <span style={{ fontWeight:600, color:'var(--text-info-strong)' }}>Mobile Persistent Session</span>
            </label>
            <p style={{ fontSize:11, color:'var(--text-secondary)', marginTop:5, paddingLeft:24 }}>
              {!persistMobile
                ? '🔒 Web Privacy Mode: Session cleared instantly on tab close (cyber-café safe).'
                : '📱 Mobile Mode: Credentials persist across device restarts (FlutterSecureStorage).'}
            </p>
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ width:'100%', justifyContent:'center', padding:'13px', fontSize:15 }}>
            {loading
              ? (mode === 'signup' ? 'Creating account…' : 'Authenticating…')
              : mode === 'signup'
                ? `Create ${role.charAt(0).toUpperCase()+role.slice(1)} Account`
                : `Sign In as ${role.charAt(0).toUpperCase()+role.slice(1)}`}
          </button>
        </form>

        {/* Quick Demo */}
        <div style={{ marginTop:24 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
            <div style={{ flex:1, height:1, background:'var(--border-base)' }} />
            <span style={{ fontSize:12, color:'var(--text-muted)', fontWeight:600, whiteSpace:'nowrap' }}>OR QUICK DEMO</span>
            <div style={{ flex:1, height:1, background:'var(--border-base)' }} />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
            {roles.map(r => (
              <button key={r.id} onClick={() => handleQuickDemo(r.id)} className="btn-secondary"
                style={{ justifyContent:'center', padding:'9px 6px', fontSize:12 }}>
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <p style={{ textAlign:'center', fontSize:11, color:'var(--text-muted)', marginTop:28 }}>
          Protected by dual-session privacy architecture &copy; Safe-Stay 2026
        </p>
      </div>
    </div>
  );
}
