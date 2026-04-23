

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useHistory, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/config";
import ExamDetailsForm from "../components/student/ExamDetailsForm";
import {
  collection, query, orderBy, limit,
  getDocs, where, doc, getDoc, or,
} from "firebase/firestore";
import { startSubmission } from "../api/examService";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import LearningModulesView from "./LearningModulesView";
import FreeSandboxTerminal from "./FreeSandboxTerminal";
import ExamsView from "../components/student/ExamsView";

const MODULE_COLORS = ["#ff6b35","#00b8a3","#5a6cf5","#f0a500","#e05c7a","#36b37e","#8b5cf6","#0ea5e9"];
const Icon = ({ d, size=18, stroke="currentColor", fill="none", sw=1.5, viewBox="0 0 16 16", ...extra }) => (
  <svg viewBox={viewBox} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ width:size, height:size, flexShrink:0 }} {...extra}>{d}</svg>
);
const ICONS = {
  dashboard:   <Icon d={<><rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1.5"/><rect x="9" y="1.5" width="5.5" height="5.5" rx="1.5"/><rect x="1.5" y="9" width="5.5" height="5.5" rx="1.5"/><rect x="9" y="9" width="5.5" height="5.5" rx="1.5"/></>} />,
  courses:     <Icon d={<><path d="M2 4.5C2 3.4 2.9 2.5 4 2.5h8c1.1 0 2 .9 2 2v8c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2v-8z"/><line x1="5" y1="6" x2="11" y2="6"/><line x1="5" y1="8.5" x2="11" y2="8.5"/><line x1="5" y1="11" x2="8.5" y2="11"/></>} />,
  modules:     <Icon d={<><circle cx="8" cy="8" r="6"/><path d="M8 2c-2 2-3 4-3 6s1 4 3 6"/><path d="M8 2c2 2 3 4 3 6s-1 4-3 6"/><line x1="2" y1="8" x2="14" y2="8"/></>} />,
  exams:       <Icon d={<><rect x="2.5" y="1.5" width="11" height="13" rx="1.5"/><line x1="5" y1="5" x2="11" y2="5"/><line x1="5" y1="7.5" x2="11" y2="7.5"/><line x1="5" y1="10" x2="8.5" y2="10"/></>} />,
  leaderboard: <Icon d={<><rect x="1.5" y="9" width="3" height="5.5" rx="0.5"/><rect x="6.5" y="5.5" width="3" height="9" rx="0.5"/><rect x="11.5" y="7" width="3" height="7.5" rx="0.5"/></>} />,
  reports:     <Icon d={<><path d="M2 13L5.5 9l3 3L12 6l2 2"/><line x1="2" y1="2" x2="2" y2="14"/><line x1="2" y1="14" x2="14" y2="14"/></>} />,
  chevL:       <Icon d={<polyline points="10 12 6 8 10 4"/>} />,
  chevR:       <Icon d={<polyline points="6 4 10 8 6 12"/>} />,
  sun:         <Icon size={20} viewBox="0 0 24 24" d={<><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>} />,
  moon:        <Icon size={20} viewBox="0 0 24 24" d={<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>} />,
  logout:      <Icon size={17} viewBox="0 0 24 24" d={<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>} />,
  search:      <Icon size={17} viewBox="0 0 24 24" d={<><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>} />,
  fire:        <Icon size={16} viewBox="0 0 24 24" fill="currentColor" stroke="none" d={<path d="M12 2c0 0-5 4-5 9a5 5 0 0 0 10 0c0-5-5-9-5-9zm0 14a3 3 0 0 1-3-3c0-2 1.5-4 3-6 1.5 2 3 4 3 6a3 3 0 0 1-3 3z"/>} />,
  sandbox:     <Icon d={<><rect x="1.5" y="2.5" width="13" height="11" rx="1.5"/><polyline points="4 6 7 9 4 12"/><line x1="8.5" y1="12" x2="12.5" y2="12"/><circle cx="12" cy="4.5" r="1.5" fill="currentColor" stroke="none"/></>} />,
};

const NAV_ITEMS = [
  { id:"dashboard",   icon:ICONS.dashboard,   label:"Dashboard" },
  { id:"courses",     icon:ICONS.courses,     label:"Enrolled Courses" },
  { id:"modules",     icon:ICONS.modules,     label:"Global Modules" },
  { id:"exams",       icon:ICONS.exams,       label:"Exams" },
  { id:"learning",    icon:ICONS.modules,     label:"Learning Modules" },
  { id:"leaderboard", icon:ICONS.leaderboard, label:"Leaderboard" },
  { id:"reports",     icon:ICONS.reports,     label:"Reports" },
];

const NUM_STYLE = {
  fontFamily: "'JetBrains Mono','Fira Code','Cascadia Code','SF Mono','Consolas','Courier New',monospace",
  fontVariantNumeric: "tabular-nums",
  letterSpacing: "-0.02em",
};

const EXAM_TYPE_CFG = {
  DAILY:  { icon: "📅", color: "#10b981" },
  WEEKLY: { icon: "📊", color: "#3b82f6" },
  EXAM:   { icon: "🎓", color: "#f97316" },
};

function ExamTypeBadge({ examType }) {
  const cfg = EXAM_TYPE_CFG[examType] || EXAM_TYPE_CFG.EXAM;
  return (
    <span style={{
      fontSize: "0.6rem", fontWeight: 700,
      padding: "1px 6px", borderRadius: 4,
      background: `${cfg.color}18`, color: cfg.color,
      border: `1px solid ${cfg.color}30`,
      textTransform: "uppercase", letterSpacing: "0.06em", flexShrink: 0,
    }}>
      {cfg.icon} {examType || "EXAM"}
    </span>
  );
}

function getWindowStatus(exam) {
  if (exam.status === "completed") return "completed";
  const start = exam.scheduledStartTime?.toDate?.() ?? new Date(exam.scheduledStartTime);
  const end   = new Date(start.getTime() + (exam.durationMinutes ?? 60) * 60 * 1000);
  const now   = new Date();
  if (now >= start && now <= end) return "live";
  if (now < start) return "upcoming";
  return "missed";
}
function fmtDate(val) { const d=val?.toDate?val.toDate():new Date(val); return d.toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}); }
function fmtTime(val) { const d=val?.toDate?val.toDate():new Date(val); return d.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",hour12:true}); }
function endTime(exam) { const s=exam.scheduledStartTime?.toDate?.()??new Date(exam.scheduledStartTime); return new Date(s.getTime()+(exam.durationMinutes??60)*60*1000); }
function practicePath(cat) { return `/practice/${(cat.name||cat.id).trim().toLowerCase().replace(/\s+/g,"-")}`; }

function Counter({ target, duration=1200 }) {
  const [val,setVal]=useState(0);
  useEffect(()=>{
    const num=typeof target==="string"?parseInt(target):(target||0);
    let cur=0;const step=Math.max(1,Math.ceil(num/(duration/16)));
    const t=setInterval(()=>{cur=Math.min(cur+step,num);setVal(cur);if(cur>=num)clearInterval(t);},16);
    return()=>clearInterval(t);
  },[target]);
  return <span style={NUM_STYLE}>{typeof target==="string"?val+"%":val}</span>;
}

function ProgressBar({ value, color, trackColor="#f0f0f0" }) {
  const [w,setW]=useState(0);
  useEffect(()=>{const t=setTimeout(()=>setW(value||0),300);return()=>clearTimeout(t);},[value]);
  return(
    <div style={{background:trackColor,borderRadius:99,height:6,overflow:"hidden"}}>
      <div style={{width:`${w}%`,height:"100%",background:color,borderRadius:99,transition:"width 1s cubic-bezier(0.4,0,0.2,1)"}}/>
    </div>
  );
}

function Spinner() {
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"60vh",gap:"1rem"}}>
      <div style={{width:40,height:40,border:"3px solid #ffd5c2",borderTop:"3px solid #ff6b35",borderRadius:"50%",animation:"spin .8s linear infinite"}}/>
      <span style={{fontSize:"0.88rem",color:"#9ca3af",fontWeight:500}}>Loading…</span>
    </div>
  );
}

