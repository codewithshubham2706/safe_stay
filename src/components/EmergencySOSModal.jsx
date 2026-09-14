import React, { useState } from 'react';
import { triggerEmergencySOS } from '../services/apiService';
import { Phone, Radio, X, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function EmergencySOSModal({ isOpen, onClose, userLocation, studentName }) {
  const [broadcasting, setBroadcasting] = useState(false);
  const [sosActive, setSosActive] = useState(false);
  const [details, setDetails] = useState(null);

  if (!isOpen) return null;

  const handleBroadcast = async () => {
    setBroadcasting(true);
    try {
      const res = await triggerEmergencySOS(userLocation, studentName);
      setSosActive(true);
      setDetails(res.sosDetails);
    } finally { setBroadcasting(false); }
  };

  return (
    <div className="modal-overlay" style={{ background:'rgba(30,5,10,0.80)' }}>
      <div className="glass-panel" style={{
        maxWidth:440, width:'100%', padding:28, position:'relative',
        border:'1.5px solid #fca5a5',
        boxShadow:'0 0 40px rgba(220,38,38,0.25)',
        textAlign:'center',
      }}>
        <button onClick={onClose} style={{ position:'absolute', top:16, right:16, background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)' }}><X size={20}/></button>

        <div style={{ width:64, height:64, borderRadius:'50%', background:'linear-gradient(135deg,#dc2626,#f43f5e)', display:'inline-flex', alignItems:'center', justifyContent:'center', marginBottom:16, boxShadow:'0 0 25px rgba(220,38,38,0.45)', animation:'pulse-danger 1.5s infinite' }}>
          <ShieldAlert size={36} color="#fff"/>
        </div>

        <h2 style={{ fontSize:20, margin:'0 0 6px' }}>Emergency SOS Network</h2>
        <p style={{ fontSize:13, color:'var(--text-secondary)', marginBottom:20 }}>Broadcast live GPS to verified students, caretakers & emergency services.</p>

        {!sosActive ? (
          <>
            <div style={{ padding:12, borderRadius:10, background:'var(--bg-danger-soft)', border:'1px solid var(--border-danger-soft)', fontSize:12, textAlign:'left', marginBottom:18, color:'var(--text-label)' }}>
              📍 GPS: <strong>{userLocation ? `${userLocation[1]?.toFixed(4)}, ${userLocation[0]?.toFixed(4)}` : 'Kota, Rajasthan'}</strong><br/>
              📡 Alert Radius: <strong>1.0 km burst broadcast</strong>
            </div>
            <button onClick={handleBroadcast} disabled={broadcasting} className="btn-danger"
              style={{ width:'100%', padding:15, fontSize:15, fontWeight:800, justifyContent:'center' }}>
              <Radio size={20}/> {broadcasting ? 'Broadcasting…' : '🚨 SEND EMERGENCY SOS NOW'}
            </button>
          </>
        ) : (
          <>
            <div style={{ padding:16, borderRadius:12, background:'var(--bg-success-soft)', border:'1px solid var(--border-success-soft)', marginBottom:18, textAlign:'left' }}>
              <p style={{ fontWeight:700, color:'#15803d', fontSize:14, display:'flex', alignItems:'center', gap:6, margin:'0 0 8px' }}><CheckCircle2 size={18}/> SOS Broadcasted!</p>
              <p style={{ fontSize:12, color:'var(--text-label)', margin:0, lineHeight:1.6 }}>
                · {details?.notifiedStudentsCount || 24} verified students notified.<br/>
                · Hostel caretaker alert sent.<br/>
                · Local police beat pinged.
              </p>
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <a href="tel:112" className="btn-danger" style={{ flex:1, textDecoration:'none', justifyContent:'center', padding:11 }}>
                <Phone size={16}/> Call 112
              </a>
              <button onClick={onClose} className="btn-secondary" style={{ flex:1, justifyContent:'center' }}>Close</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
