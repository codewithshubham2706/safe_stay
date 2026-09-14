import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { searchPlacesIndia } from '../services/apiService';
import { FLAGSHIP_CITIES } from '../../server/flagshipCities.js';
import { Search, Sparkles, LogOut, ShieldCheck, Sun, Moon, MapPin, Loader2 } from 'lucide-react';

const FLAGSHIP_NAMES = Object.keys(FLAGSHIP_CITIES);

export default function FloatingNavbar({
  searchQuery, onSearchChange,
  onOpenAIConcierge,
  genderFilter, onGenderFilterChange,
  activeCity, onCityChange,
  onPlaceSelect,
  onFilterByName,
  onTriggerSOS,
  themeMode, onToggleTheme,
}) {
  const { user, logout, isMobileMode } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // ── India-wide place autocomplete ──
  const [placeResults, setPlaceResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [placeLoading, setPlaceLoading] = useState(false);
  const searchBoxRef = useRef(null);

  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setPlaceResults([]);
      setPlaceLoading(false);
      return;
    }
    setPlaceLoading(true);
    const timer = setTimeout(async () => {
      const places = await searchPlacesIndia(searchQuery);
      setPlaceResults(places || []);
      setPlaceLoading(false);
      setShowDropdown(true);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handlePickPlace = (place) => {
    setShowDropdown(false);
    setPlaceResults([]);
    onSearchChange('');
    if (onPlaceSelect) onPlaceSelect(place);
  };

  const handleFilterByName = () => {
    // Keep the typed text as a hostel-name filter (explicit action)
    if (onFilterByName) onFilterByName(searchQuery);
    setShowDropdown(false);
  };

  return (
    <div className="nav-root" style={{
      position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)',
      zIndex: 1000, width: '96%', maxWidth: 1300,
      display: 'flex', flexDirection: 'column', gap: 8, pointerEvents: 'auto',
    }}>
      {/* ── Main Bar ── */}
      <div className="glass-panel" style={{
        padding: '10px 14px',
        display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', rowGap: 8,
        borderRadius: 16,
      }}>
        {/* Brand */}
        <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
          <div style={{
            width:36, height:36, borderRadius:10,
            background:'linear-gradient(135deg,#6366f1,#8b5cf6)',
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow:'0 4px 12px rgba(99,102,241,0.3)',
          }}>
            <ShieldCheck size={20} color="#fff" />
          </div>
          <div style={{ lineHeight:1.15 }}>
            <div style={{ fontSize:15, fontWeight:800, fontFamily:'var(--font-heading)', color:'var(--text-primary)' }}>Safe-Stay</div>
            <div style={{ fontSize:10, color:'#6366f1', fontWeight:700 }}>Structural Safety AI</div>
          </div>
        </div>

        {/* Search — India-wide places with autocomplete */}
        <div ref={searchBoxRef} className="nav-search" style={{ flex:'1 1 200px', minWidth:200, position:'relative', maxWidth:380 }}>
          <Search size={15} color="#94a3b8" style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', zIndex:2 }}/>
          {placeLoading && (
            <Loader2 size={14} color="#6366f1" style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', zIndex:2, animation:'spin 1s linear infinite' }}/>
          )}
          <input
            type="text"
            placeholder="Search any city, area or locality in India…"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            onFocus={() => placeResults.length > 0 && setShowDropdown(true)}
            onKeyDown={e => {
              if (e.key === 'Enter' && placeResults.length > 0) handlePickPlace(placeResults[0]);
              if (e.key === 'Escape') setShowDropdown(false);
            }}
            style={{
              width:'100%', padding:'9px 14px 9px 36px',
              background:'var(--bg-input)', border:'1.5px solid var(--border-base)',
              borderRadius:20, color:'var(--text-primary)', fontSize:13, outline:'none',
            }}
          />
          {showDropdown && (searchQuery?.trim().length >= 2) && (
            <div className="glass-panel" style={{
              position:'absolute', top:42, left:0, right:0, zIndex:1200,
              maxHeight:300, overflowY:'auto', padding:6,
            }}>
              {placeResults.length === 0 && !placeLoading && (
                <button onClick={handleFilterByName} style={{
                  display:'flex', alignItems:'center', gap:8, width:'100%', textAlign:'left',
                  padding:'9px 10px', background:'none', border:'none', borderRadius:8,
                  cursor:'pointer', color:'var(--text-secondary)', fontSize:13,
                }}>
                  🔍 Filter listings matching “{searchQuery}”
                </button>
              )}
              {placeResults.map(p => (
                <button key={p.id} onClick={() => handlePickPlace(p)} style={{
                  display:'flex', alignItems:'flex-start', gap:8, width:'100%', textAlign:'left',
                  padding:'9px 10px', background:'none', border:'none', borderRadius:8,
                  cursor:'pointer', color:'var(--text-primary)', fontSize:13,
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-chip-active)'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                  <MapPin size={15} color="#6366f1" style={{ flexShrink:0, marginTop:2 }}/>
                  <span>
                    <span style={{ fontWeight:700 }}>{p.name}</span>
                    <span style={{ display:'block', fontSize:11, color:'var(--text-muted)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:280 }}>
                      {p.displayName}
                    </span>
                  </span>
                </button>
              ))}
              {placeResults.length > 0 && (
                <button onClick={handleFilterByName} style={{
                  display:'block', width:'100%', textAlign:'center',
                  padding:'7px', background:'none', border:'none', borderTop:'1px solid var(--border-base)',
                  cursor:'pointer', color:'var(--text-muted)', fontSize:11,
                }}>
                  …or filter listings named “{searchQuery}”
                </button>
              )}
            </div>
          )}
        </div>

        {/* Ask AI button */}
        <button onClick={onOpenAIConcierge} className="btn-primary"
          style={{ padding:'8px 14px', fontSize:13, borderRadius:20, flexShrink:0, whiteSpace:'nowrap' }}>
          <Sparkles size={15}/> Ask SafeStay AI
        </button>

        {/* Theme toggle (icon-only — full label lives in the tooltip) */}
        <button onClick={onToggleTheme} className="btn-secondary"
          style={{ width:36, height:36, borderRadius:'50%', flexShrink:0, justifyContent:'center', padding:0 }}
          title={themeMode === 'dark' ? 'Switch to Light mode' : 'Switch to Dark mode'}
          aria-label={themeMode === 'dark' ? 'Switch to Light mode' : 'Switch to Dark mode'}>
          {themeMode === 'dark' ? <Sun size={16} color="#f59e0b"/> : <Moon size={16} color="#6366f1"/>}
        </button>

        {/* Gender filter */}
        <select value={genderFilter} onChange={e => onGenderFilterChange(e.target.value)}
          style={{
            padding:'8px 10px', background:'var(--bg-input)',
            border:'1.5px solid var(--border-base)', borderRadius:16,
            color:'var(--text-primary)', fontSize:12, outline:'none', cursor:'pointer',
          }}>
          <option value="All">All Genders</option>
          <option value="Female Only">🚺 Female Only</option>
          <option value="Male Only">🚹 Male Only</option>
          <option value="Co-ed / Unisex">🚻 Co-ed</option>
        </select>

        {/* City selector */}
        <select value={activeCity} onChange={e => onCityChange(e.target.value)}
          style={{
            padding:'8px 10px', background:'var(--bg-input)',
            border:'1.5px solid var(--border-base)', borderRadius:16,
            color:'var(--accent-indigo)', fontSize:12, fontWeight:700, outline:'none', cursor:'pointer',
          }}>
          {!FLAGSHIP_NAMES.includes(activeCity) && <option value={activeCity}>📍 {activeCity}</option>}
          {Object.entries(FLAGSHIP_CITIES).map(([name, c]) => (
            <option key={name} value={name}>📍 {c.label}</option>
          ))}
        </select>

        {/* SOS */}
        <button onClick={onTriggerSOS} className="btn-danger"
          style={{ padding:'8px 12px', fontSize:12, borderRadius:16, flexShrink:0 }}>
          🚨 SOS
        </button>

        {/* Avatar */}
        <div style={{ position:'relative' }}>
          <button
            onClick={() => setShowProfileMenu(p => !p)}
            style={{
              width:36, height:36, borderRadius:'50%', flexShrink:0,
              background:'linear-gradient(135deg,#6366f1,#8b5cf6)',
              border:'2px solid #fff', color:'#fff',
              fontWeight:700, fontSize:14, cursor:'pointer',
              display:'flex', alignItems:'center', justifyContent:'center',
              boxShadow:'0 4px 10px rgba(99,102,241,0.3)',
            }}>
            {user?.fullName?.charAt(0)?.toUpperCase() ?? 'S'}
          </button>

          {showProfileMenu && (
            <div className="glass-panel" style={{
              position:'absolute', right:0, top:46,
              width:240, padding:16, zIndex:1100,
              boxShadow:'var(--shadow-xl)',
            }}>
              <p style={{ fontWeight:700, fontSize:14, marginBottom:2 }}>{user?.fullName}</p>
              <p style={{ fontSize:11, color:'var(--text-muted)', marginBottom:10 }}>
                {user?.email} · <span style={{ color:'#6366f1', textTransform:'capitalize' }}>{user?.role}</span>
              </p>
              <div style={{
                fontSize:10, padding:'5px 8px', borderRadius:8, fontWeight:700, marginBottom:14,
                background: isMobileMode ? '#e0f2fe' : '#d1fae5',
                color: isMobileMode ? '#0284c7' : '#047857',
              }}>
                {isMobileMode ? '📱 Mobile Persistent' : '🔒 Web Privacy Mode (sessionStorage)'}
              </div>
              <button onClick={logout} className="btn-secondary"
                style={{ width:'100%', justifyContent:'center', fontSize:12, color:'var(--accent-rose)', borderColor:'#fecaca' }}>
                <LogOut size={14}/> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