function EnrolledCoursesView({ categories, questions, T }) {
  const qByCategory = {};
  questions.forEach(q => {
    const key = q.category || q.categoryId || "General";
    if (!qByCategory[key]) qByCategory[key] = [];
    qByCategory[key].push(q);
  });
  if(!categories.length) return <div className="section-enter" style={{textAlign:"center",padding:"4rem",color:T.textFaint,fontSize:"0.95rem"}}>No enrolled courses found.</div>;
  return(
    <div className="section-enter">
      <div style={{marginBottom:"1.75rem"}}>
        <h2 style={{fontWeight:800,fontSize:"1.75rem",color:T.text}}>Enrolled Courses</h2>
        <p style={{fontSize:"0.85rem",color:T.textFaint,marginTop:"0.35rem"}}>{categories.length} modules · Opens full-screen workspace</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))",gap:"1.25rem"}}>
        {categories.map((cat,i)=>{
          const color=MODULE_COLORS[i%MODULE_COLORS.length];
          const byId   = questions.filter(q => cat.questionIds?.includes(q.id));
          const byName = qByCategory[cat.name] || [];
          const displayQ = byId.length ? byId : byName;
          const totalQ = displayQ.length;
          return(
            <div key={cat.id} style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:"12px",padding:"1.5rem",position:"relative",overflow:"hidden",transition:"all .2s ease"}}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.borderColor=`${color}60`;e.currentTarget.style.boxShadow="0 6px 16px rgba(0,0,0,0.1)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.borderColor=T.border;e.currentTarget.style.boxShadow="";}}>
              <div style={{position:"absolute",right:-10,bottom:-10,fontSize:"5.5rem",opacity:0.05}}>📘</div>
              <div style={{display:"flex",alignItems:"flex-start",gap:"1rem",marginBottom:"1.125rem"}}>
                <div style={{width:50,height:50,borderRadius:"12px",background:`${color}18`,border:`1px solid ${color}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.5rem",flexShrink:0}}>📚</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:"1rem",color:T.text,lineHeight:1.35}}>{cat.name}</div>
                  <div style={{fontSize:"0.75rem",color:T.textFaint,marginTop:"0.25rem"}}>{cat.accessType==="global"?"🌐 Global":"🎓 Selective"}</div>
                </div>
              </div>
              <div style={{display:"flex",gap:"0.5rem",flexWrap:"wrap",marginBottom:"1rem"}}>
                {[cat.accessType?.toUpperCase(),`${totalQ} Questions`].map((tag,ti)=>(
                  <span key={ti} style={{fontSize:"0.7rem",fontWeight:ti===0?700:600,padding:"0.25rem 0.65rem",borderRadius:"5px",background:ti===0?`${color}14`:T.bgHover,color:ti===0?color:T.textMuted,border:`1px solid ${ti===0?color+"30":T.border}`}}>{tag}</span>
                ))}
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.5rem"}}>
                <span style={{...NUM_STYLE,fontSize:"0.75rem",color:T.textFaint}}>{totalQ} questions</span>
                <span style={{fontSize:"0.8rem",fontWeight:800,color}}>Active</span>
              </div>
              <ProgressBar value={Math.min(100,totalQ*5)} color={color} trackColor={T.bgHover}/>
              <Link to={practicePath(cat)}
                style={{display:"block",marginTop:"1rem",width:"100%",background:`${color}12`,border:`1px solid ${color}40`,borderRadius:"8px",padding:"0.65rem",color,fontSize:"0.82rem",fontWeight:700,textAlign:"center",textDecoration:"none",transition:"all .15s",letterSpacing:"0.04em"}}
                onMouseEnter={e=>e.currentTarget.style.background=`${color}26`}
                onMouseLeave={e=>e.currentTarget.style.background=`${color}12`}>
                Practice
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GlobalModulesView({ categories, questions, T }) {
  const history=useHistory();
  const[open,setOpen]=useState(null);
  const qByCategory={};
  questions.forEach(q=>{const key=q.category||q.categoryId||"General";if(!qByCategory[key])qByCategory[key]=[];qByCategory[key].push(q);});
  const DIFF_BADGE={Easy:{bg:"#f0fdf4",color:"#16a34a",border:"#bbf7d0"},Medium:{bg:"#fffbeb",color:"#d97706",border:"#fde68a"},Hard:{bg:"#fef2f2",color:"#dc2626",border:"#fecaca"}};
  return(
    <div className="section-enter">
      <div style={{marginBottom:"1.75rem"}}>
        <h2 style={{fontWeight:800,fontSize:"1.75rem",color:T.text}}>Global Modules</h2>
        <p style={{fontSize:"0.85rem",color:T.textFaint,marginTop:"0.35rem"}}>Solve → opens <strong>full-screen workspace</strong> (no sidebar)</p>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:"0.875rem"}}>
        {categories.map((cat,i)=>{
          const color=MODULE_COLORS[i%MODULE_COLORS.length];
          const isOpen=open===cat.id;
          const byId=questions.filter(q=>cat.questionIds?.includes(q.id));
          const byName=qByCategory[cat.name]||[];
          const displayQ=byId.length?byId:byName;
          const total=displayQ.length;
          return(
            <div key={cat.id} style={{background:T.bgCard,border:`1px solid ${isOpen?color+"60":T.border}`,borderRadius:"12px",overflow:"hidden",transition:"border-color .2s,box-shadow .2s",boxShadow:isOpen?`0 0 0 3px ${color}18`:"none"}}>
              <button onClick={()=>setOpen(isOpen?null:cat.id)} style={{width:"100%",display:"flex",alignItems:"center",gap:"1.125rem",padding:"1.125rem 1.5rem",background:isOpen?`${color}08`:"transparent",border:"none",cursor:"pointer",textAlign:"left",transition:"background .15s"}}
                onMouseEnter={e=>{if(!isOpen)e.currentTarget.style.background=T.bgHover;}}
                onMouseLeave={e=>{if(!isOpen)e.currentTarget.style.background="transparent";}}>
                <div style={{width:46,height:46,borderRadius:"12px",flexShrink:0,background:`${color}15`,border:`1px solid ${color}35`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.4rem"}}>🧩</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:"0.6rem",marginBottom:"0.3rem"}}>
                    <span style={{fontWeight:700,fontSize:"1rem",color:T.text}}>{cat.name}</span>
                    <span style={{fontSize:"0.65rem",fontWeight:700,padding:"0.15rem 0.5rem",borderRadius:"5px",background:`${color}15`,color,border:`1px solid ${color}30`,textTransform:"uppercase"}}>{cat.accessType||"global"}</span>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:"0.875rem"}}>
                    <span style={{...NUM_STYLE,fontSize:"0.75rem",color:T.textFaint}}>{total} question{total!==1?"s":""}</span>
                    <span style={{fontSize:"0.72rem",fontWeight:600,color,padding:"0.1rem 0.5rem",borderRadius:"4px",background:`${color}10`,border:`1px solid ${color}25`}}>{total>0?"Available":"Coming Soon"}</span>
                  </div>
                </div>
                <button onClick={e=>{e.stopPropagation();history.push(practicePath(cat));}}
                  style={{background:`${color}18`,border:`1px solid ${color}40`,borderRadius:"7px",padding:"0.4rem 1rem",color,fontSize:"0.78rem",fontWeight:700,cursor:"pointer",flexShrink:0,transition:"all .15s"}}
                  onMouseEnter={e=>e.currentTarget.style.background=`${color}30`}
                  onMouseLeave={e=>e.currentTarget.style.background=`${color}18`}>
                  Practice →
                </button>
                <div style={{width:26,height:26,borderRadius:"6px",flexShrink:0,background:isOpen?`${color}15`:T.bgHover,border:`1px solid ${isOpen?color+"40":T.border}`,display:"flex",alignItems:"center",justifyContent:"center",color:isOpen?color:T.textFaint,transform:isOpen?"rotate(180deg)":"none",transition:"all .2s",fontSize:"0.7rem"}}>▼</div>
              </button>
              {isOpen&&(
                <div style={{borderTop:`2px solid ${color}20`,background:T.bgSurface}}>
                  {total===0?<p style={{padding:"1.75rem",textAlign:"center",fontSize:"0.875rem",color:T.textFaint,fontStyle:"italic"}}>No questions added yet.</p>:(
                    <>
                      <div style={{display:"grid",gridTemplateColumns:"44px 1fr 100px 110px",gap:"0.5rem",padding:"0.6rem 1.5rem",borderBottom:`1px solid ${T.border}`,background:T.bgHover}}>
                        {["#","Title","Difficulty","Action"].map((h,hi)=><span key={hi} style={{fontSize:"0.65rem",fontWeight:700,color:T.textFaint,textTransform:"uppercase",letterSpacing:"0.08em",textAlign:hi>1?"center":"left"}}>{h}</span>)}
                      </div>
                      {displayQ.map((q,qi)=>{
                        const diff=q.difficulty||"Medium";const badge=DIFF_BADGE[diff]||DIFF_BADGE.Medium;
                        return(
                          <div key={q.id} style={{display:"grid",gridTemplateColumns:"44px 1fr 100px 110px",gap:"0.5rem",alignItems:"center",padding:"0.875rem 1.5rem",borderBottom:qi<displayQ.length-1?`1px solid ${T.border}`:"none",background:T.bgCard,transition:"background .12s"}}
                            onMouseEnter={e=>e.currentTarget.style.background=T.bgHover}
                            onMouseLeave={e=>e.currentTarget.style.background=T.bgCard}>
                            <span style={{...NUM_STYLE,fontSize:"0.85rem",color:"#9ca3af",fontWeight:600,textAlign:"center"}}>{qi+1}</span>
                            <div>
                              <div style={{fontSize:"0.9rem",fontWeight:600,color:T.text,lineHeight:1.35}}>{q.title||q.question||"Untitled"}</div>
                              {q.type&&<span style={{fontSize:"0.62rem",fontWeight:700,padding:"0.1rem 0.4rem",borderRadius:"4px",background:(q.type==="MCQ"?"rgba(255,161,22,.15)":"rgba(88,166,255,.15)"),color:(q.type==="MCQ"?"#ffa116":"#58a6ff"),marginTop:"0.2rem",display:"inline-block"}}>{q.type}</span>}
                            </div>
                            <div style={{textAlign:"center"}}><span style={{fontSize:"0.72rem",fontWeight:700,padding:"0.25rem 0.7rem",borderRadius:"5px",background:badge.bg,color:badge.color,border:`1px solid ${badge.border}`}}>{diff}</span></div>
                            <div style={{textAlign:"center"}}>
                              <button onClick={()=>history.push(practicePath(cat))}
                                style={{background:color,color:"#fff",border:"none",borderRadius:"7px",padding:"0.375rem 0.9rem",fontSize:"0.78rem",fontWeight:700,cursor:"pointer",transition:"opacity .15s"}}
                                onMouseEnter={e=>e.currentTarget.style.opacity="0.82"}
                                onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                                Solve →
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LeaderboardView({ leaderboard, currentUser, T }) {
  const top3=leaderboard.slice(0,3);
  const podiumOrder=top3.length>=3?[top3[1],top3[0],top3[2]]:top3;
  const heights=[120,155,100];const podColors=["#9ca3af","#f0a500","#ff6b35"];
  return(
    <div className="section-enter">
      <div style={{marginBottom:"1.75rem"}}><h2 style={{fontWeight:800,fontSize:"1.75rem",color:T.text}}>🏆 Global Leaderboard</h2></div>
      {podiumOrder.length>=3&&(
        <div style={{display:"flex",justifyContent:"center",alignItems:"flex-end",gap:"1.25rem",marginBottom:"2.25rem",padding:"1.75rem",background:T.bgSurface,borderRadius:"14px",border:`1px solid ${T.border}`}}>
          {podiumOrder.map((s,i)=>(
            <div key={s.id} style={{textAlign:"center",flex:1,maxWidth:175}}>
              <div style={{fontSize:"1.75rem",marginBottom:"0.6rem"}}>{i===1?"🥇":i===0?"🥈":"🥉"}</div>
              <div style={{fontWeight:600,fontSize:"0.9rem",color:s.id===currentUser?.uid?"#ff6b35":T.text,marginBottom:"0.3rem"}}>{s.name||s.displayName||"Anonymous"}</div>
              <div style={{...NUM_STYLE,fontWeight:700,fontSize:"0.9rem",color:podColors[i],marginBottom:"0.6rem"}}>{(s.totalScore||0).toLocaleString()} pts</div>
              <div style={{height:heights[i],background:`${podColors[i]}18`,border:`1px solid ${podColors[i]}40`,borderRadius:"8px 8px 0 0",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span style={{...NUM_STYLE,fontSize:heights[i]>120?"1.9rem":"1.4rem",fontWeight:800,color:podColors[i]}}>#{i===1?1:i===0?2:3}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      <div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:"12px",overflow:"hidden"}}>
        {leaderboard.length===0&&<div style={{padding:"2.25rem",textAlign:"center",color:T.textFaint,fontSize:"0.9rem"}}>No data yet.</div>}
        {leaderboard.map((s,i)=>{
          const isMe=s.id===currentUser?.uid;const rankLabel=i===0?"🥇":i===1?"🥈":i===2?"🥉":`${i+1}`;
          return(
            <div key={s.id} style={{padding:"0.875rem 1.5rem",borderBottom:i<leaderboard.length-1?`1px solid ${T.border}`:"none",display:"flex",alignItems:"center",gap:"1.125rem",background:isMe?T.accentLight:"transparent"}}>
              <span style={{...NUM_STYLE,width:36,textAlign:"center",fontSize:i<3?"1.1rem":"0.85rem",color:i>=3?T.textFaint:undefined,fontWeight:600}}>{rankLabel}</span>
              <div style={{flex:1}}>
                <span style={{fontSize:"0.9rem",fontWeight:isMe?700:500,color:isMe?"#ff6b35":T.text}}>
                  {s.name||s.displayName||"Anonymous"}
                  {isMe&&<span style={{marginLeft:"0.5rem",fontSize:"0.62rem",background:T.accentLight,color:"#ff6b35",padding:"0.1rem 0.45rem",borderRadius:"4px",fontWeight:700,border:`1px solid ${T.accentBorder}`}}>you</span>}
                </span>
                <div style={{fontSize:"0.68rem",color:T.textFaint,marginTop:"0.1rem"}}>{s.college||s.collegeId||"—"}</div>
              </div>
              <span style={{...NUM_STYLE,fontWeight:700,fontSize:"0.92rem",color:isMe?"#ff6b35":T.text}}>{(s.totalScore||0).toLocaleString()}<span style={{fontSize:"0.65rem",color:T.textFaint,fontWeight:400,marginLeft:"0.25rem"}}>pts</span></span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ReportsView({ questions, exams, leaderboard, currentUser, dashboardSubmissions, T }) {
  const totalQ        = questions.length;
  const myRank        = leaderboard.findIndex(s => s.id === currentUser?.uid) + 1;
  const allSubs       = Object.values(dashboardSubmissions);
  const completedSubs = allSubs.filter(s => s.status === "completed");
  const avgScore      = completedSubs.length
    ? Math.round(completedSubs.reduce((a, s) => a + (s.score || 0), 0) / completedSubs.length)
    : 0;

  const dailySubs  = completedSubs.filter(s => (exams.find(e => e.id === s.examId)?.examType || "EXAM") === "DAILY");
  const weeklySubs = completedSubs.filter(s => (exams.find(e => e.id === s.examId)?.examType || "EXAM") === "WEEKLY");
  const avgOf      = arr => arr.length ? Math.round(arr.reduce((a, s) => a + (s.score || 0), 0) / arr.length) : 0;
  const dailyAvg   = avgOf(dailySubs);
  const weeklyAvg  = avgOf(weeklySubs);

  const overallItems = [
    { label: "Total Questions", val: totalQ,                            pct: Math.min(100, totalQ),                    color: "#ff6b35" },
    { label: "Exams Completed", val: completedSubs.length,             pct: Math.min(100, completedSubs.length * 10), color: "#00b8a3" },
    { label: "Avg Score",       val: `${avgScore}%`,                   pct: avgScore,                                 color: "#5a6cf5" },
    { label: "Global Rank",     val: myRank > 0 ? `#${myRank}` : "—", pct: myRank > 0 ? Math.max(5, 100 - myRank * 10) : 0, color: "#e05c7a" },
  ];

  const periodCards = [
    {
      label: "📅 Daily Performance", color: "#10b981",
      empty: dailySubs.length === 0,
      stats: [
        { label: "Completed", val: dailySubs.length,  pct: Math.min(100, dailySubs.length * 20),  color: "#10b981" },
        { label: "Avg Score", val: `${dailyAvg}%`,    pct: dailyAvg,                               color: "#34d399" },
      ],
    },
    {
      label: "📊 Weekly Performance", color: "#3b82f6",
      empty: weeklySubs.length === 0,
      stats: [
        { label: "Completed", val: weeklySubs.length, pct: Math.min(100, weeklySubs.length * 25), color: "#3b82f6" },
        { label: "Avg Score", val: `${weeklyAvg}%`,   pct: weeklyAvg,                              color: "#60a5fa" },
      ],
    },
  ];

  return (
    <div className="section-enter">
      <div style={{ marginBottom: "1.75rem" }}>
        <h2 style={{ fontWeight: 800, fontSize: "1.75rem", color: T.text }}>📊 Performance Reports</h2>
        <p style={{ fontSize: "0.85rem", color: T.textFaint, marginTop: "0.35rem" }}>Your overall progress at a glance</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: "1.125rem", marginBottom: "2rem" }}>
        {overallItems.map((item, i) => (
          <div key={i} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: "12px", padding: "1.375rem 1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.875rem" }}>
              <span style={{ fontSize: "0.85rem", color: T.textMuted }}>{item.label}</span>
              <span style={{ ...NUM_STYLE, fontWeight: 800, fontSize: "1.1rem", color: item.color }}>{item.val}</span>
            </div>
            <ProgressBar value={item.pct} color={item.color} trackColor={T.bgHover} />
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
        {periodCards.map((sec, si) => (
          <div key={si} style={{ background: T.bgCard, border: `1.5px solid ${sec.color}30`, borderRadius: "14px", overflow: "hidden" }}>
            <div style={{ padding: "1rem 1.375rem", borderBottom: `1px solid ${T.border}`, background: `${sec.color}08`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 800, fontSize: "1rem", color: T.text }}>{sec.label}</span>
              <span style={{ ...NUM_STYLE, fontSize: "0.72rem", fontWeight: 700, color: sec.color, background: `${sec.color}15`, border: `1px solid ${sec.color}30`, borderRadius: "20px", padding: "0.2rem 0.75rem" }}>
                {sec.stats[0].val} done
              </span>
            </div>
            <div style={{ padding: "1.25rem 1.375rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              {sec.empty ? (
                <div style={{ textAlign: "center", color: T.textFaint, fontSize: "0.85rem", padding: "1rem 0", fontStyle: "italic" }}>
                  No {sec.label.includes("Daily") ? "daily" : "weekly"} exams completed yet.
                </div>
              ) : sec.stats.map((stat, i) => (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: "0.82rem", color: T.textMuted }}>{stat.label}</span>
                    <span style={{ ...NUM_STYLE, fontWeight: 800, fontSize: "1rem", color: stat.color }}>{stat.val}</span>
                  </div>
                  <ProgressBar value={stat.pct} color={stat.color} trackColor={T.bgHover} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  const { currentUser, appSignOut, collegeId } = useAuth();
  const history = useHistory();
  const [dark,setDark]=useState(()=>localStorage.getItem("mc-theme")==="dark");
  const toggleTheme=()=>setDark(d=>{const n=!d;localStorage.setItem("mc-theme",n?"dark":"light");return n;});
  const T={
    bg:           dark?"#0d1117":"#ffffff",
    bgSurface:    dark?"#161b22":"#f7f8fa",
    bgCard:       dark?"#161b22":"#ffffff",
    bgHover:      dark?"#1c2128":"#f3f4f6",
    bgHeader:     dark?"rgba(13,17,23,0.95)":"rgba(255,255,255,0.97)",
    border:       dark?"#21262d":"#e5e7eb",
    text:         dark?"#e6edf3":"#1a1a1a",
    textSub:      dark?"#c9d1d9":"#2d2d2d",
    textMuted:    dark?"#6b7280":"#6b7280",
    textFaint:    dark?"#484f58":"#9ca3af",
    shadow:       dark?"0 1px 3px rgba(0,0,0,0.3)":"0 1px 3px rgba(0,0,0,0.06)",
    sidebarBorder:dark?"#21262d":"#e5e7eb",
    inputBg:      dark?"#161b22":"#f7f8fa",
    accent:       "#ff6b35",
    accentLight:  dark?"#2d1a0e":"#fff4f0",
    accentBorder: dark?"#6b3020":"#ffd5c2",
  };

  const [activeNav,   setActiveNav]   = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading,   setIsLoading]   = useState(true);
  const [exams,       setExams]       = useState([]);
  const [categories,  setCategories]  = useState([]);
  const [questions,   setQuestions]   = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [isStarting,           setIsStarting]           = useState(false);
  const [collegeLogo,          setCollegeLogo]          = useState(null);
  const [collegeName,          setCollegeName]          = useState(null);
  const [dashboardSubmissions, setDashboardSubmissions] = useState({});
  const [examDetailsModal,     setExamDetailsModal]     = useState(null);

  const FULLSCREEN_NAVS = ["sandbox"];
  const isFullscreen = FULLSCREEN_NAVS.includes(activeNav);

  const SW=sidebarOpen?256:76;

  const displayName = userProfile?.name || userProfile?.displayName || currentUser?.displayName || currentUser?.email?.split("@")[0] || "Student";
  const firstName   = displayName.split(" ")[0];
  const initials    = displayName.split(" ").map(n=>n[0]).slice(0,2).join("").toUpperCase();

  useEffect(()=>{
    if(!currentUser)return;
    const fetchAll=async()=>{
      setIsLoading(true);
      try{
        const userSnap=await getDoc(doc(db,"users",currentUser.uid));
        const uData=userSnap.data();
        if(userSnap.exists())setUserProfile(uData);
        if(uData?.collegeId){
          try{
            const colSnap=await getDoc(doc(db,"colleges",uData.collegeId));
            if(colSnap.exists()){
              const d=colSnap.data();
              if(d.logoUrl)setCollegeLogo(d.logoUrl);
              if(d.name)  setCollegeName(d.name);
            } else {
              const q=query(collection(db,"colleges"),where("name","==",uData.collegeId));
              const snap=await getDocs(q);
              if(!snap.empty){const d=snap.docs[0].data();if(d.logoUrl)setCollegeLogo(d.logoUrl);if(d.name)setCollegeName(d.name);}
            }
          }catch(e){console.warn("College logo fetch:",e);}
        }
        const examsRef=collection(db,"exams");
        let eligibleExams=[];
        if(uData?.userType==="college"&&uData?.collegeId){
          const q=query(examsRef,or(where("assignedColleges","array-contains",uData.collegeId),where("registeredStudents","array-contains",uData.regNo||"")));
          const snap=await getDocs(q);eligibleExams=snap.docs.map(d=>({id:d.id,...d.data()}));
        }else{
          const q=query(examsRef,where("isPublic","==",true));
          const snap=await getDocs(q);eligibleExams=snap.docs.map(d=>({id:d.id,...d.data()}));
        }
        setExams(eligibleExams);
        try {
          const subSnap = await getDocs(query(collection(db,"submissions"),where("studentId","==",currentUser.uid)));
          const subMap  = {};
          subSnap.docs.forEach(d => {
            const data = d.data();
            if (!data.examId) return;
            const existing = subMap[data.examId];
            if (!existing || data.status === "completed" || !existing.status) {
              subMap[data.examId] = { id: d.id, ...data };
            }
          });
          setDashboardSubmissions(subMap);
        } catch(e) { console.warn("Dashboard submission fetch:", e); }
        const catSnap=await getDocs(query(collection(db,"categories"),orderBy("name")));
        setCategories(catSnap.docs.map(d=>({id:d.id,...d.data()})));
        const qSnap=await getDocs(collection(db,"questions"));
        setQuestions(qSnap.docs.map(d=>({id:d.id,...d.data()})));
        const lbSnap=await getDocs(query(collection(db,"users"),where("role","==","student"),orderBy("totalScore","desc"),limit(10)));
        setLeaderboard(lbSnap.docs.map(d=>({id:d.id,...d.data()})));
      }catch(err){console.error(err);}
      setIsLoading(false);
    };
    fetchAll();
  },[currentUser,collegeId]);

  const handleLogout=async()=>{try{await appSignOut();history.push("/login");}catch(e){console.error(e);}};

  const handleStartExam = (examId, existingSubmissionId = null) => {
    if (!currentUser || !examId) return;
    if (existingSubmissionId) {
      history.push(`/exam/${examId}/${existingSubmissionId}`);
      return;
    }
    setExamDetailsModal({ examId });
  };

  const handleDetailsSubmit = async ({ name, branch, section }) => {
    if (!examDetailsModal) return;
    const { examId } = examDetailsModal;
    setExamDetailsModal(null);
    setIsStarting(true);
    try {
      const exam        = exams.find(e => e.id === examId);
      const submissionId = await startSubmission({
        examId,
        examTitle:    exam?.title,
        studentId:    currentUser.uid,
        studentName:  name || displayName,
        studentEmail: currentUser.email,
        studentRegNo: userProfile?.regNo || '',
        branch,
        section,
        department:   branch,
      });
      history.push(`/exam/${examId}/${submissionId}`);
    } catch (err) {
      console.error(err);
      alert('Could not start exam. Please try again.');
    }
    setIsStarting(false);
  };

  const myRank = leaderboard.findIndex(s=>s.id===currentUser?.uid)+1;
  const examSubmissions = Object.values(dashboardSubmissions);
  const completedE = examSubmissions.filter(s => s.status === "completed").length;
  const examXP = examSubmissions
    .filter(s => s.status === "completed")
    .reduce((acc, s) => {
      const correct = s.correctCount ?? s.correctAnswers ?? 0;
      const total   = s.totalQuestions ?? s.questionCount ?? exams.find(e => e.id === s.examId)?.questionIds?.length ?? 1;
      const score   = s.totalScore ?? s.score ?? 0;
      // Use totalScore if available, else derive from correct/total * 100
      const xp = score > 0 ? score : Math.round((correct / total) * 100);
      return acc + xp;
    }, 0);

  const practiceAttempts = userProfile?.practiceAttempts || userProfile?.totalAttempts || 0;
  const practiceXP = practiceAttempts * 5;
  const myScore    = examXP + practiceXP;
  const accuracyVal= userProfile?.accuracy || 0;

  const qByCategory = {};
  questions.forEach(q => {
    const key = q.category || q.categoryId || "General";
    if (!qByCategory[key]) qByCategory[key] = [];
    qByCategory[key].push(q);
  });
  const resolvedTotalQuestions = categories.reduce((acc, cat) => {
    const byId   = questions.filter(q => cat.questionIds?.includes(q.id));
    const byName = qByCategory[cat.name] || [];
    return acc + (byId.length ? byId.length : byName.length);
  }, 0);

  const STATS=[
    {label:"Enrolled Courses",value:categories.length,         icon:"📘",color:"#ff6b35",bg:dark?"rgba(255,107,53,0.12)":"#fff4f0",border:dark?"rgba(255,107,53,0.25)":"#ffd5c2"},
    {label:"Total Questions", value:resolvedTotalQuestions,    icon:"📝",color:"#5a6cf5",bg:dark?"rgba(90,108,245,0.12)":"#f0f1ff",border:dark?"rgba(90,108,245,0.25)":"#d4d7fd"},
    {label:"Exams Attended",  value:completedE,                icon:"✅",color:"#00b8a3",bg:dark?"rgba(0,184,163,0.12)":"#f0faf9",border:dark?"rgba(0,184,163,0.25)":"#b3e8e3"},
    {label:"Global Rank",     value:myRank>0?`#${myRank}`:"—",icon:"🎯",color:"#f0a500",bg:dark?"rgba(240,165,0,0.12)":"#fffbf0",border:dark?"rgba(240,165,0,0.25)":"#fde8a0"},
  ];
  const ACCURACY_DATA=[{name:"Score",value:accuracyVal||Math.min(100,Math.round((myScore/5000)*100)),fill:"#ff6b35"},{name:"Rest",value:100-(accuracyVal||Math.min(100,Math.round((myScore/5000)*100))),fill:dark?"#21262d":"#f3f4f6"}];

  // ── ONLY live + upcoming exams for the dashboard preview ──────────────────
  const activeAndUpcomingExams = useMemo(() =>
    exams.filter(exam => {
      const ws = getWindowStatus(exam);
      return ws === "live" || ws === "upcoming";
    }),
  [exams]);

  const renderDashboard=()=>(
    <div className="section-enter">
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"1.125rem",marginBottom:"2rem"}}>
        {STATS.map((s,i)=>(
          <div key={i} style={{borderRadius:"12px",padding:"1.375rem 1.5rem",background:s.bg,border:`1px solid ${s.border}`,position:"relative",overflow:"hidden",cursor:["Enrolled Courses","Total Questions"].includes(s.label)?"pointer":"default",transition:"all .2s ease"}}
            onClick={()=>{if(s.label==="Enrolled Courses")setActiveNav("courses");if(s.label==="Total Questions")setActiveNav("modules");}}
            onMouseEnter={e=>{if(["Enrolled Courses","Total Questions"].includes(s.label))e.currentTarget.style.transform="translateY(-3px)";}}
            onMouseLeave={e=>{e.currentTarget.style.transform="";}}>
            <div style={{position:"absolute",top:-10,right:-10,fontSize:"2.75rem",opacity:0.08,transform:"rotate(15deg)"}}>{s.icon}</div>
            <div style={{fontSize:"0.7rem",color:T.textFaint,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:"0.625rem"}}>{s.label}</div>
            <div style={{...NUM_STYLE,fontSize:"2.25rem",fontWeight:800,color:s.color,lineHeight:1}}>{typeof s.value==="string"?s.value:<Counter target={s.value}/>}</div>
            <div style={{marginTop:"0.875rem"}}><ProgressBar value={50} color={s.color} trackColor={T.bgHover}/></div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 360px",gap:"1.75rem"}}>
        <div style={{display:"flex",flexDirection:"column",gap:"1.75rem"}}>
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.125rem"}}>
              <div style={{fontSize:"1.1rem",fontWeight:700,color:T.text}}>Learning Tracks</div>
              <button onClick={()=>setActiveNav("courses")} style={{background:"transparent",border:"1px solid #e5e7eb",borderRadius:"8px",padding:"0.375rem 0.9rem",color:"#6b7280",fontSize:"0.78rem",cursor:"pointer",fontWeight:600,transition:"all .15s"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="#ffd5c2";e.currentTarget.style.color="#ff6b35";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="#e5e7eb";e.currentTarget.style.color="#6b7280";}}>View all →</button>
            </div>
            {categories.length===0?<div style={{color:T.textFaint,fontSize:"0.9rem",padding:"1.25rem",textAlign:"center"}}>No modules found.</div>:(
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.875rem"}}>
                {categories.slice(0,4).map((cat,i)=>{
                  const color=MODULE_COLORS[i%MODULE_COLORS.length];
                  const byId   = questions.filter(q => cat.questionIds?.includes(q.id));
                  const byName = qByCategory[cat.name] || [];
                  const resolvedQ = byId.length ? byId : byName;
                  const qCount    = resolvedQ.length;
                  return(
                    <Link key={cat.id} to={practicePath(cat)} style={{textDecoration:"none",display:"block",borderRadius:"10px",padding:"1rem 1.125rem",background:T.bgCard,border:`1px solid ${T.border}`,cursor:"pointer",transition:"all .15s"}}
                      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.borderColor=`${color}60`;e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,0.08)";}}
                      onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.borderColor=T.border;e.currentTarget.style.boxShadow="";}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"0.75rem"}}>
                        <div>
                          <div style={{fontSize:"0.88rem",fontWeight:600,color:T.textSub}}>{cat.name}</div>
                          <div style={{...NUM_STYLE,fontSize:"0.72rem",color:T.textFaint,marginTop:"0.15rem"}}>{qCount} questions</div>
                        </div>
                        <span style={{background:`${color}20`,border:`1px solid ${color}40`,borderRadius:"8px",padding:"0.25rem 0.55rem",fontSize:"0.7rem",fontWeight:700,color}}>{cat.accessType||"global"}</span>
                      </div>
                      <ProgressBar value={Math.min(100,qCount*5)} color={color} trackColor={T.bgHover}/>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Upcoming Exams — only live & upcoming, never missed ── */}
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.125rem"}}>
              <div style={{fontSize:"1.1rem",fontWeight:700,color:T.text}}>
                Upcoming Exams
                {activeAndUpcomingExams.length > 0 && (
                  <span style={{
                    marginLeft:8, fontSize:"0.65rem", fontWeight:800,
                    background:"rgba(16,185,129,0.12)", color:"#10b981",
                    border:"1px solid rgba(16,185,129,0.3)",
                    borderRadius:20, padding:"2px 8px",
                    verticalAlign:"middle",
                  }}>
                    {activeAndUpcomingExams.length} active
                  </span>
                )}
              </div>
              <button onClick={()=>setActiveNav("exams")} style={{background:"transparent",border:"1px solid #e5e7eb",borderRadius:"8px",padding:"0.375rem 0.9rem",color:"#6b7280",fontSize:"0.78rem",cursor:"pointer",fontWeight:600,transition:"all .15s"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="#ffd5c2";e.currentTarget.style.color="#ff6b35";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="#e5e7eb";e.currentTarget.style.color="#6b7280";}}>View all →</button>
            </div>

            {activeAndUpcomingExams.length === 0 ? (
              <div style={{
                color: T.textFaint, fontSize: "0.9rem",
                padding: "1.75rem", textAlign: "center",
                border: `1px dashed ${T.border}`, borderRadius: "10px",
              }}>
                No live or upcoming exams right now.
              </div>
            ) : (
              <div style={{display:"flex",flexDirection:"column",gap:"0.625rem"}}>
                {activeAndUpcomingExams.slice(0, 3).map(exam => {
                  const ws     = getWindowStatus(exam);
                  const isLive = ws === "live";
                  const sub    = dashboardSubmissions[exam.id];
                  return (
                    <div key={exam.id} style={{
                      display:"flex", alignItems:"center", justifyContent:"space-between",
                      padding:"0.9rem 1.125rem",
                      background: isLive ? "rgba(16,185,129,0.06)" : T.bgCard,
                      border: `1px solid ${isLive ? "rgba(16,185,129,0.3)" : T.border}`,
                      borderRadius:"10px", gap:"1.125rem",
                      boxShadow: isLive ? "0 0 0 2px rgba(16,185,129,0.08)" : "none",
                    }}>
                      {/* Live pulse dot */}
                      {isLive && (
                        <span style={{
                          width:8, height:8, borderRadius:"50%",
                          background:"#10b981", flexShrink:0,
                          animation:"liveDot 1.5s infinite",
                          boxShadow:"0 0 0 0 rgba(16,185,129,0.4)",
                        }}/>
                      )}
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:"0.15rem",flexWrap:"wrap"}}>
                          <span style={{fontSize:"0.9rem",fontWeight:600,color:T.text}}>{exam.title}</span>
                          <ExamTypeBadge examType={exam.examType || "EXAM"} />
                          {isLive && (
                            <span style={{
                              fontSize:"0.6rem", fontWeight:800,
                              background:"rgba(16,185,129,0.12)", color:"#10b981",
                              border:"1px solid rgba(16,185,129,0.3)",
                              borderRadius:20, padding:"1px 7px",
                              textTransform:"uppercase", letterSpacing:"0.07em",
                            }}>
                              LIVE
                            </span>
                          )}
                        </div>
                        <div style={{...NUM_STYLE,fontSize:"0.75rem",color:T.textFaint}}>
                          {exam.scheduledStartTime ? fmtDate(exam.scheduledStartTime) : "Date TBD"}
                          {" · "}{exam.durationMinutes ?? 60} min
                        </div>
                      </div>
                      {isLive ? (
                        sub?.status === "completed"
                          ? <span style={{fontSize:"0.72rem",fontWeight:700,padding:"0.25rem 0.7rem",borderRadius:"5px",background:"rgba(90,108,245,0.1)",color:"#5a6cf5",border:"1px solid rgba(90,108,245,0.3)",flexShrink:0}}>✓ Submitted</span>
                          : <button onClick={() => handleStartExam(exam.id, sub?.id || null)}
                              style={{background:"linear-gradient(135deg,#10b981,#059669)",border:"none",borderRadius:"8px",padding:"0.5rem 1.125rem",color:"#fff",fontSize:"0.78rem",fontWeight:700,cursor:"pointer",flexShrink:0,boxShadow:"0 3px 10px rgba(16,185,129,0.35)"}}>
                              {sub ? "Resume →" : "Start →"}
                            </button>
                      ) : (
                        // upcoming — show countdown-style label
                        <span style={{...NUM_STYLE,fontSize:"0.72rem",fontWeight:600,padding:"0.25rem 0.7rem",borderRadius:"5px",background:"rgba(249,115,22,0.08)",color:"#f97316",border:"1px solid rgba(249,115,22,0.25)",flexShrink:0}}>
                          🔒 Upcoming
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right column — profile card, score ring, leaderboard */}
        <div style={{display:"flex",flexDirection:"column",gap:"1.125rem"}}>
          <div style={{borderRadius:"14px",padding:"1.5rem",background:T.bgCard,border:`1px solid ${T.border}`,textAlign:"center"}}>
            {collegeLogo&&(
              <div style={{marginBottom:"0.875rem",display:"flex",flexDirection:"column",alignItems:"center",gap:"0.4rem"}}>
                <img src={collegeLogo} alt={collegeName||"College"} style={{width:64,height:64,objectFit:"contain",borderRadius:"10px",border:`1px solid ${T.border}`,background:"#fff",padding:"4px"}}/>
                {collegeName&&<span style={{fontSize:"0.72rem",fontWeight:700,color:T.textMuted,letterSpacing:"0.04em"}}>{collegeName}</span>}
              </div>
            )}
            <div style={{width:62,height:62,borderRadius:"50%",background:"#ff6b35",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:"1.25rem",color:"#fff",margin:"0 auto 0.875rem",overflow:"hidden"}}>
              {currentUser?.photoURL?<img src={currentUser.photoURL} alt="av" style={{width:"100%",height:"100%",borderRadius:"50%",objectFit:"cover"}}/>:initials}
            </div>
            <div style={{fontWeight:700,fontSize:"1rem",color:T.text}}>{displayName}</div>
            <div style={{fontSize:"0.75rem",color:T.textFaint,marginTop:"0.2rem"}}>{currentUser?.email}</div>
            <div style={{display:"inline-flex",alignItems:"center",background:"#fff4f0",border:"1px solid #ffd5c2",borderRadius:"20px",padding:"0.3rem 1rem",marginTop:"0.75rem",fontSize:"0.75rem",fontWeight:700,color:"#ff6b35"}}>{userProfile?.level||"Student"}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"0.625rem",marginTop:"1rem"}}>
              {[
                {label:"Rank",  val:myRank>0?`#${myRank}`:"—",  color:"#ff6b35"},
                {label:"Score", val:myScore.toLocaleString(),    color:"#5a6cf5"},
                {label:"Exams", val:completedE,                  color:"#00b8a3"},
              ].map((s,i)=>(
                <div key={i} style={{background:T.bgHover,borderRadius:"9px",padding:"0.6rem 0.3rem",border:`1px solid ${T.border}`}}>
                  <div style={{...NUM_STYLE,fontWeight:700,fontSize:"1rem",color:s.color}}>{s.val}</div>
                  <div style={{fontSize:"0.65rem",color:T.textFaint,marginTop:"0.15rem",textTransform:"uppercase",letterSpacing:"0.06em"}}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:"14px",padding:"1.375rem"}}>
            <div style={{fontSize:"0.9rem",fontWeight:700,color:T.text,marginBottom:"0.3rem"}}>Score Progress</div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
              <ResponsiveContainer width={155} height={155}>
                <RadialBarChart cx="50%" cy="50%" innerRadius="55%" outerRadius="85%" data={ACCURACY_DATA} startAngle={90} endAngle={-270}>
                  <RadialBar dataKey="value" cornerRadius={4} background={false}/>
                </RadialBarChart>
              </ResponsiveContainer>
              <div style={{position:"absolute",textAlign:"center"}}>
                <div style={{...NUM_STYLE,fontWeight:800,fontSize:"1.35rem",color:"#ff6b35"}}>{myScore.toLocaleString()}</div>
                <div style={{fontSize:"0.65rem",color:T.textFaint,letterSpacing:"0.06em"}}>XP</div>
              </div>
            </div>
          </div>
          <div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:"14px",overflow:"hidden"}}>
            <div style={{borderBottom:`1px solid ${T.border}`,padding:"0.875rem 1.125rem",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontWeight:700,fontSize:"0.9rem",color:T.text}}>🏆 Top Coders</span>
              <button onClick={()=>setActiveNav("leaderboard")} style={{background:"transparent",border:"none",cursor:"pointer",fontSize:"0.72rem",color:"#ff6b35",fontWeight:700}}>See all →</button>
            </div>
            {leaderboard.length===0&&<div style={{padding:"1.75rem",textAlign:"center",color:T.textFaint,fontSize:"0.88rem"}}>No data yet.</div>}
            {leaderboard.slice(0,5).map((s,i)=>{
              const isMe=s.id===currentUser?.uid;const badge=i===0?"🥇":i===1?"🥈":i===2?"🥉":"·";
              return(
                <div key={s.id} style={{padding:"0.65rem 1.125rem",borderBottom:i<4?`1px solid ${T.border}`:"none",display:"flex",alignItems:"center",gap:"0.875rem",background:isMe?T.accentLight:"transparent"}}>
                  <span style={{fontSize:i<3?"1rem":"0.85rem",width:24,textAlign:"center",color:i>=3?"#9ca3af":undefined,fontWeight:600}}>{badge}</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:"0.85rem",fontWeight:isMe?700:500,color:isMe?"#ff6b35":T.text}}>
                      {s.name||s.displayName||"Anonymous"}
                      {isMe&&<span style={{marginLeft:"0.4rem",fontSize:"0.62rem",background:"#fff4f0",color:"#ff6b35",padding:"0.1rem 0.4rem",borderRadius:"4px",fontWeight:700,border:"1px solid #ffd5c2"}}>you</span>}
                    </div>
                  </div>
                  <span style={{...NUM_STYLE,fontSize:"0.82rem",fontWeight:700,color:isMe?"#ff6b35":T.textMuted}}>{(s.totalScore||0).toLocaleString()}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  return(
    <div style={{fontFamily:"'Segoe UI',system-ui,-apple-system,sans-serif",background:T.bg,color:T.text,minHeight:"100vh",display:"flex",overflow:"hidden",transition:"background .3s ease,color .3s ease"}}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:5px;}
        ::-webkit-scrollbar-track{background:${dark?"#0d1117":"#f7f8fa"};}
        ::-webkit-scrollbar-thumb{background:${dark?"#30363d":"#e5e7eb"};border-radius:3px;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}
        @keyframes blink{0%,100%{opacity:1;}50%{opacity:0.4;}}
        @keyframes spin{to{transform:rotate(360deg);}}
        @keyframes liveDot{0%{box-shadow:0 0 0 0 rgba(16,185,129,0.6);}70%{box-shadow:0 0 0 7px rgba(16,185,129,0);}100%{box-shadow:0 0 0 0 rgba(16,185,129,0);}}
        .section-enter{animation:fadeUp .3s ease both;}
        h1,h2,h3{font-family:'Segoe UI',system-ui,sans-serif;}
        button,input,a{font-family:'Segoe UI',system-ui,-apple-system,sans-serif;}
      `}</style>

      <aside style={{width:SW,minHeight:"100vh",background:dark?"#0d1117":"#ffffff",borderRight:`1px solid ${T.sidebarBorder}`,display:"flex",flexDirection:"column",position:"fixed",top:0,left:0,bottom:0,zIndex:100,transition:"width .3s cubic-bezier(0.4,0,0.2,1)",overflow:"hidden"}}>
        <div style={{padding:sidebarOpen?"1.375rem 1.125rem 1.125rem":"1.375rem 0 1.125rem",borderBottom:`1px solid ${T.sidebarBorder}`,flexShrink:0,position:"relative",display:"flex",alignItems:"center",justifyContent:sidebarOpen?"flex-start":"center",minHeight:70}}>
          <div style={{display:"flex",alignItems:"center",gap:sidebarOpen?"0.875rem":0,width:"100%",justifyContent:sidebarOpen?"flex-start":"center"}}>
            {collegeLogo?(
              <img src={collegeLogo} alt="logo" style={{width:36,height:36,borderRadius:"8px",objectFit:"contain",background:"#fff",padding:"2px",border:`1px solid ${T.border}`,flexShrink:0,display:"block"}}/>
            ):(
              <div style={{width:36,height:36,borderRadius:"8px",background:"#ff6b35",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.05rem",fontWeight:900,color:"#fff",flexShrink:0}}>M</div>
            )}
            {sidebarOpen&&(
              <div style={{overflow:"hidden"}}>
                <div style={{fontWeight:800,fontSize:"1.02rem",color:T.text,whiteSpace:"nowrap"}}>{collegeName||"Mind Code"}</div>
                <div style={{fontSize:"0.6rem",color:"#ff6b35",letterSpacing:"0.12em",textTransform:"uppercase",fontWeight:600}}>Student Portal</div>
              </div>
            )}
          </div>
          <button onClick={()=>setSidebarOpen(p=>!p)} style={{position:"absolute",top:"50%",right:"-13px",transform:"translateY(-50%)",width:26,height:26,borderRadius:"50%",background:T.bgCard,border:`1px solid ${T.border}`,cursor:"pointer",color:T.textMuted,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:T.shadow,transition:"all .15s",zIndex:10}}
            onMouseEnter={e=>{e.currentTarget.style.background=T.accentLight;e.currentTarget.style.borderColor=T.accentBorder;e.currentTarget.style.color="#ff6b35";}}
            onMouseLeave={e=>{e.currentTarget.style.background=T.bgCard;e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.textMuted;}}>
            {sidebarOpen?ICONS.chevL:ICONS.chevR}
          </button>
        </div>

        <nav style={{flex:1,padding:"0.875rem 0.625rem",overflowY:"auto"}}>
          {NAV_ITEMS.map(item=>(
            <button key={item.id} onClick={()=>setActiveNav(item.id)} title={!sidebarOpen?item.label:undefined}
              style={{width:"100%",display:"flex",alignItems:"center",justifyContent:sidebarOpen?"flex-start":"center",gap:sidebarOpen?"0.875rem":0,padding:sidebarOpen?"0.65rem 0.875rem":"0.65rem 0",borderRadius:"9px",border:"none",borderLeft:activeNav===item.id?"3px solid #ff6b35":"3px solid transparent",background:activeNav===item.id?"#fff4f0":"transparent",cursor:"pointer",color:activeNav===item.id?"#ff6b35":T.textMuted,fontSize:"0.9rem",fontWeight:activeNav===item.id?600:400,marginBottom:"0.15rem",textAlign:"left",transition:"all .15s"}}
              onMouseEnter={e=>{if(activeNav!==item.id){e.currentTarget.style.background=dark?"#1c2128":"#f7f8fa";e.currentTarget.style.color=dark?"#e6edf3":"#1a1a1a";}}}
              onMouseLeave={e=>{if(activeNav!==item.id){e.currentTarget.style.background="transparent";e.currentTarget.style.color=T.textMuted;}}}>
              <span style={{display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{item.icon}</span>
              {sidebarOpen&&<span style={{whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div style={{padding:"0.875rem",borderTop:`1px solid ${T.sidebarBorder}`,flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:sidebarOpen?"0.75rem":0,justifyContent:sidebarOpen?"flex-start":"center",padding:"0.75rem",borderRadius:"10px",background:T.bgHover,border:`1px solid ${T.border}`}}>
            <div style={{width:36,height:36,borderRadius:"50%",background:"#ff6b35",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.9rem",fontWeight:800,color:"#fff",flexShrink:0,overflow:"hidden"}}>
              {currentUser?.photoURL?<img src={currentUser.photoURL} alt="av" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:initials}
            </div>
            {sidebarOpen&&(
              <>
                <div style={{overflow:"hidden",flex:1}}>
                  <div style={{fontSize:"0.82rem",fontWeight:600,color:T.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{firstName}.</div>
                  <div style={{...NUM_STYLE,fontSize:"0.65rem",color:T.textFaint}}>{userProfile?.level||"Student"} · {myRank>0?`Rank #${myRank}`:"Unranked"}</div>
                </div>
                <button onClick={handleLogout} style={{display:"flex",alignItems:"center",gap:"0.3rem",background:"transparent",border:`1px solid ${T.border}`,borderRadius:"7px",padding:"0.35rem 0.65rem",cursor:"pointer",fontSize:"0.65rem",color:"#6b7280",fontWeight:600,flexShrink:0,transition:"all .15s"}}
                  onMouseEnter={e=>{e.currentTarget.style.background="#fef2f2";e.currentTarget.style.borderColor="#fca5a5";e.currentTarget.style.color="#ef4444";}}
                  onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color="#6b7280";}}>
                  {ICONS.logout}<span>Out</span>
                </button>
              </>
            )}
            {!sidebarOpen&&(
              <button onClick={handleLogout} style={{display:"flex",alignItems:"center",justifyContent:"center",background:"transparent",border:"none",cursor:"pointer",color:T.textMuted,padding:"0.3rem",borderRadius:"5px",transition:"color .15s",marginLeft:"0.25rem"}}
                onMouseEnter={e=>e.currentTarget.style.color="#ef4444"}
                onMouseLeave={e=>e.currentTarget.style.color=T.textMuted}>{ICONS.logout}</button>
            )}
          </div>
        </div>
      </aside>

      <main style={{marginLeft:SW,flex:1,minHeight:"100vh",transition:"margin-left .3s cubic-bezier(0.4,0,0.2,1)",position:"relative",zIndex:1,overflowY:"auto",display:"flex",flexDirection:"column"}}>
        <header style={{position:"sticky",top:0,zIndex:50,background:T.bgHeader,backdropFilter:"blur(8px)",borderBottom:`1px solid ${T.sidebarBorder}`,padding:"0.875rem 2.25rem",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"1.125rem",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:"0.875rem"}}>
            {collegeLogo&&<img src={collegeLogo} alt={collegeName||"College"} style={{width:36,height:36,objectFit:"contain",borderRadius:"8px",border:`1px solid ${T.border}`,background:"#fff",padding:"3px"}}/>}
            <div>
              <div style={{fontWeight:700,fontSize:"1.2rem",color:T.text}}>Hi, {firstName} 👋</div>
              <div style={{fontSize:"0.75rem",color:T.textFaint,marginTop:"0.1rem"}}>
                {new Date().toLocaleDateString("en-IN",{weekday:"long",month:"long",day:"numeric"})}
                {userProfile?.streak>0&&<span style={{...NUM_STYLE,color:"#ff6b35",marginLeft:"0.6rem",fontWeight:600}}>🔥 {userProfile.streak}d</span>}
              </div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:"0.6rem",flex:1,maxWidth:400,background:T.inputBg,border:`1px solid ${T.border}`,borderRadius:"9px",padding:"0.525rem 1rem"}}>
            <span style={{color:T.textFaint,display:"flex"}}>{ICONS.search}</span>
            <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Search modules, exams…" style={{background:"transparent",border:"none",outline:"none",color:T.text,fontSize:"0.85rem",width:"100%"}}/>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:"0.875rem"}}>
            <button onClick={toggleTheme} style={{width:42,height:42,borderRadius:"11px",border:`1.5px solid ${dark?"#30363d":"#e5e7eb"}`,background:dark?"#161b22":"#f7f8fa",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s ease",flexShrink:0,position:"relative",overflow:"hidden"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="#ff6b35";e.currentTarget.style.background=dark?"#1e2a38":"#fff4f0";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=dark?"#30363d":"#e5e7eb";e.currentTarget.style.background=dark?"#161b22":"#f7f8fa";}}>
              <span style={{position:"absolute",opacity:dark?1:0,transform:dark?"scale(1)":"scale(0.5)",transition:"all .3s ease",color:"#f59e0b"}}>{ICONS.sun}</span>
              <span style={{position:"absolute",opacity:dark?0:1,transform:dark?"scale(0.5)":"scale(1)",transition:"all .3s ease",color:"#6366f1"}}>{ICONS.moon}</span>
            </button>
            {userProfile?.streak>0&&<div style={{display:"flex",alignItems:"center",gap:"0.4rem",background:T.accentLight,border:`1px solid ${T.accentBorder}`,borderRadius:"9px",padding:"0.4rem 0.875rem"}}><span style={{color:"#ff6b35",display:"flex"}}>{ICONS.fire}</span><span style={{...NUM_STYLE,fontSize:"0.82rem",fontWeight:700,color:"#ff6b35"}}>{userProfile.streak}d</span></div>}
            <div style={{background:T.accentLight,border:`1px solid ${T.accentBorder}`,borderRadius:"9px",padding:"0.4rem 1rem",fontSize:"0.82rem",fontWeight:700,color:"#ff6b35",...NUM_STYLE}}>{myScore.toLocaleString()} XP</div>
          </div>
        </header>

        <div style={{padding:isFullscreen?"0":"2rem 2.25rem",maxWidth:isFullscreen?"none":1320,margin:isFullscreen?"0":"0 auto",flex:isFullscreen?1:"unset",display:isFullscreen?"flex":"block",flexDirection:isFullscreen?"column":"unset",overflow:isFullscreen?"hidden":"unset",width:"100%"}}>
          {isLoading?<Spinner/>:(
            <>
              {activeNav==="dashboard"   && renderDashboard()}
              {activeNav==="courses"     && <EnrolledCoursesView categories={categories} questions={questions} T={T}/>}
              {activeNav==="modules"     && <GlobalModulesView categories={categories} questions={questions} T={T}/>}
              {activeNav==="learning"    && <LearningModulesView categories={categories} collegeId={collegeId} T={T}/>}
              {activeNav==="exams"       && <ExamsView exams={exams} currentUser={currentUser} onStartExam={handleStartExam} T={T}/>}
              {activeNav==="sandbox"&&(
                <div style={{flex:1,overflow:"hidden"}}>
                  <FreeSandboxTerminal dark={dark} onBack={()=>setActiveNav("dashboard")}/>
                </div>
              )}
              {activeNav==="leaderboard" && <LeaderboardView leaderboard={leaderboard} currentUser={currentUser} T={T}/>}
              {activeNav==="reports"     && <ReportsView questions={questions} exams={exams} leaderboard={leaderboard} currentUser={currentUser} dashboardSubmissions={dashboardSubmissions} T={T}/>}
            </>
          )}
        </div>
      </main>

      {examDetailsModal&&(
        <ExamDetailsForm
          prefillRegNo={userProfile?.regNo||''}
          prefillName={displayName}
          examTitle={exams.find(e=>e.id===examDetailsModal.examId)?.title||''}
          dark={dark}
          onSubmit={handleDetailsSubmit}
          onCancel={()=>setExamDetailsModal(null)}
        />
      )}

      {isStarting&&(
        <div style={{position:"fixed",inset:0,background:dark?"rgba(13,17,23,0.95)":"rgba(255,255,255,0.95)",zIndex:999,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"1.25rem"}}>
          <div style={{width:48,height:48,border:"3px solid #ffd5c2",borderTop:"3px solid #ff6b35",borderRadius:"50%",animation:"spin .8s linear infinite"}}/>
          <div style={{fontSize:"0.95rem",color:"#ff6b35",fontWeight:700,letterSpacing:"0.08em"}}>Starting Exam…</div>
          <div style={{fontSize:"0.78rem",color:"#9ca3af"}}>Entering full-screen proctored mode</div>
        </div>
      )}
    </div>
  );
}
































// import { useState, useEffect, useCallback, useRef, useMemo } from "react";
// import { useHistory, Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { db } from "../firebase/config";
// import ExamDetailsForm from "../components/student/ExamDetailsForm";
// import {
//   collection, query, orderBy, limit,
//   getDocs, where, doc, getDoc, or,
// } from "firebase/firestore";
// import { startSubmission } from "../api/examService";
// import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
// import LearningModulesView from "./LearningModulesView";
// import FreeSandboxTerminal from "./FreeSandboxTerminal";
// import ExamsView from "../components/student/ExamsView";

// const MODULE_COLORS = ["#ff6b35","#00b8a3","#5a6cf5","#f0a500","#e05c7a","#36b37e","#8b5cf6","#0ea5e9"];
// const Icon = ({ d, size=18, stroke="currentColor", fill="none", sw=1.5, viewBox="0 0 16 16", ...extra }) => (
//   <svg viewBox={viewBox} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
//     style={{ width:size, height:size, flexShrink:0 }} {...extra}>{d}</svg>
// );
// const ICONS = {
//   dashboard:   <Icon d={<><rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1.5"/><rect x="9" y="1.5" width="5.5" height="5.5" rx="1.5"/><rect x="1.5" y="9" width="5.5" height="5.5" rx="1.5"/><rect x="9" y="9" width="5.5" height="5.5" rx="1.5"/></>} />,
//   courses:     <Icon d={<><path d="M2 4.5C2 3.4 2.9 2.5 4 2.5h8c1.1 0 2 .9 2 2v8c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2v-8z"/><line x1="5" y1="6" x2="11" y2="6"/><line x1="5" y1="8.5" x2="11" y2="8.5"/><line x1="5" y1="11" x2="8.5" y2="11"/></>} />,
//   modules:     <Icon d={<><circle cx="8" cy="8" r="6"/><path d="M8 2c-2 2-3 4-3 6s1 4 3 6"/><path d="M8 2c2 2 3 4 3 6s-1 4-3 6"/><line x1="2" y1="8" x2="14" y2="8"/></>} />,
//   exams:       <Icon d={<><rect x="2.5" y="1.5" width="11" height="13" rx="1.5"/><line x1="5" y1="5" x2="11" y2="5"/><line x1="5" y1="7.5" x2="11" y2="7.5"/><line x1="5" y1="10" x2="8.5" y2="10"/></>} />,
//   leaderboard: <Icon d={<><rect x="1.5" y="9" width="3" height="5.5" rx="0.5"/><rect x="6.5" y="5.5" width="3" height="9" rx="0.5"/><rect x="11.5" y="7" width="3" height="7.5" rx="0.5"/></>} />,
//   reports:     <Icon d={<><path d="M2 13L5.5 9l3 3L12 6l2 2"/><line x1="2" y1="2" x2="2" y2="14"/><line x1="2" y1="14" x2="14" y2="14"/></>} />,
//   chevL:       <Icon d={<polyline points="10 12 6 8 10 4"/>} />,
//   chevR:       <Icon d={<polyline points="6 4 10 8 6 12"/>} />,
//   sun:         <Icon size={20} viewBox="0 0 24 24" d={<><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>} />,
//   moon:        <Icon size={20} viewBox="0 0 24 24" d={<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>} />,
//   logout:      <Icon size={17} viewBox="0 0 24 24" d={<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>} />,
//   search:      <Icon size={17} viewBox="0 0 24 24" d={<><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>} />,
//   fire:        <Icon size={16} viewBox="0 0 24 24" fill="currentColor" stroke="none" d={<path d="M12 2c0 0-5 4-5 9a5 5 0 0 0 10 0c0-5-5-9-5-9zm0 14a3 3 0 0 1-3-3c0-2 1.5-4 3-6 1.5 2 3 4 3 6a3 3 0 0 1-3 3z"/>} />,
//   sandbox:     <Icon d={<><rect x="1.5" y="2.5" width="13" height="11" rx="1.5"/><polyline points="4 6 7 9 4 12"/><line x1="8.5" y1="12" x2="12.5" y2="12"/><circle cx="12" cy="4.5" r="1.5" fill="currentColor" stroke="none"/></>} />,
// };

// const NAV_ITEMS = [
//   { id:"dashboard",   icon:ICONS.dashboard,   label:"Dashboard" },
//   { id:"courses",     icon:ICONS.courses,     label:"Enrolled Courses" },
//   { id:"modules",     icon:ICONS.modules,     label:"Global Modules" },
//   { id:"exams",       icon:ICONS.exams,       label:"Exams" },
//   { id:"learning",    icon:ICONS.modules,     label:"Learning Modules" },
//   { id:"leaderboard", icon:ICONS.leaderboard, label:"Leaderboard" },
//   { id:"reports",     icon:ICONS.reports,     label:"Reports" },
// ];

// const NUM_STYLE = {
//   fontFamily: "'JetBrains Mono','Fira Code','Cascadia Code','SF Mono','Consolas','Courier New',monospace",
//   fontVariantNumeric: "tabular-nums",
//   letterSpacing: "-0.02em",
// };

// const EXAM_TYPE_CFG = {
//   DAILY:  { icon: "📅", color: "#10b981" },
//   WEEKLY: { icon: "📊", color: "#3b82f6" },
//   EXAM:   { icon: "🎓", color: "#f97316" },
// };

// function ExamTypeBadge({ examType }) {
//   const cfg = EXAM_TYPE_CFG[examType] || EXAM_TYPE_CFG.EXAM;
//   return (
//     <span style={{
//       fontSize: "0.6rem", fontWeight: 700,
//       padding: "1px 6px", borderRadius: 4,
//       background: `${cfg.color}18`, color: cfg.color,
//       border: `1px solid ${cfg.color}30`,
//       textTransform: "uppercase", letterSpacing: "0.06em", flexShrink: 0,
//     }}>
//       {cfg.icon} {examType || "EXAM"}
//     </span>
//   );
// }

// function getWindowStatus(exam) {
//   if (exam.status === "completed") return "completed";
//   const start = exam.scheduledStartTime?.toDate?.() ?? new Date(exam.scheduledStartTime);
//   const end   = new Date(start.getTime() + (exam.durationMinutes ?? 60) * 60 * 1000);
//   const now   = new Date();
//   if (now >= start && now <= end) return "live";
//   if (now < start) return "upcoming";
//   return "missed";
// }
// function fmtDate(val) { const d=val?.toDate?val.toDate():new Date(val); return d.toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}); }
// function fmtTime(val) { const d=val?.toDate?val.toDate():new Date(val); return d.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",hour12:true}); }
// function endTime(exam) { const s=exam.scheduledStartTime?.toDate?.()??new Date(exam.scheduledStartTime); return new Date(s.getTime()+(exam.durationMinutes??60)*60*1000); }
// function practicePath(cat) { return `/practice/${(cat.name||cat.id).trim().toLowerCase().replace(/\s+/g,"-")}`; }

// function Counter({ target, duration=1200 }) {
//   const [val,setVal]=useState(0);
//   useEffect(()=>{
//     const num=typeof target==="string"?parseInt(target):(target||0);
//     let cur=0;const step=Math.max(1,Math.ceil(num/(duration/16)));
//     const t=setInterval(()=>{cur=Math.min(cur+step,num);setVal(cur);if(cur>=num)clearInterval(t);},16);
//     return()=>clearInterval(t);
//   },[target]);
//   return <span style={NUM_STYLE}>{typeof target==="string"?val+"%":val}</span>;
// }

// function ProgressBar({ value, color, trackColor="#f0f0f0" }) {
//   const [w,setW]=useState(0);
//   useEffect(()=>{const t=setTimeout(()=>setW(value||0),300);return()=>clearTimeout(t);},[value]);
//   return(
//     <div style={{background:trackColor,borderRadius:99,height:6,overflow:"hidden"}}>
//       <div style={{width:`${w}%`,height:"100%",background:color,borderRadius:99,transition:"width 1s cubic-bezier(0.4,0,0.2,1)"}}/>
//     </div>
//   );
// }

// function Spinner() {
//   return(
//     <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"60vh",gap:"1rem"}}>
//       <div style={{width:40,height:40,border:"3px solid #ffd5c2",borderTop:"3px solid #ff6b35",borderRadius:"50%",animation:"spin .8s linear infinite"}}/>
//       <span style={{fontSize:"0.88rem",color:"#9ca3af",fontWeight:500}}>Loading…</span>
//     </div>
//   );
// }

// function EnrolledCoursesView({ categories, questions, T }) {
//   const qByCategory = {};
//   questions.forEach(q => {
//     const key = q.category || q.categoryId || "General";
//     if (!qByCategory[key]) qByCategory[key] = [];
//     qByCategory[key].push(q);
//   });
//   if(!categories.length) return <div className="section-enter" style={{textAlign:"center",padding:"4rem",color:T.textFaint,fontSize:"0.95rem"}}>No enrolled courses found.</div>;
//   return(
//     <div className="section-enter">
//       <div style={{marginBottom:"1.75rem"}}>
//         <h2 style={{fontWeight:800,fontSize:"1.75rem",color:T.text}}>Enrolled Courses</h2>
//         <p style={{fontSize:"0.85rem",color:T.textFaint,marginTop:"0.35rem"}}>{categories.length} modules · Opens full-screen workspace</p>
//       </div>
//       <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))",gap:"1.25rem"}}>
//         {categories.map((cat,i)=>{
//           const color=MODULE_COLORS[i%MODULE_COLORS.length];
//           const byId   = questions.filter(q => cat.questionIds?.includes(q.id));
//           const byName = qByCategory[cat.name] || [];
//           const displayQ = byId.length ? byId : byName;
//           const totalQ = displayQ.length;
//           return(
//             <div key={cat.id} style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:"12px",padding:"1.5rem",position:"relative",overflow:"hidden",transition:"all .2s ease"}}
//               onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.borderColor=`${color}60`;e.currentTarget.style.boxShadow="0 6px 16px rgba(0,0,0,0.1)";}}
//               onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.borderColor=T.border;e.currentTarget.style.boxShadow="";}}>
//               <div style={{position:"absolute",right:-10,bottom:-10,fontSize:"5.5rem",opacity:0.05}}>📘</div>
//               <div style={{display:"flex",alignItems:"flex-start",gap:"1rem",marginBottom:"1.125rem"}}>
//                 <div style={{width:50,height:50,borderRadius:"12px",background:`${color}18`,border:`1px solid ${color}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.5rem",flexShrink:0}}>📚</div>
//                 <div style={{flex:1}}>
//                   <div style={{fontWeight:700,fontSize:"1rem",color:T.text,lineHeight:1.35}}>{cat.name}</div>
//                   <div style={{fontSize:"0.75rem",color:T.textFaint,marginTop:"0.25rem"}}>{cat.accessType==="global"?"🌐 Global":"🎓 Selective"}</div>
//                 </div>
//               </div>
//               <div style={{display:"flex",gap:"0.5rem",flexWrap:"wrap",marginBottom:"1rem"}}>
//                 {[cat.accessType?.toUpperCase(),`${totalQ} Questions`].map((tag,ti)=>(
//                   <span key={ti} style={{fontSize:"0.7rem",fontWeight:ti===0?700:600,padding:"0.25rem 0.65rem",borderRadius:"5px",background:ti===0?`${color}14`:T.bgHover,color:ti===0?color:T.textMuted,border:`1px solid ${ti===0?color+"30":T.border}`}}>{tag}</span>
//                 ))}
//               </div>
//               <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.5rem"}}>
//                 <span style={{...NUM_STYLE,fontSize:"0.75rem",color:T.textFaint}}>{totalQ} questions</span>
//                 <span style={{fontSize:"0.8rem",fontWeight:800,color}}>Active</span>
//               </div>
//               <ProgressBar value={Math.min(100,totalQ*5)} color={color} trackColor={T.bgHover}/>
//               <Link to={practicePath(cat)}
//                 style={{display:"block",marginTop:"1rem",width:"100%",background:`${color}12`,border:`1px solid ${color}40`,borderRadius:"8px",padding:"0.65rem",color,fontSize:"0.82rem",fontWeight:700,textAlign:"center",textDecoration:"none",transition:"all .15s",letterSpacing:"0.04em"}}
//                 onMouseEnter={e=>e.currentTarget.style.background=`${color}26`}
//                 onMouseLeave={e=>e.currentTarget.style.background=`${color}12`}>
//                 Practice
//               </Link>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// function GlobalModulesView({ categories, questions, T }) {
//   const history=useHistory();
//   const[open,setOpen]=useState(null);
//   const qByCategory={};
//   questions.forEach(q=>{const key=q.category||q.categoryId||"General";if(!qByCategory[key])qByCategory[key]=[];qByCategory[key].push(q);});
//   const DIFF_BADGE={Easy:{bg:"#f0fdf4",color:"#16a34a",border:"#bbf7d0"},Medium:{bg:"#fffbeb",color:"#d97706",border:"#fde68a"},Hard:{bg:"#fef2f2",color:"#dc2626",border:"#fecaca"}};
//   return(
//     <div className="section-enter">
//       <div style={{marginBottom:"1.75rem"}}>
//         <h2 style={{fontWeight:800,fontSize:"1.75rem",color:T.text}}>Global Modules</h2>
//         <p style={{fontSize:"0.85rem",color:T.textFaint,marginTop:"0.35rem"}}>Solve → opens <strong>full-screen workspace</strong> (no sidebar)</p>
//       </div>
//       <div style={{display:"flex",flexDirection:"column",gap:"0.875rem"}}>
//         {categories.map((cat,i)=>{
//           const color=MODULE_COLORS[i%MODULE_COLORS.length];
//           const isOpen=open===cat.id;
//           const byId=questions.filter(q=>cat.questionIds?.includes(q.id));
//           const byName=qByCategory[cat.name]||[];
//           const displayQ=byId.length?byId:byName;
//           const total=displayQ.length;
//           return(
//             <div key={cat.id} style={{background:T.bgCard,border:`1px solid ${isOpen?color+"60":T.border}`,borderRadius:"12px",overflow:"hidden",transition:"border-color .2s,box-shadow .2s",boxShadow:isOpen?`0 0 0 3px ${color}18`:"none"}}>
//               <button onClick={()=>setOpen(isOpen?null:cat.id)} style={{width:"100%",display:"flex",alignItems:"center",gap:"1.125rem",padding:"1.125rem 1.5rem",background:isOpen?`${color}08`:"transparent",border:"none",cursor:"pointer",textAlign:"left",transition:"background .15s"}}
//                 onMouseEnter={e=>{if(!isOpen)e.currentTarget.style.background=T.bgHover;}}
//                 onMouseLeave={e=>{if(!isOpen)e.currentTarget.style.background="transparent";}}>
//                 <div style={{width:46,height:46,borderRadius:"12px",flexShrink:0,background:`${color}15`,border:`1px solid ${color}35`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.4rem"}}>🧩</div>
//                 <div style={{flex:1,minWidth:0}}>
//                   <div style={{display:"flex",alignItems:"center",gap:"0.6rem",marginBottom:"0.3rem"}}>
//                     <span style={{fontWeight:700,fontSize:"1rem",color:T.text}}>{cat.name}</span>
//                     <span style={{fontSize:"0.65rem",fontWeight:700,padding:"0.15rem 0.5rem",borderRadius:"5px",background:`${color}15`,color,border:`1px solid ${color}30`,textTransform:"uppercase"}}>{cat.accessType||"global"}</span>
//                   </div>
//                   <div style={{display:"flex",alignItems:"center",gap:"0.875rem"}}>
//                     <span style={{...NUM_STYLE,fontSize:"0.75rem",color:T.textFaint}}>{total} question{total!==1?"s":""}</span>
//                     <span style={{fontSize:"0.72rem",fontWeight:600,color,padding:"0.1rem 0.5rem",borderRadius:"4px",background:`${color}10`,border:`1px solid ${color}25`}}>{total>0?"Available":"Coming Soon"}</span>
//                   </div>
//                 </div>
//                 <button onClick={e=>{e.stopPropagation();history.push(practicePath(cat));}}
//                   style={{background:`${color}18`,border:`1px solid ${color}40`,borderRadius:"7px",padding:"0.4rem 1rem",color,fontSize:"0.78rem",fontWeight:700,cursor:"pointer",flexShrink:0,transition:"all .15s"}}
//                   onMouseEnter={e=>e.currentTarget.style.background=`${color}30`}
//                   onMouseLeave={e=>e.currentTarget.style.background=`${color}18`}>
//                   Practice →
//                 </button>
//                 <div style={{width:26,height:26,borderRadius:"6px",flexShrink:0,background:isOpen?`${color}15`:T.bgHover,border:`1px solid ${isOpen?color+"40":T.border}`,display:"flex",alignItems:"center",justifyContent:"center",color:isOpen?color:T.textFaint,transform:isOpen?"rotate(180deg)":"none",transition:"all .2s",fontSize:"0.7rem"}}>▼</div>
//               </button>
//               {isOpen&&(
//                 <div style={{borderTop:`2px solid ${color}20`,background:T.bgSurface}}>
//                   {total===0?<p style={{padding:"1.75rem",textAlign:"center",fontSize:"0.875rem",color:T.textFaint,fontStyle:"italic"}}>No questions added yet.</p>:(
//                     <>
//                       <div style={{display:"grid",gridTemplateColumns:"44px 1fr 100px 110px",gap:"0.5rem",padding:"0.6rem 1.5rem",borderBottom:`1px solid ${T.border}`,background:T.bgHover}}>
//                         {["#","Title","Difficulty","Action"].map((h,hi)=><span key={hi} style={{fontSize:"0.65rem",fontWeight:700,color:T.textFaint,textTransform:"uppercase",letterSpacing:"0.08em",textAlign:hi>1?"center":"left"}}>{h}</span>)}
//                       </div>
//                       {displayQ.map((q,qi)=>{
//                         const diff=q.difficulty||"Medium";const badge=DIFF_BADGE[diff]||DIFF_BADGE.Medium;
//                         return(
//                           <div key={q.id} style={{display:"grid",gridTemplateColumns:"44px 1fr 100px 110px",gap:"0.5rem",alignItems:"center",padding:"0.875rem 1.5rem",borderBottom:qi<displayQ.length-1?`1px solid ${T.border}`:"none",background:T.bgCard,transition:"background .12s"}}
//                             onMouseEnter={e=>e.currentTarget.style.background=T.bgHover}
//                             onMouseLeave={e=>e.currentTarget.style.background=T.bgCard}>
//                             <span style={{...NUM_STYLE,fontSize:"0.85rem",color:"#9ca3af",fontWeight:600,textAlign:"center"}}>{qi+1}</span>
//                             <div>
//                               <div style={{fontSize:"0.9rem",fontWeight:600,color:T.text,lineHeight:1.35}}>{q.title||q.question||"Untitled"}</div>
//                               {q.type&&<span style={{fontSize:"0.62rem",fontWeight:700,padding:"0.1rem 0.4rem",borderRadius:"4px",background:(q.type==="MCQ"?"rgba(255,161,22,.15)":"rgba(88,166,255,.15)"),color:(q.type==="MCQ"?"#ffa116":"#58a6ff"),marginTop:"0.2rem",display:"inline-block"}}>{q.type}</span>}
//                             </div>
//                             <div style={{textAlign:"center"}}><span style={{fontSize:"0.72rem",fontWeight:700,padding:"0.25rem 0.7rem",borderRadius:"5px",background:badge.bg,color:badge.color,border:`1px solid ${badge.border}`}}>{diff}</span></div>
//                             <div style={{textAlign:"center"}}>
//                               <button onClick={()=>history.push(practicePath(cat))}
//                                 style={{background:color,color:"#fff",border:"none",borderRadius:"7px",padding:"0.375rem 0.9rem",fontSize:"0.78rem",fontWeight:700,cursor:"pointer",transition:"opacity .15s"}}
//                                 onMouseEnter={e=>e.currentTarget.style.opacity="0.82"}
//                                 onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
//                                 Solve →
//                               </button>
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </>
//                   )}
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// function LeaderboardView({ leaderboard, currentUser, T }) {
//   const top3=leaderboard.slice(0,3);
//   const podiumOrder=top3.length>=3?[top3[1],top3[0],top3[2]]:top3;
//   const heights=[120,155,100];const podColors=["#9ca3af","#f0a500","#ff6b35"];
//   return(
//     <div className="section-enter">
//       <div style={{marginBottom:"1.75rem"}}><h2 style={{fontWeight:800,fontSize:"1.75rem",color:T.text}}>🏆 Global Leaderboard</h2></div>
//       {podiumOrder.length>=3&&(
//         <div style={{display:"flex",justifyContent:"center",alignItems:"flex-end",gap:"1.25rem",marginBottom:"2.25rem",padding:"1.75rem",background:T.bgSurface,borderRadius:"14px",border:`1px solid ${T.border}`}}>
//           {podiumOrder.map((s,i)=>(
//             <div key={s.id} style={{textAlign:"center",flex:1,maxWidth:175}}>
//               <div style={{fontSize:"1.75rem",marginBottom:"0.6rem"}}>{i===1?"🥇":i===0?"🥈":"🥉"}</div>
//               <div style={{fontWeight:600,fontSize:"0.9rem",color:s.id===currentUser?.uid?"#ff6b35":T.text,marginBottom:"0.3rem"}}>{s.name||s.displayName||"Anonymous"}</div>
//               <div style={{...NUM_STYLE,fontWeight:700,fontSize:"0.9rem",color:podColors[i],marginBottom:"0.6rem"}}>{(s.totalScore||0).toLocaleString()} pts</div>
//               <div style={{height:heights[i],background:`${podColors[i]}18`,border:`1px solid ${podColors[i]}40`,borderRadius:"8px 8px 0 0",display:"flex",alignItems:"center",justifyContent:"center"}}>
//                 <span style={{...NUM_STYLE,fontSize:heights[i]>120?"1.9rem":"1.4rem",fontWeight:800,color:podColors[i]}}>#{i===1?1:i===0?2:3}</span>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//       <div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:"12px",overflow:"hidden"}}>
//         {leaderboard.length===0&&<div style={{padding:"2.25rem",textAlign:"center",color:T.textFaint,fontSize:"0.9rem"}}>No data yet.</div>}
//         {leaderboard.map((s,i)=>{
//           const isMe=s.id===currentUser?.uid;const rankLabel=i===0?"🥇":i===1?"🥈":i===2?"🥉":`${i+1}`;
//           return(
//             <div key={s.id} style={{padding:"0.875rem 1.5rem",borderBottom:i<leaderboard.length-1?`1px solid ${T.border}`:"none",display:"flex",alignItems:"center",gap:"1.125rem",background:isMe?T.accentLight:"transparent"}}>
//               <span style={{...NUM_STYLE,width:36,textAlign:"center",fontSize:i<3?"1.1rem":"0.85rem",color:i>=3?T.textFaint:undefined,fontWeight:600}}>{rankLabel}</span>
//               <div style={{flex:1}}>
//                 <span style={{fontSize:"0.9rem",fontWeight:isMe?700:500,color:isMe?"#ff6b35":T.text}}>
//                   {s.name||s.displayName||"Anonymous"}
//                   {isMe&&<span style={{marginLeft:"0.5rem",fontSize:"0.62rem",background:T.accentLight,color:"#ff6b35",padding:"0.1rem 0.45rem",borderRadius:"4px",fontWeight:700,border:`1px solid ${T.accentBorder}`}}>you</span>}
//                 </span>
//                 <div style={{fontSize:"0.68rem",color:T.textFaint,marginTop:"0.1rem"}}>{s.college||s.collegeId||"—"}</div>
//               </div>
//               <span style={{...NUM_STYLE,fontWeight:700,fontSize:"0.92rem",color:isMe?"#ff6b35":T.text}}>{(s.totalScore||0).toLocaleString()}<span style={{fontSize:"0.65rem",color:T.textFaint,fontWeight:400,marginLeft:"0.25rem"}}>pts</span></span>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// function ReportsView({ questions, exams, leaderboard, currentUser, dashboardSubmissions, T }) {
//   const totalQ        = questions.length;
//   const myRank        = leaderboard.findIndex(s => s.id === currentUser?.uid) + 1;
//   const allSubs       = Object.values(dashboardSubmissions);
//   const completedSubs = allSubs.filter(s => s.status === "completed");
//   const avgScore      = completedSubs.length
//     ? Math.round(completedSubs.reduce((a, s) => a + (s.score || 0), 0) / completedSubs.length)
//     : 0;

//   const dailySubs  = completedSubs.filter(s => (exams.find(e => e.id === s.examId)?.examType || "EXAM") === "DAILY");
//   const weeklySubs = completedSubs.filter(s => (exams.find(e => e.id === s.examId)?.examType || "EXAM") === "WEEKLY");
//   const avgOf      = arr => arr.length ? Math.round(arr.reduce((a, s) => a + (s.score || 0), 0) / arr.length) : 0;
//   const dailyAvg   = avgOf(dailySubs);
//   const weeklyAvg  = avgOf(weeklySubs);

//   const overallItems = [
//     { label: "Total Questions", val: totalQ,                            pct: Math.min(100, totalQ),                    color: "#ff6b35" },
//     { label: "Exams Completed", val: completedSubs.length,             pct: Math.min(100, completedSubs.length * 10), color: "#00b8a3" },
//     { label: "Avg Score",       val: `${avgScore}%`,                   pct: avgScore,                                 color: "#5a6cf5" },
//     { label: "Global Rank",     val: myRank > 0 ? `#${myRank}` : "—", pct: myRank > 0 ? Math.max(5, 100 - myRank * 10) : 0, color: "#e05c7a" },
//   ];

//   const periodCards = [
//     {
//       label: "📅 Daily Performance", color: "#10b981",
//       empty: dailySubs.length === 0,
//       stats: [
//         { label: "Completed", val: dailySubs.length,  pct: Math.min(100, dailySubs.length * 20),  color: "#10b981" },
//         { label: "Avg Score", val: `${dailyAvg}%`,    pct: dailyAvg,                               color: "#34d399" },
//       ],
//     },
//     {
//       label: "📊 Weekly Performance", color: "#3b82f6",
//       empty: weeklySubs.length === 0,
//       stats: [
//         { label: "Completed", val: weeklySubs.length, pct: Math.min(100, weeklySubs.length * 25), color: "#3b82f6" },
//         { label: "Avg Score", val: `${weeklyAvg}%`,   pct: weeklyAvg,                              color: "#60a5fa" },
//       ],
//     },
//   ];

//   return (
//     <div className="section-enter">
//       <div style={{ marginBottom: "1.75rem" }}>
//         <h2 style={{ fontWeight: 800, fontSize: "1.75rem", color: T.text }}>📊 Performance Reports</h2>
//         <p style={{ fontSize: "0.85rem", color: T.textFaint, marginTop: "0.35rem" }}>Your overall progress at a glance</p>
//       </div>

//       <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: "1.125rem", marginBottom: "2rem" }}>
//         {overallItems.map((item, i) => (
//           <div key={i} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: "12px", padding: "1.375rem 1.5rem" }}>
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.875rem" }}>
//               <span style={{ fontSize: "0.85rem", color: T.textMuted }}>{item.label}</span>
//               <span style={{ ...NUM_STYLE, fontWeight: 800, fontSize: "1.1rem", color: item.color }}>{item.val}</span>
//             </div>
//             <ProgressBar value={item.pct} color={item.color} trackColor={T.bgHover} />
//           </div>
//         ))}
//       </div>

//       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
//         {periodCards.map((sec, si) => (
//           <div key={si} style={{ background: T.bgCard, border: `1.5px solid ${sec.color}30`, borderRadius: "14px", overflow: "hidden" }}>
//             <div style={{ padding: "1rem 1.375rem", borderBottom: `1px solid ${T.border}`, background: `${sec.color}08`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//               <span style={{ fontWeight: 800, fontSize: "1rem", color: T.text }}>{sec.label}</span>
//               <span style={{ ...NUM_STYLE, fontSize: "0.72rem", fontWeight: 700, color: sec.color, background: `${sec.color}15`, border: `1px solid ${sec.color}30`, borderRadius: "20px", padding: "0.2rem 0.75rem" }}>
//                 {sec.stats[0].val} done
//               </span>
//             </div>
//             <div style={{ padding: "1.25rem 1.375rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
//               {sec.empty ? (
//                 <div style={{ textAlign: "center", color: T.textFaint, fontSize: "0.85rem", padding: "1rem 0", fontStyle: "italic" }}>
//                   No {sec.label.includes("Daily") ? "daily" : "weekly"} exams completed yet.
//                 </div>
//               ) : sec.stats.map((stat, i) => (
//                 <div key={i}>
//                   <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
//                     <span style={{ fontSize: "0.82rem", color: T.textMuted }}>{stat.label}</span>
//                     <span style={{ ...NUM_STYLE, fontWeight: 800, fontSize: "1rem", color: stat.color }}>{stat.val}</span>
//                   </div>
//                   <ProgressBar value={stat.pct} color={stat.color} trackColor={T.bgHover} />
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default function StudentDashboard() {
//   const { currentUser, appSignOut, collegeId } = useAuth();
//   const history = useHistory();
//   const [dark,setDark]=useState(()=>localStorage.getItem("as-theme")==="dark");
//   const toggleTheme=()=>setDark(d=>{const n=!d;localStorage.setItem("as-theme",n?"dark":"light");return n;});
//   const T={
//     bg:           dark?"#0d1117":"#ffffff",
//     bgSurface:    dark?"#161b22":"#f7f8fa",
//     bgCard:       dark?"#161b22":"#ffffff",
//     bgHover:      dark?"#1c2128":"#f3f4f6",
//     bgHeader:     dark?"rgba(13,17,23,0.95)":"rgba(255,255,255,0.97)",
//     border:       dark?"#21262d":"#e5e7eb",
//     text:         dark?"#e6edf3":"#1a1a1a",
//     textSub:      dark?"#c9d1d9":"#2d2d2d",
//     textMuted:    dark?"#6b7280":"#6b7280",
//     textFaint:    dark?"#484f58":"#9ca3af",
//     shadow:       dark?"0 1px 3px rgba(0,0,0,0.3)":"0 1px 3px rgba(0,0,0,0.06)",
//     sidebarBorder:dark?"#21262d":"#e5e7eb",
//     inputBg:      dark?"#161b22":"#f7f8fa",
//     accent:       "#ff6b35",
//     accentLight:  dark?"#2d1a0e":"#fff4f0",
//     accentBorder: dark?"#6b3020":"#ffd5c2",
//   };

//   const [activeNav,   setActiveNav]   = useState("dashboard");
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isLoading,   setIsLoading]   = useState(true);
//   const [exams,       setExams]       = useState([]);
//   const [categories,  setCategories]  = useState([]);
//   const [questions,   setQuestions]   = useState([]);
//   const [leaderboard, setLeaderboard] = useState([]);
//   const [userProfile, setUserProfile] = useState(null);
//   const [isStarting,           setIsStarting]           = useState(false);
//   const [collegeLogo,          setCollegeLogo]          = useState(null);
//   const [collegeName,          setCollegeName]          = useState(null);
//   const [dashboardSubmissions, setDashboardSubmissions] = useState({});
//   const [examDetailsModal,     setExamDetailsModal]     = useState(null);

//   const FULLSCREEN_NAVS = ["sandbox"];
//   const isFullscreen = FULLSCREEN_NAVS.includes(activeNav);

//   const SW=sidebarOpen?256:76;

//   const displayName = userProfile?.name || userProfile?.displayName || currentUser?.displayName || currentUser?.email?.split("@")[0] || "Student";
//   const firstName   = displayName.split(" ")[0];
//   const initials    = displayName.split(" ").map(n=>n[0]).slice(0,2).join("").toUpperCase();

//   useEffect(()=>{
//     if(!currentUser)return;
//     const fetchAll=async()=>{
//       setIsLoading(true);
//       try{
//         const userSnap=await getDoc(doc(db,"users",currentUser.uid));
//         const uData=userSnap.data();
//         if(userSnap.exists())setUserProfile(uData);
//         if(uData?.collegeId){
//           try{
//             const colSnap=await getDoc(doc(db,"colleges",uData.collegeId));
//             if(colSnap.exists()){
//               const d=colSnap.data();
//               if(d.logoUrl)setCollegeLogo(d.logoUrl);
//               if(d.name)  setCollegeName(d.name);
//             } else {
//               const q=query(collection(db,"colleges"),where("name","==",uData.collegeId));
//               const snap=await getDocs(q);
//               if(!snap.empty){const d=snap.docs[0].data();if(d.logoUrl)setCollegeLogo(d.logoUrl);if(d.name)setCollegeName(d.name);}
//             }
//           }catch(e){console.warn("College logo fetch:",e);}
//         }
//         const examsRef=collection(db,"exams");
//         let eligibleExams=[];
//         if(uData?.userType==="college"&&uData?.collegeId){
//           const q=query(examsRef,or(where("assignedColleges","array-contains",uData.collegeId),where("registeredStudents","array-contains",uData.regNo||"")));
//           const snap=await getDocs(q);eligibleExams=snap.docs.map(d=>({id:d.id,...d.data()}));
//         }else{
//           const q=query(examsRef,where("isPublic","==",true));
//           const snap=await getDocs(q);eligibleExams=snap.docs.map(d=>({id:d.id,...d.data()}));
//         }
//         setExams(eligibleExams);
//         try {
//           const subSnap = await getDocs(query(collection(db,"submissions"),where("studentId","==",currentUser.uid)));
//           const subMap  = {};
//           subSnap.docs.forEach(d => {
//             const data = d.data();
//             if (!data.examId) return;
//             const existing = subMap[data.examId];
//             if (!existing || data.status === "completed" || !existing.status) {
//               subMap[data.examId] = { id: d.id, ...data };
//             }
//           });
//           setDashboardSubmissions(subMap);
//         } catch(e) { console.warn("Dashboard submission fetch:", e); }
//         const catSnap=await getDocs(query(collection(db,"categories"),orderBy("name")));
//         setCategories(catSnap.docs.map(d=>({id:d.id,...d.data()})));
//         const qSnap=await getDocs(collection(db,"questions"));
//         setQuestions(qSnap.docs.map(d=>({id:d.id,...d.data()})));
//         const lbSnap=await getDocs(query(collection(db,"users"),where("role","==","student"),orderBy("totalScore","desc"),limit(10)));
//         setLeaderboard(lbSnap.docs.map(d=>({id:d.id,...d.data()})));
//       }catch(err){console.error(err);}
//       setIsLoading(false);
//     };
//     fetchAll();
//   },[currentUser,collegeId]);

//   const handleLogout=async()=>{try{await appSignOut();history.push("/login");}catch(e){console.error(e);}};

//   const handleStartExam = (examId, existingSubmissionId = null) => {
//     if (!currentUser || !examId) return;
//     if (existingSubmissionId) {
//       history.push(`/exam/${examId}/${existingSubmissionId}`);
//       return;
//     }
//     setExamDetailsModal({ examId });
//   };

//   const handleDetailsSubmit = async ({ name, branch, section }) => {
//     if (!examDetailsModal) return;
//     const { examId } = examDetailsModal;
//     setExamDetailsModal(null);
//     setIsStarting(true);
//     try {
//       const exam        = exams.find(e => e.id === examId);
//       const submissionId = await startSubmission({
//         examId,
//         examTitle:    exam?.title,
//         studentId:    currentUser.uid,
//         studentName:  name || displayName,
//         studentEmail: currentUser.email,
//         studentRegNo: userProfile?.regNo || '',
//         branch,
//         section,
//         department:   branch,
//       });
//       history.push(`/exam/${examId}/${submissionId}`);
//     } catch (err) {
//       console.error(err);
//       alert('Could not start exam. Please try again.');
//     }
//     setIsStarting(false);
//   };

//   const myRank = leaderboard.findIndex(s=>s.id===currentUser?.uid)+1;
//   const examSubmissions = Object.values(dashboardSubmissions);
//   const completedE = examSubmissions.filter(s => s.status === "completed").length;
//   const examXP = examSubmissions
//     .filter(s => s.status === "completed")
//     .reduce((acc, s) => {
//       const correct = s.correctCount ?? s.correctAnswers ?? 0;
//       const total   = s.totalQuestions ?? s.questionCount ?? exams.find(e => e.id === s.examId)?.questionIds?.length ?? 1;
//       const score   = s.totalScore ?? s.score ?? 0;
//       const xp = score > 0 ? score : Math.round((correct / total) * 100);
//       return acc + xp;
//     }, 0);

//   const practiceAttempts = userProfile?.practiceAttempts || userProfile?.totalAttempts || 0;
//   const practiceXP = practiceAttempts * 5;
//   const myScore    = examXP + practiceXP;
//   const accuracyVal= userProfile?.accuracy || 0;

//   const qByCategory = {};
//   questions.forEach(q => {
//     const key = q.category || q.categoryId || "General";
//     if (!qByCategory[key]) qByCategory[key] = [];
//     qByCategory[key].push(q);
//   });
//   const resolvedTotalQuestions = categories.reduce((acc, cat) => {
//     const byId   = questions.filter(q => cat.questionIds?.includes(q.id));
//     const byName = qByCategory[cat.name] || [];
//     return acc + (byId.length ? byId.length : byName.length);
//   }, 0);

//   const STATS=[
//     {label:"Enrolled Courses",value:categories.length,         icon:"📘",color:"#ff6b35",bg:dark?"rgba(255,107,53,0.12)":"#fff4f0",border:dark?"rgba(255,107,53,0.25)":"#ffd5c2"},
//     {label:"Total Questions", value:resolvedTotalQuestions,    icon:"📝",color:"#5a6cf5",bg:dark?"rgba(90,108,245,0.12)":"#f0f1ff",border:dark?"rgba(90,108,245,0.25)":"#d4d7fd"},
//     {label:"Exams Attended",  value:completedE,                icon:"✅",color:"#00b8a3",bg:dark?"rgba(0,184,163,0.12)":"#f0faf9",border:dark?"rgba(0,184,163,0.25)":"#b3e8e3"},
//     {label:"Global Rank",     value:myRank>0?`#${myRank}`:"—",icon:"🎯",color:"#f0a500",bg:dark?"rgba(240,165,0,0.12)":"#fffbf0",border:dark?"rgba(240,165,0,0.25)":"#fde8a0"},
//   ];
//   const ACCURACY_DATA=[{name:"Score",value:accuracyVal||Math.min(100,Math.round((myScore/5000)*100)),fill:"#ff6b35"},{name:"Rest",value:100-(accuracyVal||Math.min(100,Math.round((myScore/5000)*100))),fill:dark?"#21262d":"#f3f4f6"}];

//   const activeAndUpcomingExams = useMemo(() =>
//     exams.filter(exam => {
//       const ws = getWindowStatus(exam);
//       return ws === "live" || ws === "upcoming";
//     }),
//   [exams]);

//   const renderDashboard=()=>(
//     <div className="section-enter">
//       <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"1.125rem",marginBottom:"2rem"}}>
//         {STATS.map((s,i)=>(
//           <div key={i} style={{borderRadius:"12px",padding:"1.375rem 1.5rem",background:s.bg,border:`1px solid ${s.border}`,position:"relative",overflow:"hidden",cursor:["Enrolled Courses","Total Questions"].includes(s.label)?"pointer":"default",transition:"all .2s ease"}}
//             onClick={()=>{if(s.label==="Enrolled Courses")setActiveNav("courses");if(s.label==="Total Questions")setActiveNav("modules");}}
//             onMouseEnter={e=>{if(["Enrolled Courses","Total Questions"].includes(s.label))e.currentTarget.style.transform="translateY(-3px)";}}
//             onMouseLeave={e=>{e.currentTarget.style.transform="";}}>
//             <div style={{position:"absolute",top:-10,right:-10,fontSize:"2.75rem",opacity:0.08,transform:"rotate(15deg)"}}>{s.icon}</div>
//             <div style={{fontSize:"0.7rem",color:T.textFaint,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:"0.625rem"}}>{s.label}</div>
//             <div style={{...NUM_STYLE,fontSize:"2.25rem",fontWeight:800,color:s.color,lineHeight:1}}>{typeof s.value==="string"?s.value:<Counter target={s.value}/>}</div>
//             <div style={{marginTop:"0.875rem"}}><ProgressBar value={50} color={s.color} trackColor={T.bgHover}/></div>
//           </div>
//         ))}
//       </div>
//       <div style={{display:"grid",gridTemplateColumns:"1fr 360px",gap:"1.75rem"}}>
//         <div style={{display:"flex",flexDirection:"column",gap:"1.75rem"}}>
//           <div>
//             <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.125rem"}}>
//               <div style={{fontSize:"1.1rem",fontWeight:700,color:T.text}}>Learning Tracks</div>
//               <button onClick={()=>setActiveNav("courses")} style={{background:"transparent",border:"1px solid #e5e7eb",borderRadius:"8px",padding:"0.375rem 0.9rem",color:"#6b7280",fontSize:"0.78rem",cursor:"pointer",fontWeight:600,transition:"all .15s"}}
//                 onMouseEnter={e=>{e.currentTarget.style.borderColor="#ffd5c2";e.currentTarget.style.color="#ff6b35";}}
//                 onMouseLeave={e=>{e.currentTarget.style.borderColor="#e5e7eb";e.currentTarget.style.color="#6b7280";}}>View all →</button>
//             </div>
//             {categories.length===0?<div style={{color:T.textFaint,fontSize:"0.9rem",padding:"1.25rem",textAlign:"center"}}>No modules found.</div>:(
//               <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.875rem"}}>
//                 {categories.slice(0,4).map((cat,i)=>{
//                   const color=MODULE_COLORS[i%MODULE_COLORS.length];
//                   const byId   = questions.filter(q => cat.questionIds?.includes(q.id));
//                   const byName = qByCategory[cat.name] || [];
//                   const resolvedQ = byId.length ? byId : byName;
//                   const qCount    = resolvedQ.length;
//                   return(
//                     <Link key={cat.id} to={practicePath(cat)} style={{textDecoration:"none",display:"block",borderRadius:"10px",padding:"1rem 1.125rem",background:T.bgCard,border:`1px solid ${T.border}`,cursor:"pointer",transition:"all .15s"}}
//                       onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.borderColor=`${color}60`;e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,0.08)";}}
//                       onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.borderColor=T.border;e.currentTarget.style.boxShadow="";}}>
//                       <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"0.75rem"}}>
//                         <div>
//                           <div style={{fontSize:"0.88rem",fontWeight:600,color:T.textSub}}>{cat.name}</div>
//                           <div style={{...NUM_STYLE,fontSize:"0.72rem",color:T.textFaint,marginTop:"0.15rem"}}>{qCount} questions</div>
//                         </div>
//                         <span style={{background:`${color}20`,border:`1px solid ${color}40`,borderRadius:"8px",padding:"0.25rem 0.55rem",fontSize:"0.7rem",fontWeight:700,color}}>{cat.accessType||"global"}</span>
//                       </div>
//                       <ProgressBar value={Math.min(100,qCount*5)} color={color} trackColor={T.bgHover}/>
//                     </Link>
//                   );
//                 })}
//               </div>
//             )}
//           </div>

//           <div>
//             <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.125rem"}}>
//               <div style={{fontSize:"1.1rem",fontWeight:700,color:T.text}}>
//                 Upcoming Exams
//                 {activeAndUpcomingExams.length > 0 && (
//                   <span style={{
//                     marginLeft:8, fontSize:"0.65rem", fontWeight:800,
//                     background:"rgba(16,185,129,0.12)", color:"#10b981",
//                     border:"1px solid rgba(16,185,129,0.3)",
//                     borderRadius:20, padding:"2px 8px",
//                     verticalAlign:"middle",
//                   }}>
//                     {activeAndUpcomingExams.length} active
//                   </span>
//                 )}
//               </div>
//               <button onClick={()=>setActiveNav("exams")} style={{background:"transparent",border:"1px solid #e5e7eb",borderRadius:"8px",padding:"0.375rem 0.9rem",color:"#6b7280",fontSize:"0.78rem",cursor:"pointer",fontWeight:600,transition:"all .15s"}}
//                 onMouseEnter={e=>{e.currentTarget.style.borderColor="#ffd5c2";e.currentTarget.style.color="#ff6b35";}}
//                 onMouseLeave={e=>{e.currentTarget.style.borderColor="#e5e7eb";e.currentTarget.style.color="#6b7280";}}>View all →</button>
//             </div>

//             {activeAndUpcomingExams.length === 0 ? (
//               <div style={{
//                 color: T.textFaint, fontSize: "0.9rem",
//                 padding: "1.75rem", textAlign: "center",
//                 border: `1px dashed ${T.border}`, borderRadius: "10px",
//               }}>
//                 No live or upcoming exams right now.
//               </div>
//             ) : (
//               <div style={{display:"flex",flexDirection:"column",gap:"0.625rem"}}>
//                 {activeAndUpcomingExams.slice(0, 3).map(exam => {
//                   const ws     = getWindowStatus(exam);
//                   const isLive = ws === "live";
//                   const sub    = dashboardSubmissions[exam.id];
//                   return (
//                     <div key={exam.id} style={{
//                       display:"flex", alignItems:"center", justifyContent:"space-between",
//                       padding:"0.9rem 1.125rem",
//                       background: isLive ? "rgba(16,185,129,0.06)" : T.bgCard,
//                       border: `1px solid ${isLive ? "rgba(16,185,129,0.3)" : T.border}`,
//                       borderRadius:"10px", gap:"1.125rem",
//                       boxShadow: isLive ? "0 0 0 2px rgba(16,185,129,0.08)" : "none",
//                     }}>
//                       {isLive && (
//                         <span style={{
//                           width:8, height:8, borderRadius:"50%",
//                           background:"#10b981", flexShrink:0,
//                           animation:"liveDot 1.5s infinite",
//                           boxShadow:"0 0 0 0 rgba(16,185,129,0.4)",
//                         }}/>
//                       )}
//                       <div style={{flex:1,minWidth:0}}>
//                         <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:"0.15rem",flexWrap:"wrap"}}>
//                           <span style={{fontSize:"0.9rem",fontWeight:600,color:T.text}}>{exam.title}</span>
//                           <ExamTypeBadge examType={exam.examType || "EXAM"} />
//                           {isLive && (
//                             <span style={{
//                               fontSize:"0.6rem", fontWeight:800,
//                               background:"rgba(16,185,129,0.12)", color:"#10b981",
//                               border:"1px solid rgba(16,185,129,0.3)",
//                               borderRadius:20, padding:"1px 7px",
//                               textTransform:"uppercase", letterSpacing:"0.07em",
//                             }}>
//                               LIVE
//                             </span>
//                           )}
//                         </div>
//                         <div style={{...NUM_STYLE,fontSize:"0.75rem",color:T.textFaint}}>
//                           {exam.scheduledStartTime ? fmtDate(exam.scheduledStartTime) : "Date TBD"}
//                           {" · "}{exam.durationMinutes ?? 60} min
//                         </div>
//                       </div>
//                       {isLive ? (
//                         sub?.status === "completed"
//                           ? <span style={{fontSize:"0.72rem",fontWeight:700,padding:"0.25rem 0.7rem",borderRadius:"5px",background:"rgba(90,108,245,0.1)",color:"#5a6cf5",border:"1px solid rgba(90,108,245,0.3)",flexShrink:0}}>✓ Submitted</span>
//                           : <button onClick={() => handleStartExam(exam.id, sub?.id || null)}
//                               style={{background:"linear-gradient(135deg,#10b981,#059669)",border:"none",borderRadius:"8px",padding:"0.5rem 1.125rem",color:"#fff",fontSize:"0.78rem",fontWeight:700,cursor:"pointer",flexShrink:0,boxShadow:"0 3px 10px rgba(16,185,129,0.35)"}}>
//                               {sub ? "Resume →" : "Start →"}
//                             </button>
//                       ) : (
//                         <span style={{...NUM_STYLE,fontSize:"0.72rem",fontWeight:600,padding:"0.25rem 0.7rem",borderRadius:"5px",background:"rgba(249,115,22,0.08)",color:"#f97316",border:"1px solid rgba(249,115,22,0.25)",flexShrink:0}}>
//                           🔒 Upcoming
//                         </span>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         </div>

//         <div style={{display:"flex",flexDirection:"column",gap:"1.125rem"}}>
//           <div style={{borderRadius:"14px",padding:"1.5rem",background:T.bgCard,border:`1px solid ${T.border}`,textAlign:"center"}}>
//             {collegeLogo&&(
//               <div style={{marginBottom:"0.875rem",display:"flex",flexDirection:"column",alignItems:"center",gap:"0.4rem"}}>
//                 <img src={collegeLogo} alt={collegeName||"College"} style={{width:64,height:64,objectFit:"contain",borderRadius:"10px",border:`1px solid ${T.border}`,background:"#fff",padding:"4px"}}/>
//                 {collegeName&&<span style={{fontSize:"0.72rem",fontWeight:700,color:T.textMuted,letterSpacing:"0.04em"}}>{collegeName}</span>}
//               </div>
//             )}
//             <div style={{width:62,height:62,borderRadius:"50%",background:"#ff6b35",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:"1.25rem",color:"#fff",margin:"0 auto 0.875rem",overflow:"hidden"}}>
//               {currentUser?.photoURL?<img src={currentUser.photoURL} alt="av" style={{width:"100%",height:"100%",borderRadius:"50%",objectFit:"cover"}}/>:initials}
//             </div>
//             <div style={{fontWeight:700,fontSize:"1rem",color:T.text}}>{displayName}</div>
//             <div style={{fontSize:"0.75rem",color:T.textFaint,marginTop:"0.2rem"}}>{currentUser?.email}</div>
//             <div style={{display:"inline-flex",alignItems:"center",background:"#fff4f0",border:"1px solid #ffd5c2",borderRadius:"20px",padding:"0.3rem 1rem",marginTop:"0.75rem",fontSize:"0.75rem",fontWeight:700,color:"#ff6b35"}}>{userProfile?.level||"Student"}</div>
//             <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"0.625rem",marginTop:"1rem"}}>
//               {[
//                 {label:"Rank",  val:myRank>0?`#${myRank}`:"—",  color:"#ff6b35"},
//                 {label:"Score", val:myScore.toLocaleString(),    color:"#5a6cf5"},
//                 {label:"Exams", val:completedE,                  color:"#00b8a3"},
//               ].map((s,i)=>(
//                 <div key={i} style={{background:T.bgHover,borderRadius:"9px",padding:"0.6rem 0.3rem",border:`1px solid ${T.border}`}}>
//                   <div style={{...NUM_STYLE,fontWeight:700,fontSize:"1rem",color:s.color}}>{s.val}</div>
//                   <div style={{fontSize:"0.65rem",color:T.textFaint,marginTop:"0.15rem",textTransform:"uppercase",letterSpacing:"0.06em"}}>{s.label}</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//           <div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:"14px",padding:"1.375rem"}}>
//             <div style={{fontSize:"0.9rem",fontWeight:700,color:T.text,marginBottom:"0.3rem"}}>Score Progress</div>
//             <div style={{display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
//               <ResponsiveContainer width={155} height={155}>
//                 <RadialBarChart cx="50%" cy="50%" innerRadius="55%" outerRadius="85%" data={ACCURACY_DATA} startAngle={90} endAngle={-270}>
//                   <RadialBar dataKey="value" cornerRadius={4} background={false}/>
//                 </RadialBarChart>
//               </ResponsiveContainer>
//               <div style={{position:"absolute",textAlign:"center"}}>
//                 <div style={{...NUM_STYLE,fontWeight:800,fontSize:"1.35rem",color:"#ff6b35"}}>{myScore.toLocaleString()}</div>
//                 <div style={{fontSize:"0.65rem",color:T.textFaint,letterSpacing:"0.06em"}}>XP</div>
//               </div>
//             </div>
//           </div>
//           <div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:"14px",overflow:"hidden"}}>
//             <div style={{borderBottom:`1px solid ${T.border}`,padding:"0.875rem 1.125rem",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
//               <span style={{fontWeight:700,fontSize:"0.9rem",color:T.text}}>🏆 Top Coders</span>
//               <button onClick={()=>setActiveNav("leaderboard")} style={{background:"transparent",border:"none",cursor:"pointer",fontSize:"0.72rem",color:"#ff6b35",fontWeight:700}}>See all →</button>
//             </div>
//             {leaderboard.length===0&&<div style={{padding:"1.75rem",textAlign:"center",color:T.textFaint,fontSize:"0.88rem"}}>No data yet.</div>}
//             {leaderboard.slice(0,5).map((s,i)=>{
//               const isMe=s.id===currentUser?.uid;const badge=i===0?"🥇":i===1?"🥈":i===2?"🥉":"·";
//               return(
//                 <div key={s.id} style={{padding:"0.65rem 1.125rem",borderBottom:i<4?`1px solid ${T.border}`:"none",display:"flex",alignItems:"center",gap:"0.875rem",background:isMe?T.accentLight:"transparent"}}>
//                   <span style={{fontSize:i<3?"1rem":"0.85rem",width:24,textAlign:"center",color:i>=3?"#9ca3af":undefined,fontWeight:600}}>{badge}</span>
//                   <div style={{flex:1}}>
//                     <div style={{fontSize:"0.85rem",fontWeight:isMe?700:500,color:isMe?"#ff6b35":T.text}}>
//                       {s.name||s.displayName||"Anonymous"}
//                       {isMe&&<span style={{marginLeft:"0.4rem",fontSize:"0.62rem",background:"#fff4f0",color:"#ff6b35",padding:"0.1rem 0.4rem",borderRadius:"4px",fontWeight:700,border:"1px solid #ffd5c2"}}>you</span>}
//                     </div>
//                   </div>
//                   <span style={{...NUM_STYLE,fontSize:"0.82rem",fontWeight:700,color:isMe?"#ff6b35":T.textMuted}}>{(s.totalScore||0).toLocaleString()}</span>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   return(
//     <div style={{fontFamily:"'Segoe UI',system-ui,-apple-system,sans-serif",background:T.bg,color:T.text,minHeight:"100vh",display:"flex",overflow:"hidden",transition:"background .3s ease,color .3s ease"}}>
//       <style>{`
//         *{box-sizing:border-box;margin:0;padding:0;}
//         ::-webkit-scrollbar{width:5px;}
//         ::-webkit-scrollbar-track{background:${dark?"#0d1117":"#f7f8fa"};}
//         ::-webkit-scrollbar-thumb{background:${dark?"#30363d":"#e5e7eb"};border-radius:3px;}
//         @keyframes fadeUp{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}
//         @keyframes blink{0%,100%{opacity:1;}50%{opacity:0.4;}}
//         @keyframes spin{to{transform:rotate(360deg);}}
//         @keyframes liveDot{0%{box-shadow:0 0 0 0 rgba(16,185,129,0.6);}70%{box-shadow:0 0 0 7px rgba(16,185,129,0);}100%{box-shadow:0 0 0 0 rgba(16,185,129,0);}}
//         .section-enter{animation:fadeUp .3s ease both;}
//         h1,h2,h3{font-family:'Segoe UI',system-ui,sans-serif;}
//         button,input,a{font-family:'Segoe UI',system-ui,-apple-system,sans-serif;}
//       `}</style>

//       <aside style={{width:SW,minHeight:"100vh",background:dark?"#0d1117":"#ffffff",borderRight:`1px solid ${T.sidebarBorder}`,display:"flex",flexDirection:"column",position:"fixed",top:0,left:0,bottom:0,zIndex:100,transition:"width .3s cubic-bezier(0.4,0,0.2,1)",overflow:"hidden"}}>
//         <div style={{padding:sidebarOpen?"1.375rem 1.125rem 1.125rem":"1.375rem 0 1.125rem",borderBottom:`1px solid ${T.sidebarBorder}`,flexShrink:0,position:"relative",display:"flex",alignItems:"center",justifyContent:sidebarOpen?"flex-start":"center",minHeight:70}}>
//           <div style={{display:"flex",alignItems:"center",gap:sidebarOpen?"0.875rem":0,width:"100%",justifyContent:sidebarOpen?"flex-start":"center"}}>
//             {collegeLogo?(
//               <img src={collegeLogo} alt="logo" style={{width:36,height:36,borderRadius:"8px",objectFit:"contain",background:"#fff",padding:"2px",border:`1px solid ${T.border}`,flexShrink:0,display:"block"}}/>
//             ):(
//               <div style={{width:36,height:36,borderRadius:"8px",background:"#ff6b35",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.05rem",fontWeight:900,color:"#fff",flexShrink:0}}>A</div>
//             )}
//             {sidebarOpen&&(
//               <div style={{overflow:"hidden"}}>
//                 <div style={{fontWeight:800,fontSize:"1.02rem",color:T.text,whiteSpace:"nowrap"}}>{collegeName||"Algo Spark"}</div>
//                 <div style={{fontSize:"0.6rem",color:"#ff6b35",letterSpacing:"0.12em",textTransform:"uppercase",fontWeight:600}}>Student Portal</div>
//               </div>
//             )}
//           </div>
//           <button onClick={()=>setSidebarOpen(p=>!p)} style={{position:"absolute",top:"50%",right:"-13px",transform:"translateY(-50%)",width:26,height:26,borderRadius:"50%",background:T.bgCard,border:`1px solid ${T.border}`,cursor:"pointer",color:T.textMuted,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:T.shadow,transition:"all .15s",zIndex:10}}
//             onMouseEnter={e=>{e.currentTarget.style.background=T.accentLight;e.currentTarget.style.borderColor=T.accentBorder;e.currentTarget.style.color="#ff6b35";}}
//             onMouseLeave={e=>{e.currentTarget.style.background=T.bgCard;e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.textMuted;}}>
//             {sidebarOpen?ICONS.chevL:ICONS.chevR}
//           </button>
//         </div>

//         <nav style={{flex:1,padding:"0.875rem 0.625rem",overflowY:"auto"}}>
//           {NAV_ITEMS.map(item=>(
//             <button key={item.id} onClick={()=>setActiveNav(item.id)} title={!sidebarOpen?item.label:undefined}
//               style={{width:"100%",display:"flex",alignItems:"center",justifyContent:sidebarOpen?"flex-start":"center",gap:sidebarOpen?"0.875rem":0,padding:sidebarOpen?"0.65rem 0.875rem":"0.65rem 0",borderRadius:"9px",border:"none",borderLeft:activeNav===item.id?"3px solid #ff6b35":"3px solid transparent",background:activeNav===item.id?"#fff4f0":"transparent",cursor:"pointer",color:activeNav===item.id?"#ff6b35":T.textMuted,fontSize:"0.9rem",fontWeight:activeNav===item.id?600:400,marginBottom:"0.15rem",textAlign:"left",transition:"all .15s"}}
//               onMouseEnter={e=>{if(activeNav!==item.id){e.currentTarget.style.background=dark?"#1c2128":"#f7f8fa";e.currentTarget.style.color=dark?"#e6edf3":"#1a1a1a";}}}
//               onMouseLeave={e=>{if(activeNav!==item.id){e.currentTarget.style.background="transparent";e.currentTarget.style.color=T.textMuted;}}}>
//               <span style={{display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{item.icon}</span>
//               {sidebarOpen&&<span style={{whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{item.label}</span>}
//             </button>
//           ))}
//         </nav>

//         <div style={{padding:"0.875rem",borderTop:`1px solid ${T.sidebarBorder}`,flexShrink:0}}>
//           <div style={{display:"flex",alignItems:"center",gap:sidebarOpen?"0.75rem":0,justifyContent:sidebarOpen?"flex-start":"center",padding:"0.75rem",borderRadius:"10px",background:T.bgHover,border:`1px solid ${T.border}`}}>
//             <div style={{width:36,height:36,borderRadius:"50%",background:"#ff6b35",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.9rem",fontWeight:800,color:"#fff",flexShrink:0,overflow:"hidden"}}>
//               {currentUser?.photoURL?<img src={currentUser.photoURL} alt="av" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:initials}
//             </div>
//             {sidebarOpen&&(
//               <>
//                 <div style={{overflow:"hidden",flex:1}}>
//                   <div style={{fontSize:"0.82rem",fontWeight:600,color:T.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{firstName}.</div>
//                   <div style={{...NUM_STYLE,fontSize:"0.65rem",color:T.textFaint}}>{userProfile?.level||"Student"} · {myRank>0?`Rank #${myRank}`:"Unranked"}</div>
//                 </div>
//                 <button onClick={handleLogout} style={{display:"flex",alignItems:"center",gap:"0.3rem",background:"transparent",border:`1px solid ${T.border}`,borderRadius:"7px",padding:"0.35rem 0.65rem",cursor:"pointer",fontSize:"0.65rem",color:"#6b7280",fontWeight:600,flexShrink:0,transition:"all .15s"}}
//                   onMouseEnter={e=>{e.currentTarget.style.background="#fef2f2";e.currentTarget.style.borderColor="#fca5a5";e.currentTarget.style.color="#ef4444";}}
//                   onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color="#6b7280";}}>
//                   {ICONS.logout}<span>Out</span>
//                 </button>
//               </>
//             )}
//             {!sidebarOpen&&(
//               <button onClick={handleLogout} style={{display:"flex",alignItems:"center",justifyContent:"center",background:"transparent",border:"none",cursor:"pointer",color:T.textMuted,padding:"0.3rem",borderRadius:"5px",transition:"color .15s",marginLeft:"0.25rem"}}
//                 onMouseEnter={e=>e.currentTarget.style.color="#ef4444"}
//                 onMouseLeave={e=>e.currentTarget.style.color=T.textMuted}>{ICONS.logout}</button>
//             )}
//           </div>
//         </div>
//       </aside>

//       <main style={{marginLeft:SW,flex:1,minHeight:"100vh",transition:"margin-left .3s cubic-bezier(0.4,0,0.2,1)",position:"relative",zIndex:1,overflowY:"auto",display:"flex",flexDirection:"column"}}>
//         <header style={{position:"sticky",top:0,zIndex:50,background:T.bgHeader,backdropFilter:"blur(8px)",borderBottom:`1px solid ${T.sidebarBorder}`,padding:"0.875rem 2.25rem",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"1.125rem",flexShrink:0}}>
//           <div style={{display:"flex",alignItems:"center",gap:"0.875rem"}}>
//             {collegeLogo&&<img src={collegeLogo} alt={collegeName||"College"} style={{width:36,height:36,objectFit:"contain",borderRadius:"8px",border:`1px solid ${T.border}`,background:"#fff",padding:"3px"}}/>}
//             <div>
//               <div style={{fontWeight:700,fontSize:"1.2rem",color:T.text}}>Hi, {firstName} 👋</div>
//               <div style={{fontSize:"0.75rem",color:T.textFaint,marginTop:"0.1rem"}}>
//                 {new Date().toLocaleDateString("en-IN",{weekday:"long",month:"long",day:"numeric"})}
//                 {userProfile?.streak>0&&<span style={{...NUM_STYLE,color:"#ff6b35",marginLeft:"0.6rem",fontWeight:600}}>🔥 {userProfile.streak}d</span>}
//               </div>
//             </div>
//           </div>
//           <div style={{display:"flex",alignItems:"center",gap:"0.6rem",flex:1,maxWidth:400,background:T.inputBg,border:`1px solid ${T.border}`,borderRadius:"9px",padding:"0.525rem 1rem"}}>
//             <span style={{color:T.textFaint,display:"flex"}}>{ICONS.search}</span>
//             <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Search modules, exams…" style={{background:"transparent",border:"none",outline:"none",color:T.text,fontSize:"0.85rem",width:"100%"}}/>
//           </div>
//           <div style={{display:"flex",alignItems:"center",gap:"0.875rem"}}>
//             <button onClick={toggleTheme} style={{width:42,height:42,borderRadius:"11px",border:`1.5px solid ${dark?"#30363d":"#e5e7eb"}`,background:dark?"#161b22":"#f7f8fa",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s ease",flexShrink:0,position:"relative",overflow:"hidden"}}
//               onMouseEnter={e=>{e.currentTarget.style.borderColor="#ff6b35";e.currentTarget.style.background=dark?"#1e2a38":"#fff4f0";}}
//               onMouseLeave={e=>{e.currentTarget.style.borderColor=dark?"#30363d":"#e5e7eb";e.currentTarget.style.background=dark?"#161b22":"#f7f8fa";}}>
//               <span style={{position:"absolute",opacity:dark?1:0,transform:dark?"scale(1)":"scale(0.5)",transition:"all .3s ease",color:"#f59e0b"}}>{ICONS.sun}</span>
//               <span style={{position:"absolute",opacity:dark?0:1,transform:dark?"scale(0.5)":"scale(1)",transition:"all .3s ease",color:"#6366f1"}}>{ICONS.moon}</span>
//             </button>
//             {userProfile?.streak>0&&<div style={{display:"flex",alignItems:"center",gap:"0.4rem",background:T.accentLight,border:`1px solid ${T.accentBorder}`,borderRadius:"9px",padding:"0.4rem 0.875rem"}}><span style={{color:"#ff6b35",display:"flex"}}>{ICONS.fire}</span><span style={{...NUM_STYLE,fontSize:"0.82rem",fontWeight:700,color:"#ff6b35"}}>{userProfile.streak}d</span></div>}
//             <div style={{background:T.accentLight,border:`1px solid ${T.accentBorder}`,borderRadius:"9px",padding:"0.4rem 1rem",fontSize:"0.82rem",fontWeight:700,color:"#ff6b35",...NUM_STYLE}}>{myScore.toLocaleString()} XP</div>
//           </div>
//         </header>

//         <div style={{padding:isFullscreen?"0":"2rem 2.25rem",maxWidth:isFullscreen?"none":1320,margin:isFullscreen?"0":"0 auto",flex:isFullscreen?1:"unset",display:isFullscreen?"flex":"block",flexDirection:isFullscreen?"column":"unset",overflow:isFullscreen?"hidden":"unset",width:"100%"}}>
//           {isLoading?<Spinner/>:(
//             <>
//               {activeNav==="dashboard"   && renderDashboard()}
//               {activeNav==="courses"     && <EnrolledCoursesView categories={categories} questions={questions} T={T}/>}
//               {activeNav==="modules"     && <GlobalModulesView categories={categories} questions={questions} T={T}/>}
//               {activeNav==="learning"    && <LearningModulesView categories={categories} collegeId={collegeId} T={T}/>}
//               {activeNav==="exams"       && <ExamsView exams={exams} currentUser={currentUser} onStartExam={handleStartExam} T={T}/>}
//               {activeNav==="sandbox"&&(
//                 <div style={{flex:1,overflow:"hidden"}}>
//                   <FreeSandboxTerminal dark={dark} onBack={()=>setActiveNav("dashboard")}/>
//                 </div>
//               )}
//               {activeNav==="leaderboard" && <LeaderboardView leaderboard={leaderboard} currentUser={currentUser} T={T}/>}
//               {activeNav==="reports"     && <ReportsView questions={questions} exams={exams} leaderboard={leaderboard} currentUser={currentUser} dashboardSubmissions={dashboardSubmissions} T={T}/>}
//             </>
//           )}
//         </div>
//       </main>

//       {examDetailsModal&&(
//         <ExamDetailsForm
//           prefillRegNo={userProfile?.regNo||''}
//           prefillName={displayName}
//           examTitle={exams.find(e=>e.id===examDetailsModal.examId)?.title||''}
//           dark={dark}
//           onSubmit={handleDetailsSubmit}
//           onCancel={()=>setExamDetailsModal(null)}
//         />
//       )}

//       {isStarting&&(
//         <div style={{position:"fixed",inset:0,background:dark?"rgba(13,17,23,0.95)":"rgba(255,255,255,0.95)",zIndex:999,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"1.25rem"}}>
//           <div style={{width:48,height:48,border:"3px solid #ffd5c2",borderTop:"3px solid #ff6b35",borderRadius:"50%",animation:"spin .8s linear infinite"}}/>
//           <div style={{fontSize:"0.95rem",color:"#ff6b35",fontWeight:700,letterSpacing:"0.08em"}}>Starting Exam…</div>
//           <div style={{fontSize:"0.78rem",color:"#9ca3af"}}>Entering full-screen proctored mode</div>
//         </div>
//       )}
//     </div>
//   );
// }
