import React, { useState } from 'react';
import { verifyLandlordDocument } from '../services/apiService';
import { ShieldCheck, Upload, CheckCircle2, X } from 'lucide-react';

export default function LandlordVerificationModal({ isOpen, onClose, hostel, onVerificationSuccess }) {
  const [govId, setGovId] = useState('');
  const [auditing, setAuditing] = useState(false);
  const [result, setResult] = useState(null);

  if (!isOpen || !hostel) return null;

  const handleAudit = async (e) => {
    e.preventDefault();
    setAuditing(true);
    try {
      const res = await verifyLandlordDocument({ hostelId: hostel._id, ownerName: hostel.owner?.name, govIdNumber: govId || 'AADHAAR-8899', taxBillDocumentUrl: 'simulated_bill.pdf' });
      setResult(res);
      if (onVerificationSuccess) onVerificationSuccess();
    } finally { setAuditing(false); }
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel" style={{ maxWidth:460, width:'100%', padding:28, position:'relative' }}>
        <button onClick={onClose} style={{ position:'absolute', top:16, right:16, background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)' }}><X size={20}/></button>

        <div style={{ textAlign:'center', marginBottom:22 }}>
          <div style={{ width:54, height:54, borderRadius:16, background:'linear-gradient(135deg,#10b981,#06b6d4)', display:'inline-flex', alignItems:'center', justifyContent:'center', marginBottom:14, boxShadow:'0 6px 18px rgba(16,185,129,0.3)' }}>
            <ShieldCheck size={32} color="#fff"/>
          </div>
          <h2 style={{ fontSize:19, margin:0 }}>Landlord AI Verification Portal</h2>
          <p style={{ fontSize:12, color:'var(--text-muted)', marginTop:4 }}>Upload property docs to earn the Verified Landlord Shield</p>
        </div>

        {!result ? (
          <form onSubmit={handleAudit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div>
              <label style={{ fontSize:12, fontWeight:600, display:'block', marginBottom:5 }}>Government ID Number</label>
              <input type="text" placeholder="Aadhaar / PAN / Passport number" value={govId} onChange={e => setGovId(e.target.value)}
                className="field-input" required style={{ fontSize:13 }}/>
            </div>

            <div style={{ border:'2px dashed var(--border-info-soft)', borderRadius:12, padding:24, textAlign:'center', background:'var(--bg-info-soft)', cursor:'pointer' }}>
              <Upload size={26} color="#6366f1" style={{ marginBottom:8 }}/>
              <p style={{ fontSize:13, fontWeight:700, color:'#4338ca', margin:0 }}>Upload Property Tax / Utility Bill</p>
              <p style={{ fontSize:11, color:'var(--text-muted)', marginTop:3 }}>AI validates ownership by matching landlord name in document</p>
            </div>

            <button type="submit" disabled={auditing} className="btn-primary" style={{ justifyContent:'center', padding:13 }}>
              {auditing ? '🤖 Running AI Vision Audit…' : '✨ Audit & Award Verified Shield'}
            </button>
          </form>
        ) : (
          <div style={{ textAlign:'center' }}>
            <div style={{ padding:20, borderRadius:14, background:'var(--bg-success-soft)', border:'1px solid var(--border-success-soft)', marginBottom:18 }}>
              <CheckCircle2 size={40} color="#16a34a" style={{ marginBottom:10 }}/>
              <h3 style={{ fontSize:17, color:'var(--text-success-strong)', margin:0 }}>Verification Complete!</h3>
              <p style={{ fontSize:13, color:'var(--text-label)', marginTop:6 }}>{result.message}</p>
              <p style={{ fontSize:11, color:'var(--text-secondary)', marginTop:4 }}>AI Confidence: {result.confidenceScore}</p>
            </div>
            <button onClick={onClose} className="btn-secondary" style={{ width:'100%', justifyContent:'center' }}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
}
