import React, { useState } from 'react';
import { fetchAIConciergeRecommendation } from '../services/apiService';
import { FLAGSHIP_CITIES } from '../../server/flagshipCities.js';
import { Sparkles, ArrowRight, Bot, CheckCircle2, X } from 'lucide-react';

const FLAGSHIP_NAMES = Object.keys(FLAGSHIP_CITIES);

export default function AIConciergeModal({ isOpen, onClose, onApplyRecommendation, initialAnchor = 'Kota', anchorPoint = null, anchorLabel = 'Kota' }) {
  const [step, setStep] = useState(1);
  const [maxRent, setMaxRent] = useState(8000);
  const [gender, setGender] = useState('Female Only');
  const [anchorCity, setAnchorCity] = useState(initialAnchor);
  const [priorities, setPriorities] = useState({ gym:true, mess:true, library:true, grocery:false });
  const [calculating, setCalculating] = useState(false);
  const [result, setResult] = useState(null);

  if (!isOpen) return null;

  const toggle = k => setPriorities(p => ({ ...p, [k]: !p[k] }));

  const handleCalculate = async () => {
    setCalculating(true);
    try {
      const usePoint = anchorPoint && (anchorPoint.lat || anchorPoint.lat === 0) && !FLAGSHIP_NAMES.includes(anchorCity);
      const res = await fetchAIConciergeRecommendation({
        maxRent,
        gender,
        anchorCity: usePoint ? undefined : anchorCity,
        lat: usePoint ? anchorPoint.lat : undefined,
        lng: usePoint ? anchorPoint.lng : undefined,
        anchorLabel: usePoint ? anchorLabel : anchorCity,
        proximityPriorities: Object.keys(priorities).filter(k => priorities[k])
      });
      setResult(res);
      setStep(3);
    } finally { setCalculating(false); }
  };

  const handleFinish = () => {
    if (onApplyRecommendation && result) onApplyRecommendation(result, { maxRent, gender, anchorCity });
    onClose();
  };

  const amenities = [
    { key:'gym',     label:'🏋️ Gyms Nearby',    sub:'Under 500m' },
    { key:'mess',    label:'🍲 Mess & Tiffin',   sub:'Daily food' },
    { key:'library', label:'📚 24/7 Library',     sub:'Quiet study zone' },
    { key:'grocery', label:'🛒 Daily Groceries',  sub:'Shops & markets' },
  ];

  return (
    <div className="modal-overlay">
      <div className="glass-panel" style={{ maxWidth:540, width:'100%', padding:32, maxHeight:'90vh', overflowY:'auto', border:'1px solid var(--border-base)', boxShadow:'0 20px 60px rgba(99,102,241,0.15)' }}>
        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:26 }}>
          <div style={{ width:46, height:46, borderRadius:14, background:'linear-gradient(135deg,#6366f1,#06b6d4)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 6px 16px rgba(99,102,241,0.35)' }}>
            <Bot size={26} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize:19, color:'var(--text-primary)', margin:0 }}>SafeStay AI Concierge</h2>
            <p style={{ fontSize:12, color:'var(--text-muted)', margin:0 }}>Lifestyle & Structural Safety Matching</p>
          </div>
          <button onClick={onClose} style={{ marginLeft:'auto', background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', padding:4 }}><X size={20}/></button>
        </div>

        {/* Step indicator */}
        <div style={{ display:'flex', gap:6, marginBottom:24 }}>
          {[1,2,3].map(s => (
            <div key={s} style={{ flex:1, height:4, borderRadius:4, background: step >= s ? '#6366f1' : 'var(--border-base)', transition:'background 0.3s' }}/>
          ))}
        </div>

        {/* ── Step 1 ── */}
        {step === 1 && (
          <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
            <div>
              <label style={{ fontSize:13, fontWeight:600, color:'var(--text-primary)', display:'block', marginBottom:6 }}>📍 Anchor Location Hub</label>
              <select value={anchorCity} onChange={e => setAnchorCity(e.target.value)}
                className="field-input" style={{ fontSize:14 }}>
                {Object.entries(FLAGSHIP_CITIES).map(([name, c]) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize:13, fontWeight:600, color:'var(--text-primary)', display:'block', marginBottom:8 }}>👥 Gender Preference</label>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
                {['Female Only','Male Only','Co-ed / Unisex'].map(g => (
                  <button key={g} type="button" onClick={() => setGender(g)}
                    style={{
                      padding:'10px 6px', borderRadius:10, border:'1.5px solid',
                      borderColor: gender===g ? '#6366f1' : 'var(--border-base)',
                      background: gender===g ? 'var(--bg-info-soft)' : 'var(--panel-solid)',
                      color: gender===g ? 'var(--text-info-strong)' : 'var(--text-secondary)',
                      fontWeight:700, fontSize:12, cursor:'pointer', transition:'all 0.2s',
                    }}>{g === 'Female Only' ? '🚺 Female' : g === 'Male Only' ? '🚹 Male' : '🚻 Co-ed'}</button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                <label style={{ fontSize:13, fontWeight:600, color:'var(--text-primary)' }}>💰 Max Monthly Rent</label>
                <span style={{ fontSize:16, fontWeight:800, color:'#6366f1' }}>₹{maxRent.toLocaleString()}/mo</span>
              </div>
              <input type="range" min={3000} max={20000} step={500} value={maxRent}
                onChange={e => setMaxRent(Number(e.target.value))}
                style={{ width:'100%', accentColor:'#6366f1', height:6 }}/>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'var(--text-muted)', marginTop:4 }}>
                <span>₹3,000</span><span>₹20,000</span>
              </div>
            </div>

            <button onClick={() => setStep(2)} className="btn-primary" style={{ justifyContent:'center', padding:13 }}>
              Next: Proximity Priorities <ArrowRight size={17}/>
            </button>
          </div>
        )}

        {/* ── Step 2 ── */}
        {step === 2 && (
          <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
            <h3 style={{ fontSize:15, margin:0 }}>🎯 What do you need within walking distance?</h3>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              {amenities.map(a => (
                <div key={a.key} onClick={() => toggle(a.key)}
                  style={{
                    padding:14, borderRadius:12, cursor:'pointer',
                    border:'1.5px solid', borderColor: priorities[a.key] ? '#6366f1' : 'var(--border-base)',
                    background: priorities[a.key] ? 'var(--bg-info-soft)' : 'var(--panel-solid)',
                    transition:'all 0.2s',
                  }}>
                  <p style={{ fontSize:14, fontWeight:700, color: priorities[a.key] ? 'var(--text-info-strong)' : 'var(--text-primary)', margin:0 }}>{a.label}</p>
                  <p style={{ fontSize:11, color:'var(--text-muted)', margin:'2px 0 0' }}>{a.sub}</p>
                </div>
              ))}
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={() => setStep(1)} className="btn-secondary" style={{ flex:1, justifyContent:'center' }}>Back</button>
              <button onClick={handleCalculate} disabled={calculating} className="btn-primary" style={{ flex:2, justifyContent:'center' }}>
                {calculating ? '🤖 Analysing…' : '✨ Calculate Recommendation'}
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3 (Results) ── */}
        {step === 3 && result && (
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div style={{ padding:16, borderRadius:14, background:'var(--bg-success-soft)', border:'1px solid var(--border-success-soft)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8, color:'var(--text-success-strong)', fontWeight:700, fontSize:14 }}>
                <Sparkles size={18}/> AI Match Result
              </div>
              <p style={{ fontSize:13, color:'var(--text-label)', lineHeight:1.6 }}>{result.aiInsight}</p>
            </div>

            <p style={{ fontSize:12, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', margin:0 }}>Top Recommended Clusters:</p>

            <div style={{ display:'flex', flexDirection:'column', gap:8, maxHeight:240, overflowY:'auto' }}>
              {result.hostels.map(h => (
                <div key={h._id} className="glass-card" style={{ padding:'12px 14px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div>
                    <p style={{ fontSize:14, fontWeight:700, color:'var(--text-primary)', margin:0 }}>{h.name}</p>
                    <p style={{ fontSize:11, color:'var(--text-muted)', margin:'2px 0 0' }}>📍 {h.address}</p>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <p style={{ fontSize:15, fontWeight:800, color:'#6366f1', margin:0 }}>₹{h.cachedMinRent}/mo</p>
                    <span className={`badge ${h.sviScore < 30 ? 'badge-green' : h.sviScore < 60 ? 'badge-amber' : 'badge-red'}`}>
                      SVI {h.sviScore.toFixed(0)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={handleFinish} className="btn-primary" style={{ justifyContent:'center', padding:13 }}>
              🗺️ Open Map with Recommendations
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
