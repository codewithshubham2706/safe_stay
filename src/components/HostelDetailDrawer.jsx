import React, { useState } from 'react';
import { ShieldCheck, Phone, MessageSquare, X, Image, ClipboardList, Sparkles, AlertTriangle, ChevronRight } from 'lucide-react';

export default function HostelDetailDrawer({ hostel, onClose, onOpenAuditModal, onOpenLandlordVerify, onOpenPaidCommunity, onTriggerSOS }) {
  if (!hostel) return null;

  const owner = hostel.owner || {};
  const svi = hostel.sviScore || 10;
  const mdi = hostel.maintenanceDecayScore || 0;
  const isVerified = owner.aiVerificationStatus === 'AI_Verified';

  const gradeColor = svi > 60 ? 'var(--text-danger-strong)' : svi >= 30 ? 'var(--text-warn-strong)' : 'var(--text-success-strong)';
  const gradeBg    = svi > 60 ? 'var(--bg-danger-soft)' : svi >= 30 ? 'var(--bg-warn-soft)' : 'var(--bg-success-soft)';
  const gradeBdr   = svi > 60 ? 'var(--border-danger-soft)' : svi >= 30 ? 'var(--border-warn-soft)' : 'var(--border-success-soft)';
  const mdiColor   = mdi > 50 ? 'var(--text-danger-strong)' : mdi > 20 ? 'var(--text-warn-strong)' : 'var(--text-success-strong)';

  return (
    <div style={{
      position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: 500,
      zIndex: 1500, background: 'var(--panel-solid)',
      borderLeft: '1px solid var(--border-base)',
      boxShadow: '-8px 0 40px rgba(0,0,0,0.10)',
      display: 'flex', flexDirection: 'column', overflowY: 'auto',
    }}>
      {/* Cover Image */}
      <div style={{ position:'relative', height:200, flexShrink:0 }}>
        <img src={hostel.coverImage || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5'} alt={hostel.name}
          style={{ width:'100%', height:'100%', objectFit:'cover' }} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.55) 100%)' }}/>

        {/* Close */}
        <button onClick={onClose}
          style={{ position:'absolute', top:14, right:14, width:34, height:34, borderRadius:'50%', background:'rgba(255,255,255,0.95)', border:'none', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', boxShadow:'0 2px 8px rgba(0,0,0,0.15)' }}>
          <X size={18} color="#374151"/>
        </button>

        {/* SVI badge */}
        <div style={{ position:'absolute', bottom:14, left:14, display:'flex', gap:8 }}>
          <span style={{ padding:'5px 12px', borderRadius:20, fontWeight:800, fontSize:12, color:gradeColor, background:'rgba(255,255,255,0.95)', border:`1.5px solid ${gradeBdr}`, boxShadow:'0 2px 8px rgba(0,0,0,0.15)' }}>
            🛡️ {hostel.sviGrade || 'Grade A (Sound)'}
          </span>
          {hostel.isCriticallyNeglected && (
            <span style={{ padding:'5px 12px', borderRadius:20, fontWeight:800, fontSize:12, color:'#dc2626', background:'rgba(255,255,255,0.95)', border:'1.5px solid #fca5a5', boxShadow:'0 2px 8px rgba(0,0,0,0.15)' }}>
              ⚠️ Decay Alert
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding:24, display:'flex', flexDirection:'column', gap:20 }}>

        {/* Title */}
        <div>
          <h2 style={{ fontSize:21, color:'var(--text-primary)', margin:0 }}>{hostel.name}</h2>
          <p style={{ fontSize:13, color:'var(--text-secondary)', marginTop:4 }}>
            📍 {hostel.address} &nbsp;·&nbsp;
            <span style={{ fontWeight:700, color:'#6366f1' }}>{hostel.pgGenderCategory}</span>
          </p>
        </div>

        {/* Landlord Badge */}
        <div style={{ padding:'12px 14px', borderRadius:12, background: isVerified ? 'var(--bg-success-soft)' : 'var(--bg-warn-soft)', border:`1px solid ${isVerified ? 'var(--border-success-soft)' : 'var(--border-warn-soft)'}`, display:'flex', alignItems:'center', justifyContent:'space-between', gap:10 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <ShieldCheck size={22} color={isVerified ? '#16a34a' : '#ca8a04'}/>
            <div>
              <p style={{ fontSize:13, fontWeight:700, color: isVerified ? 'var(--text-success-strong)' : 'var(--text-warn-strong)', margin:0 }}>
                {isVerified ? '🛡️ AI-Verified Landlord' : '⚠️ Verification Pending'}
              </p>
              <p style={{ fontSize:11, color:'var(--text-secondary)', margin:0 }}>Owner: {owner.name || 'Property Owner'}</p>
            </div>
          </div>
          {!isVerified && (
            <button onClick={onOpenLandlordVerify}
              style={{ padding:'6px 12px', borderRadius:8, border:'none', background:'#f59e0b', color:'#fff', fontSize:11, fontWeight:700, cursor:'pointer' }}>
              Verify Now
            </button>
          )}
        </div>

        {/* Contact Actions */}
        <div style={{ display:'flex', gap:10 }}>
          <a href={`tel:${owner.phone || '+919829012345'}`} className="btn-primary"
            style={{ flex:1, justifyContent:'center', padding:12, textDecoration:'none' }}>
            <Phone size={17}/> 📞 Call Owner
          </a>
          <a href={`https://wa.me/${owner.whatsapp || '919829012345'}?text=Hi, I found ${encodeURIComponent(hostel.name)} on Safe-Stay.`}
            target="_blank" rel="noopener noreferrer"
            style={{
              flex:1, display:'inline-flex', alignItems:'center', justifyContent:'center', gap:8,
              padding:12, borderRadius:12, border:'1.5px solid #86efac',
              background:'#f0fdf4', color:'#16a34a', fontWeight:700, fontSize:14, textDecoration:'none',
            }}>
            <MessageSquare size={17}/> WhatsApp
          </a>
        </div>

        {/* SVI / MDI Cards */}
        <div>
          <p className="section-header"><ShieldCheck size={16} color="#6366f1"/> Safety Index Scores</p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {/* SVI */}
            <div style={{ padding:14, borderRadius:12, background: gradeBg, border:`1px solid ${gradeBdr}` }}>
              <p style={{ fontSize:11, color:'var(--text-secondary)', fontWeight:600, margin:0 }}>Structural Vulnerability (SVI)</p>
              <p style={{ fontSize:26, fontWeight:900, color:gradeColor, margin:'4px 0 2px', fontFamily:'var(--font-heading)' }}>{svi.toFixed(1)}<span style={{ fontSize:13 }}>/100</span></p>
              <div className="svi-bar-track" style={{ marginBottom:4 }}>
                <div className="svi-bar-fill" style={{ width:`${svi}%`, background: gradeColor }}/>
              </div>
              <p style={{ fontSize:10, fontWeight:700, color:gradeColor, margin:0 }}>{hostel.sviGrade}</p>
            </div>
            {/* MDI */}
            <div style={{ padding:14, borderRadius:12, background: mdi > 50 ? 'var(--bg-danger-soft)' : 'var(--bg-info-soft)', border:`1px solid ${mdi > 50 ? 'var(--border-danger-soft)' : 'var(--border-info-soft)'}` }}>
              <p style={{ fontSize:11, color:'var(--text-secondary)', fontWeight:600, margin:0 }}>Maintenance Decay (MDI)</p>
              <p style={{ fontSize:26, fontWeight:900, color:mdiColor, margin:'4px 0 2px', fontFamily:'var(--font-heading)' }}>{mdi.toFixed(1)}<span style={{ fontSize:13 }}>/100</span></p>
              <div className="svi-bar-track" style={{ marginBottom:4 }}>
                <div className="svi-bar-fill" style={{ width:`${mdi}%`, background: mdiColor }}/>
              </div>
              <p style={{ fontSize:10, fontWeight:700, color:mdiColor, margin:0 }}>{hostel.isCriticallyNeglected ? '🔴 Critically Neglected' : '🟢 Normal'}</p>
            </div>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:10, padding:'9px 12px', borderRadius:10, background:'var(--bg-info-soft)', border:'1px solid var(--border-info-soft)' }}>
            <span style={{ fontSize:12, color:'var(--text-label)' }}>Security Deposit Risk:</span>
            <span style={{ fontSize:12, fontWeight:700, color: hostel.depositRiskRating?.includes('Risk') ? 'var(--text-danger-strong)' : 'var(--text-success-strong)' }}>
              {hostel.depositRiskRating || 'Safe / Fully Refunded'}
            </span>
          </div>
        </div>

        {/* Room Pricing Cards */}
        <div>
          <p className="section-header">🏷️ Room Pricing</p>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {(hostel.rooms || []).slice(0, 4).map((room, i) => (
              <div key={i} className="glass-card" style={{ padding:'12px 14px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <p style={{ fontSize:14, fontWeight:700, color:'var(--text-primary)', margin:0 }}>{room.roomType}</p>
                  <p style={{ fontSize:11, color:'var(--text-muted)', margin:'3px 0 0', display:'flex', gap:8 }}>
                    {room.mealsIncluded && <span>🍲 Meals</span>}
                    {room.acAvailable && <span>❄️ AC</span>}
                    {room.attachedWashroom && <span>🚿 Attached</span>}
                  </p>
                </div>
                <div style={{ textAlign:'right' }}>
                  <p style={{ fontSize:17, fontWeight:900, color:'#6366f1', margin:0 }}>₹{room.monthlyRent?.toLocaleString()}/mo</p>
                  <p style={{ fontSize:10, color:'var(--text-muted)', margin:'2px 0 0' }}>Dep: ₹{room.securityDeposit?.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Photo Wall */}
        <div>
          <p className="section-header"><Image size={16} color="#06b6d4"/> Student Evidence Photo Wall</p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {[
              { img:'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=400&q=80', tag:'Highlight / Positive', tagBg:'#f0fdf4', tagColor:'#16a34a' },
              { img:'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80', tag:'Defect / Seepage', tagBg:'#fef2f2', tagColor:'#dc2626' },
            ].map((p,i) => (
              <div key={i} style={{ position:'relative', borderRadius:10, overflow:'hidden', height:110 }}>
                <img src={p.img} style={{ width:'100%', height:'100%', objectFit:'cover' }} alt={p.tag}/>
                <span style={{ position:'absolute', bottom:6, left:6, padding:'2px 8px', borderRadius:6, fontSize:9, fontWeight:700, background:p.tagBg, color:p.tagColor }}>
                  {p.tag}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <button onClick={onOpenAuditModal}
            style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', borderRadius:12, border:'1.5px solid var(--border-info-soft)', background:'var(--bg-info-soft)', cursor:'pointer' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <ClipboardList size={18} color="#6366f1"/>
              <div style={{ textAlign:'left' }}>
                <p style={{ fontSize:13, fontWeight:700, color:'var(--text-info-strong)', margin:0 }}>Submit 60-90 Day Living Audit</p>
                <p style={{ fontSize:11, color:'var(--text-secondary)', margin:0 }}>Rate structure, maintenance & landlord</p>
              </div>
            </div>
            <ChevronRight size={16} color="#94a3b8"/>
          </button>

          <button onClick={onOpenPaidCommunity}
            style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', borderRadius:12, border:'1.5px solid var(--border-success-soft)', background:'var(--bg-success-soft)', cursor:'pointer' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <Sparkles size={18} color="#16a34a"/>
              <div style={{ textAlign:'left' }}>
                <p style={{ fontSize:13, fontWeight:700, color:'var(--text-success-strong)', margin:0 }}>Join WhatsApp Safety Group</p>
                <p style={{ fontSize:11, color:'var(--text-secondary)', margin:0 }}>Verified neighborhood community</p>
              </div>
            </div>
            <ChevronRight size={16} color="#94a3b8"/>
          </button>
        </div>
      </div>
    </div>
  );
}
