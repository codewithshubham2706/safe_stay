import React, { useState } from 'react';
import { submitStructuralAudit } from '../services/apiService';
import { X, ShieldCheck } from 'lucide-react';

export default function StructuralAuditModal({ isOpen, onClose, hostel, onAuditSubmitted }) {
  const [form, setForm] = useState({
    constructionDecade: '2006-2018', floorsBuilt: 4, floorsPermitted: 4,
    basementUsage: 'None', emergencyExitsCount: 2,
    openWiringHazard: false, structuralCracks: false,
    waterSeepageCeilingWalls: false, dampnessMoldInRooms: false,
    unrepairedPlumbingIssues: false, fireExtinguishersExpiredOrMissing: false,
    depositReturnedStatus: 'Returned Full', overallRating: 4, pros: '', cons: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !hostel) return null;

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await submitStructuralAudit({ ...form, hostelId: hostel._id, userId: 'user_demo', isVerifiedResident: true });
      setSuccess(true);
      setTimeout(() => { if (onAuditSubmitted) onAuditSubmitted(res.updatedScores); setSuccess(false); onClose(); }, 1500);
    } finally { setSubmitting(false); }
  };

  const hazards = [
    { k:'openWiringHazard',              label:'Open Electrical Wiring' },
    { k:'structuralCracks',             label:'Visible Wall / Beam Cracks' },
    { k:'waterSeepageCeilingWalls',      label:'Ceiling / Wall Seepage' },
    { k:'dampnessMoldInRooms',           label:'Black Mold in Rooms' },
    { k:'unrepairedPlumbingIssues',      label:'Leaking / Unrepaired Plumbing' },
    { k:'fireExtinguishersExpiredOrMissing', label:'Missing Fire Exits / Extinguishers' },
  ];

  return (
    <div className="modal-overlay">
      <div className="glass-panel" style={{ maxWidth:560, width:'100%', padding:28, maxHeight:'90vh', overflowY:'auto', position:'relative' }}>
        <button onClick={onClose} style={{ position:'absolute', top:16, right:16, background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)' }}><X size={20}/></button>

        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
          <div style={{ width:42, height:42, borderRadius:12, background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <ShieldCheck size={24} color="#fff"/>
          </div>
          <div>
            <h2 style={{ fontSize:18, margin:0 }}>60-90 Day Structural Audit</h2>
            <p style={{ fontSize:12, color:'var(--text-muted)', margin:0 }}>Auditing: <strong>{hostel.name}</strong></p>
          </div>
        </div>

        {success && (
          <div style={{ padding:14, borderRadius:12, background:'var(--bg-success-soft)', border:'1px solid var(--border-success-soft)', color:'var(--text-success-strong)', fontWeight:700, fontSize:14, marginBottom:16 }}>
            ✅ Audit submitted! SVI & MDI scores recalculated.
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div>
              <label style={{ fontSize:12, fontWeight:600, display:'block', marginBottom:5 }}>Construction Era</label>
              <select value={form.constructionDecade} onChange={e => set('constructionDecade', e.target.value)} className="field-input" style={{ fontSize:13 }}>
                <option value=">2018">Post 2018 (New)</option>
                <option value="2006-2018">2006–2018</option>
                <option value="1990-2005">1990–2005</option>
                <option value="<1990">Pre 1990 (Legacy)</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize:12, fontWeight:600, display:'block', marginBottom:5 }}>Basement Occupancy</label>
              <select value={form.basementUsage} onChange={e => set('basementUsage', e.target.value)} className="field-input" style={{ fontSize:13 }}>
                <option value="None">No Basement</option>
                <option value="Storage/Parking">Storage / Parking</option>
                <option value="Student Rooms/Library">⚠️ Student Rooms (Hazard)</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize:12, fontWeight:600, display:'block', marginBottom:5 }}>Floors Built / Permitted</label>
              <div style={{ display:'flex', gap:6 }}>
                <input type="number" value={form.floorsBuilt} onChange={e => set('floorsBuilt', e.target.value)} className="field-input" placeholder="Built" style={{ fontSize:13 }}/>
                <input type="number" value={form.floorsPermitted} onChange={e => set('floorsPermitted', e.target.value)} className="field-input" placeholder="Permitted" style={{ fontSize:13 }}/>
              </div>
            </div>
            <div>
              <label style={{ fontSize:12, fontWeight:600, display:'block', marginBottom:5 }}>Security Deposit Outcome</label>
              <select value={form.depositReturnedStatus} onChange={e => set('depositReturnedStatus', e.target.value)} className="field-input" style={{ fontSize:13 }}>
                <option value="Returned Full">Full Deposit Returned ✅</option>
                <option value="Unfair Deductions">Unfair Deductions ⚠️</option>
                <option value="Refused Refund">Refused Refund 🚫</option>
                <option value="Current Resident">Current Resident</option>
              </select>
            </div>
          </div>

          {/* Hazard checklist */}
          <div>
            <p style={{ fontSize:12, fontWeight:700, color:'#dc2626', marginBottom:8 }}>⚠️ Hazard & Neglect Indicators</p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              {hazards.map(h => (
                <label key={h.k} style={{ display:'flex', alignItems:'center', gap:8, fontSize:12, color:'var(--text-primary)', cursor:'pointer', padding:'8px 10px', borderRadius:8, background: form[h.k] ? 'var(--bg-danger-soft)' : 'var(--bg-info-soft)', border:`1px solid ${form[h.k] ? 'var(--border-danger-soft)' : 'var(--border-info-soft)'}` }}>
                  <input type="checkbox" checked={form[h.k]} onChange={e => set(h.k, e.target.checked)} style={{ accentColor:'#dc2626' }}/>
                  {h.label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize:12, fontWeight:600, display:'block', marginBottom:5 }}>Pros / Positive Notes</label>
            <textarea rows={2} value={form.pros} onChange={e => set('pros', e.target.value)} className="field-input" placeholder="Good caretaker, clean food, safe entry…" style={{ resize:'none', fontSize:13 }}/>
          </div>
          <div>
            <label style={{ fontSize:12, fontWeight:600, display:'block', marginBottom:5 }}>Cons / Issues</label>
            <textarea rows={2} value={form.cons} onChange={e => set('cons', e.target.value)} className="field-input" placeholder="Seepage, mold, late deposit return…" style={{ resize:'none', fontSize:13 }}/>
          </div>

          <button type="submit" disabled={submitting} className="btn-primary" style={{ justifyContent:'center', padding:13, fontSize:14 }}>
            {submitting ? '🔄 Calculating SVI & MDI…' : '📋 Submit Structural Safety Audit'}
          </button>
        </form>
      </div>
    </div>
  );
}
