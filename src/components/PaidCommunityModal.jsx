import React, { useState } from 'react';
import { fetchPaidCommunityInvite } from '../services/apiService';
import { MessageSquare, CheckCircle2, Lock, X, ExternalLink } from 'lucide-react';

export default function PaidCommunityModal({ isOpen, onClose, localityName = 'Kota Rajiv Gandhi Nagar' }) {
  const [processing, setProcessing] = useState(false);
  const [inviteData, setInviteData] = useState(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setProcessing(true);
    try {
      const data = await fetchPaidCommunityInvite(localityName);
      setInviteData(data);
    } finally { setProcessing(false); }
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel" style={{ maxWidth:460, width:'100%', padding:28, position:'relative' }}>
        <button onClick={onClose} style={{ position:'absolute', top:16, right:16, background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)' }}><X size={20}/></button>

        <div style={{ textAlign:'center', marginBottom:22 }}>
          <div style={{ width:54, height:54, borderRadius:16, background:'linear-gradient(135deg,#22c55e,#06b6d4)', display:'inline-flex', alignItems:'center', justifyContent:'center', marginBottom:14, boxShadow:'0 6px 18px rgba(34,197,94,0.3)' }}>
            <MessageSquare size={30} color="#fff"/>
          </div>
          <h2 style={{ fontSize:19, margin:0 }}>Verified Safety WhatsApp Group</h2>
          <p style={{ fontSize:12, color:'var(--text-muted)', marginTop:4 }}>Anti-spam gateway for verified local students · {localityName}</p>
        </div>

        {!inviteData ? (
          <>
            <div style={{ padding:14, borderRadius:12, background:'var(--bg-info-soft)', border:'1px solid var(--border-info-soft)', fontSize:12, color:'var(--text-label)', marginBottom:14 }}>
              <p style={{ fontWeight:700, color:'var(--text-info-strong)', margin:'0 0 6px' }}>🛡️ Community Benefits:</p>
              · Single-use time-expiring WhatsApp invite link.<br/>
              · Instant flood, power outage &amp; food quality alerts.<br/>
              · Only verified students of {localityName} admitted.
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 12px', borderRadius:10, background:'var(--bg-info-soft)', border:'1px solid var(--border-info-soft)', fontSize:11, color:'var(--text-info-strong)', marginBottom:18 }}>
              <Lock size={14} style={{ flexShrink:0 }}/>
              <span>Micro-verification token validates student identity &amp; eliminates spam bots.</span>
            </div>
            <button onClick={handleGenerate} disabled={processing} className="btn-primary"
              style={{ width:'100%', justifyContent:'center', padding:13, background:'linear-gradient(135deg,#22c55e,#16a34a)' }}>
              {processing ? 'Verifying Token…' : '✨ Generate Single-Use Invite Link'}
            </button>
          </>
        ) : (
          <>
            <div style={{ padding:18, borderRadius:14, background:'var(--bg-success-soft)', border:'1px solid var(--border-success-soft)', marginBottom:18, textAlign:'center' }}>
              <CheckCircle2 size={38} color="#16a34a" style={{ marginBottom:10 }}/>
              <h3 style={{ fontSize:16, color:'var(--text-success-strong)', margin:'0 0 6px' }}>Invite Link Ready!</h3>
              <p style={{ fontSize:12, color:'var(--text-label)' }}>Expires in {inviteData.expiresInMinutes} minutes for privacy.</p>
              <a href={inviteData.inviteUrl} target="_blank" rel="noopener noreferrer" className="btn-primary"
                style={{ display:'inline-flex', marginTop:12, textDecoration:'none', background:'linear-gradient(135deg,#22c55e,#16a34a)', padding:'10px 20px' }}>
                <ExternalLink size={15}/> Open WhatsApp Group
              </a>
            </div>
            <button onClick={onClose} className="btn-secondary" style={{ width:'100%', justifyContent:'center' }}>Close</button>
          </>
        )}
      </div>
    </div>
  );
}
