'use strict';
'use strict';
/* Kelly's Giraffe Adventure Vol. 2 - original synthesized savanna score + SFX (WebAudio, no samples) */
const AU=(function(){
const A={ctx:null,muted:false,cur:null,next:0,step:0,timer:null,song:null};
const mf=m=>440*Math.pow(2,(m-69)/12);
function imp(c,sec,dec){const r=c.sampleRate,n=r*sec|0,b=c.createBuffer(2,n,r);for(let ch=0;ch<2;ch++){const d=b.getChannelData(ch);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/n,dec)}return b}
A.init=function(){if(this.ctx)return;try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;const c=this.ctx=new C();
 this.master=c.createGain();this.master.gain.value=this.muted?0:0.8;const comp=c.createDynamicsCompressor();comp.threshold.value=-12;comp.ratio.value=3.5;
 this.master.connect(comp);comp.connect(c.destination);
 this.rev=c.createConvolver();this.rev.buffer=imp(c,1.8,2.6);const rg=c.createGain();rg.gain.value=0.22;this.rev.connect(rg);rg.connect(this.master);
 this.mus=c.createGain();this.mus.gain.value=0.42;this.mus.connect(this.master);const mr=c.createGain();mr.gain.value=0.5;this.mus.connect(mr);mr.connect(this.rev);
 this.sfx=c.createGain();this.sfx.gain.value=0.8;this.sfx.connect(this.master);
 const n=c.sampleRate;this.noise=c.createBuffer(1,n,n);const d=this.noise.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1}catch(e){this.ctx=null}};
A.unlock=function(){this.init();if(this.ctx&&this.ctx.state==='suspended')this.ctx.resume().catch(()=>{})};
A.setMuted=function(m){this.muted=m;if(this.master)this.master.gain.setTargetAtTime(m?0:0.8,this.ctx.currentTime,0.05)};
/* --- voices --- */
function env(g,t,a,peak,d){g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(peak,t+a);g.gain.exponentialRampToValueAtTime(0.0001,t+a+d)}
function osc(type,f,t,dur,peak,out,a=0.004){const c=A.ctx,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(f,t);env(g,t,a,peak,dur);o.connect(g);g.connect(out);o.start(t);o.stop(t+a+dur+0.05);return o}
function marimba(m,t,v,out){const f=mf(m);osc('sine',f,t,0.45,0.32*v,out);osc('sine',f*4,t,0.08,0.09*v,out);osc('triangle',f*2,t,0.16,0.06*v,out)}
function kalimba(m,t,v,out){const f=mf(m);osc('sine',f,t,0.9,0.22*v,out,0.002);osc('sine',f*5.4,t,0.05,0.05*v,out)}
function bass(m,t,d,v,out){const c=A.ctx,o=c.createOscillator(),g=c.createGain(),fl=c.createBiquadFilter();o.type='sawtooth';o.frequency.value=mf(m);fl.type='lowpass';fl.frequency.setValueAtTime(900,t);fl.frequency.exponentialRampToValueAtTime(180,t+d);env(g,t,0.01,0.28*v,d);o.connect(fl);fl.connect(g);g.connect(out);o.start(t);o.stop(t+d+0.1)}
function pad(m,t,d,v,out){const c=A.ctx;for(const det of[-7,7]){const o=c.createOscillator(),g=c.createGain(),fl=c.createBiquadFilter();o.type='sawtooth';o.frequency.value=mf(m);o.detune.value=det;fl.type='lowpass';fl.frequency.value=1100;g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(0.035*v,t+d*0.3);g.gain.linearRampToValueAtTime(0.0001,t+d);o.connect(fl);fl.connect(g);g.connect(out);o.start(t);o.stop(t+d+0.05)}}
function drum(t,f0,f1,d,v,out){const c=A.ctx,o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(f1,t+d);env(g,t,0.002,0.7*v,d);o.connect(g);g.connect(out);o.start(t);o.stop(t+d+0.05)}
function nz(t,d,v,fq,type,out,q=1){const c=A.ctx,s=c.createBufferSource(),g=c.createGain(),fl=c.createBiquadFilter();s.buffer=A.noise;fl.type=type||'highpass';fl.frequency.value=fq||6000;fl.Q.value=q;env(g,t,0.002,v,d);s.connect(fl);fl.connect(g);g.connect(out);s.start(t,Math.random()*0.5);s.stop(t+d+0.05)}
/* --- songs: tempo, scale root, chords (semitone offsets from root), lead pattern seed, groove --- */
const SONGS={
 title:{bpm:100,root:65,ch:[[0,4,7],[-3,0,4],[5,9,12],[7,11,14]],seed:131,lead:'kal',gr:'soft'},
 w1:{bpm:120,root:67,ch:[[0,4,7],[5,9,12],[7,11,14],[0,4,7]],seed:211,lead:'mar',gr:'afro'},
 w2:{bpm:114,root:62,ch:[[0,4,7],[-5,-1,2],[-3,0,4],[5,9,12]],seed:307,lead:'kal',gr:'afro'},
 w3:{bpm:108,root:64,ch:[[0,3,7],[5,8,12],[-2,2,5],[-5,-1,2]],seed:401,lead:'mar',gr:'soft'},
 w4:{bpm:126,root:60,ch:[[0,4,7],[-3,0,4],[-7,-3,0],[-5,-1,2]],seed:509,lead:'kal',gr:'jungle'},
 w5:{bpm:132,root:58,ch:[[0,3,7],[-2,2,5],[0,3,7],[1,5,8]],seed:613,lead:'mar',gr:'jungle'},
 boss:{bpm:146,root:58,ch:[[0,3,7],[0,3,7],[1,5,8],[-1,3,6]],seed:719,lead:'mar',gr:'boss'},
 win:{bpm:122,root:65,ch:[[0,4,7],[5,9,12],[7,11,14],[0,4,7]],seed:811,lead:'kal',gr:'afro'},
 /* Happy Birthday (traditional, public domain) as a kalimba music box in 3/4; one step = an 8th note */
 bday:{bpm:50,root:65,len:6,start:46,ch:[[0,4,7],[-5,-1,2],[-5,-1,2],[0,4,7],[0,4,7],[5,9,12],[-5,-1,2],[0,4,7]],
  notes:[[-3,2],[-5,2],[0,2],[-1,4],[-5,1],[-5,1],[-3,2],[-5,2],[2,2],[0,4],[-5,1],[-5,1],[7,2],[4,2],[0,2],[-1,2],[-3,2],[5,1],[5,1],[4,2],[0,2],[2,2],[0,4],[-5,1],[-5,1]],lead:'kal',gr:'waltz'}};
for(const k in SONGS){const S=SONGS[k];if(S.notes){S.tune=[];for(const[n,d]of S.notes){S.tune.push(n);for(let i=1;i<d;i++)S.tune.push(null)}}}
function rngS(s){return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296}}
function mkLead(S){const r=rngS(S.seed),bars=[];const pent=[0,2,4,7,9,12,14,16];for(let b=0;b<4;b++){const n=[];let p=2+(r()*3|0);for(let i=0;i<16;i++){const on=(i%4===0)||(r()<(i%2?0.28:0.55));if(on){p=Math.max(0,Math.min(7,p+((r()*5|0)-2)));n.push(pent[p])}else n.push(null)}bars.push(n)}return bars}
for(const k in SONGS)if(!SONGS[k].tune)SONGS[k].mel=mkLead(SONGS[k]);
function tick(){const c=A.ctx;if(!c||!A.song)return;const S=A.song,sp=60/S.bpm/4;
 if(S.tune){while(A.next<c.currentTime+0.15){const t=A.next,n=S.tune.length,st=A.step%n,i=st%S.len,bar=(st/S.len)|0,ch=S.ch[bar%S.ch.length],R=S.root,out=A.mus;
  if(i===0){pad(R+ch[0],t,sp*6,0.8,out);pad(R+ch[1],t,sp*6,0.6,out);pad(R+ch[2],t,sp*6,0.6,out);bass(R-24+ch[0],t,sp*1.8,0.8,out)}
  if(i===2||i===4){marimba(R+ch[1],t,0.28,out);marimba(R+ch[2],t,0.24,out)}
  const m=S.tune[st];if(m!==null&&m!==undefined){kalimba(R+12+m,t,1,out);kalimba(R+24+m,t+0.002,0.35,out);marimba(R+m,t,0.35,out)}
  if(i===0)drum(t,110,50,0.25,0.35,out);
  A.next+=sp;A.step++}return}
 while(A.next<c.currentTime+0.15){const t=A.next,i=A.step%16,bar=(A.step>>4)%4,ch=S.ch[bar],R=S.root,out=A.mus,big=(A.step>>6)%2;
  if(i===0){pad(R+ch[0],t,sp*16,1,out);pad(R+ch[1],t,sp*16,0.8,out);pad(R+ch[2],t,sp*16,0.7,out)}
  if(i%4===0||(S.gr!=='soft'&&i===10))bass(R-24+ch[i===8?2:0],t,sp*(i===10?1.5:3),1,out);
  const m=S.mel[bar][i];if(m!==null&&(S.gr!=='soft'||i%2===0)){const mm=R+12+m;(S.lead==='kal'?kalimba:marimba)(mm,t,big?1:0.85,out);if(big&&i%8===0)kalimba(mm+12,t+sp*0.5,0.5,out)}
  if(i%2===1&&S.gr!=='soft')marimba(R+ch[(i>>1)%3]+12,t,0.35,out);
  if(S.gr==='afro'){if(i===0||i===6||i===10)drum(t,150,55,0.22,0.9,out);if(i===4||i===12)drum(t,340,180,0.12,0.6,out);nz(t,0.04,i%2?0.05:0.09,7000,'highpass',out)}
  else if(S.gr==='jungle'){if(i%4===0||i===14)drum(t,130,48,0.25,1,out);if(i===3||i===7||i===11)drum(t,420,260,0.09,0.55,out);nz(t,0.05,i%4===2?0.12:0.05,5000,'bandpass',out,2)}
  else if(S.gr==='boss'){if(i%4===0||i===6)drum(t,120,40,0.3,1.1,out);if(i===4||i===12)nz(t,0.14,0.28,1800,'bandpass',out,0.8);nz(t,0.03,0.06,8000,'highpass',out)}
  else{if(i===0||i===8)drum(t,110,50,0.3,0.55,out);if(i%4===2)nz(t,0.06,0.04,6500,'highpass',out)}
  A.next+=sp;A.step++}}
A.music=function(name){this.init();if(!this.ctx)return;if(this.cur===name)return;this.cur=name;this.song=SONGS[name]||null;this.step=this.song&&this.song.start||0;this.next=this.ctx.currentTime+0.08;
 if(!this.timer)this.timer=setInterval(tick,40)};
A.stop=function(){this.cur=null;this.song=null};
const FX={
 jump(t,o){osc('square',380,t,0.09,0.08,o).frequency.exponentialRampToValueAtTime(760,t+0.09)},
 land(t,o){drum(t,120,60,0.08,0.35,o)},
 punch(t,o){nz(t,0.06,0.3,1400,'bandpass',o,1.5);drum(t,200,90,0.07,0.5,o)},
 kick(t,o){nz(t,0.09,0.35,900,'bandpass',o,1.2);drum(t,170,60,0.12,0.7,o)},
 bonk(t,o){drum(t,500,220,0.08,0.6,o);marimba(79,t,0.6,o)},
 ram(t,o){nz(t,0.25,0.3,700,'lowpass',o);osc('sawtooth',140,t,0.22,0.12,o).frequency.exponentialRampToValueAtTime(70,t+0.22)},
 pound(t,o){drum(t,90,30,0.4,1.1,o);nz(t,0.3,0.3,500,'lowpass',o)},
 tongue(t,o){osc('sine',300,t,0.14,0.2,o).frequency.exponentialRampToValueAtTime(900,t+0.12)},
 slurp(t,o){osc('sine',900,t,0.18,0.18,o).frequency.exponentialRampToValueAtTime(250,t+0.18);nz(t,0.1,0.06,3000,'bandpass',o,3)},
 gem(t,o){kalimba(88,t,0.9,o);kalimba(95,t+0.05,0.7,o)},
 star(t,o){[84,88,91,96,100].forEach((m,i)=>kalimba(m,t+i*0.06,0.9,o))},
 heart(t,o){[76,81,84].forEach((m,i)=>marimba(m,t+i*0.07,0.9,o))},
 hurt(t,o){osc('square',300,t,0.25,0.12,o).frequency.exponentialRampToValueAtTime(90,t+0.25);nz(t,0.1,0.15,1500,'bandpass',o)},
 kill(t,o){drum(t,600,120,0.12,0.6,o);kalimba(84,t+0.03,0.6,o)},
 hit(t,o){drum(t,200,70,0.2,1,o);nz(t,0.18,0.35,1200,'bandpass',o,0.8)},
 roar(t,o){const x=osc('sawtooth',110,t,0.7,0.16,o,0.05);x.frequency.linearRampToValueAtTime(70,t+0.7);nz(t,0.7,0.2,600,'bandpass',o,0.7)},
 laugh(t,o){for(let i=0;i<5;i++)osc('square',520-i*30,t+i*0.09,0.06,0.07,o)},
 cp(t,o){[72,76,79,84].forEach((m,i)=>marimba(m,t+i*0.08,0.8,o))},
 swing(t,o){nz(t,0.2,0.12,2500,'bandpass',o,1)},
 grab(t,o){marimba(91,t,0.7,o);drum(t,700,500,0.04,0.3,o)},
 crack(t,o){nz(t,0.22,0.4,1800,'bandpass',o,0.7);drum(t,160,50,0.2,0.7,o)},
 splash(t,o){nz(t,0.4,0.3,1200,'lowpass',o)},
 throw(t,o){nz(t,0.12,0.12,3000,'bandpass',o,2)},
 menu(t,o){marimba(84,t,0.5,o)},
 clear(t,o){[72,76,79,84,79,84,88].forEach((m,i)=>marimba(m,t+i*0.1,1,o))},
 over(t,o){[67,63,60,55].forEach((m,i)=>marimba(m,t+i*0.18,1,o))},
 free(t,o){[72,79,84,88,91,96].forEach((m,i)=>kalimba(m,t+i*0.08,1,o))},
 life(t,o){[79,84,88,91,96].forEach((m,i)=>marimba(m,t+i*0.06,1,o))}};
A.fx=function(n){if(typeof SIM!=='undefined'&&SIM||!this.ctx||this.muted)return;const f=FX[n];if(f)try{f(this.ctx.currentTime+0.005,this.sfx)}catch(e){}};
return A})();

/* ===== core: canvas, layout, input (touch / keys / gamepad), art, helpers ===== */
const $=id=>document.getElementById(id);
const cv=$('cv'),c=cv.getContext('2d');
const TAU=Math.PI*2,clamp=(v,a,b)=>v<a?a:v>b?b:v,lerp=(a,b,t)=>a+(b-a)*t,rand=(a,b)=>a+Math.random()*(b-a),sgn=v=>v<0?-1:1;
const TS=40,VH=400,GRAV=2200;
const QS=new URLSearchParams(location.search);
const SAVE_KEY='kga4_save';let save={};try{save=JSON.parse(localStorage.getItem(SAVE_KEY)||'{}')||{}}catch(e){save={}}
save.reached=save.reached||0;save.stars=save.stars||{};save.best=save.best||0;
function persist(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(save))}catch(e){}}
AU.muted=!!save.muted;
let W=0,H=0,DPR=1,S=1,VV=400,viewW=800,gameH=400,portrait=false,SAFE={t:0,r:0,b:0,l:0};
let state='boot',G=null,frame=0,SIM=0;
function readSafe(){const p=$('sp');if(!p)return;const cs=getComputedStyle(p);SAFE={t:parseFloat(cs.paddingTop)||0,r:parseFloat(cs.paddingRight)||0,b:parseFloat(cs.paddingBottom)||0,l:parseFloat(cs.paddingLeft)||0}}
function resize(){W=innerWidth;H=innerHeight;DPR=Math.min(devicePixelRatio||1,2);cv.width=Math.round(W*DPR);cv.height=Math.round(H*DPR);portrait=H>W*1.08;readSafe();
 if(portrait){const vw=clamp(W,380,470);S=W/vw;gameH=Math.round(H*0.62);VV=gameH/S}
 else{VV=VH;S=H/VH;gameH=H}
 viewW=W/S;layoutPad();document.body.classList.toggle('portrait',portrait)}
let PADR={act:null,jump:null,dive:null};
/* Vol 4 buttons (Peter Oct 31): 3 buttons, same smaller size, N64-style diamond at bottom right, bottom slot empty.
   JUMP (orange) left, ACTION (green) right, DIVE (blue) top. Always above the iPhone bottom toolbar / home bar (safe-area). */
function layoutPad(){const pad=$('pad'),ba=$('bAct'),bj=$('bJump'),bd=$('bDive'),hint=$('swipeHint');if(!pad)return;
 let sz,gap,bot,right;
 if(portrait){const top=gameH,ph=H-top;pad.style.top=top+'px';pad.style.height=ph+'px';
  sz=Math.round(clamp(Math.min(ph*0.27,W*0.18),54,72));gap=Math.round(sz*0.12);bot=Math.round(clamp(ph*0.07,12,26))+16+SAFE.b;right=14+SAFE.r;
  hint.style.display='';Object.assign(hint.style,{top:'12px',left:(14+SAFE.l)+'px',right:(sz*3+gap*2+30+SAFE.r)+'px'})}
 else{pad.style.top='0';pad.style.height=H+'px';sz=Math.round(clamp(H*0.15,48,64));gap=Math.round(sz*0.12);bot=22+SAFE.b;right=14+SAFE.r;hint.style.display='none'}
 /* Peter Oct 31 11:26 PM: whole pad raised, ACTION (green, left) + JUMP (orange, right) nearly touching (3px gap), DIVE on top centred, lifted to clear them (4px gap) */
 const h=(sz+3)/2,v=Math.ceil(Math.sqrt((sz+4)*(sz+4)-h*h));/* h: horizontal centre offset; v: DIVE lift */
 const cR=right+sz/2+h,cB=bot+sz/2;/* middle column centre (from right/bottom) */
 const at=(el,r,b)=>Object.assign(el.style,{width:sz+'px',height:sz+'px',left:'',top:'',right:Math.round(r-sz/2)+'px',bottom:Math.round(b-sz/2)+'px'});
 at(ba,cR+h,cB);at(bj,cR-h,cB);at(bd,cR,cB+v);
 if(portrait)hint.style.right=(right+2*h+sz+10)+'px';
 const fs=Math.round(sz*0.25)+'px';ba.style.fontSize=Math.round(sz*0.21)+'px';bj.style.fontSize=fs;bd.style.fontSize=fs;
 requestAnimationFrame(()=>{const r=e=>{const b=e.getBoundingClientRect();return{x:b.left,y:b.top,w:b.width,h:b.height}};PADR.act=r(ba);PADR.jump=r(bj);PADR.dive=r(bd)})}
addEventListener('resize',resize);addEventListener('orientationchange',()=>setTimeout(resize,120));
if(window.visualViewport)visualViewport.addEventListener('resize',resize);
/* ---------- input ---------- */
const K={L:0,R:0,U:0,D:0,J:0,A:0,Y:0,V:0};const KP={J:0,A:0,Y:0,V:0};const VIRT={jump:0,act:0,dive:0},VIRTP={jump:0,act:0,dive:0};const TOUCH=new Map();let swipeJump=0;
const inp={L:0,R:0,U:0,D:0,jumpP:0,jump:0,actP:0,act:0,ramP:0,diveP:0,dive:0};let lastJ=0,lastA=0,lastY=0,lastV=0;
const KEYMAP={ArrowLeft:'L',KeyA:'L',ArrowRight:'R',KeyD:'R',ArrowUp:'U',KeyW:'U',ArrowDown:'D',KeyS:'D',Space:'J',KeyZ:'J',KeyX:'A',KeyJ:'A',KeyC:'Y',KeyK:'Y',KeyV:'V',KeyE:'V',ShiftLeft:'V',ShiftRight:'V'};
addEventListener('keydown',e=>{AU.unlock();if(e.target&&e.target.tagName==='INPUT')return;const k=KEYMAP[e.code];
 if(document.body.classList.contains('uiopen')){if(!e.repeat)uiKey(e);if(k||e.code==='Enter')e.preventDefault();return}
 if(k){if(!K[k]&&k in KP)KP[k]=1;K[k]=1;e.preventDefault()}
 if(e.code==='KeyP'||e.code==='Escape'){if(state==='play')pauseGame()}
 if(e.code==='KeyM')toggleMute()});
addEventListener('keyup',e=>{const k=KEYMAP[e.code];if(k)K[k]=0});
function swipeDir(t){const dx=t.x-t.ax,dy=t.y-t.ay,d=Math.hypot(dx,dy),o={};if(d<14)return o;if(d>44){t.ax=t.x-dx/d*44;t.ay=t.y-dy/d*44}
 const s=Math.round(Math.atan2(dy,dx)/(Math.PI/4));if(s===0||s===1||s===-1)o.R=1;if(s===4||s===-4||s===3||s===-3)o.L=1;if(s===2||s===1||s===3)o.D=1;if(s===-2||s===-1||s===-3)o.U=1;return o}
function tStart(id,x,y){AU.unlock();TOUCH.set(id,{x,y,ax:x,ay:y,z:{}})}
function tMove(id,x,y){const t=TOUCH.get(id);if(!t)return;t.x=x;t.y=y;const before=t.z.U;t.z=swipeDir(t);if(t.z.U&&!before)swipeJump=1}
function tEnd(id){TOUCH.delete(id)}
function clearInput(){TOUCH.clear();for(const k in K)K[k]=0;for(const k in KP)KP[k]=0;VIRT.jump=VIRT.act=VIRT.dive=VIRTP.jump=VIRTP.act=VIRTP.dive=0;swipeJump=0;document.querySelectorAll('#pad .big.on').forEach(b=>b.classList.remove('on'))}
function bindSurface(el){el.addEventListener('touchstart',e=>{if(state!=='play')return;e.preventDefault();for(const t of e.changedTouches)tStart(t.identifier,t.clientX,t.clientY)},{passive:false});
 el.addEventListener('touchmove',e=>{if(state!=='play')return;e.preventDefault();for(const t of e.changedTouches)tMove(t.identifier,t.clientX,t.clientY)},{passive:false});
 el.addEventListener('touchend',e=>{for(const t of e.changedTouches)tEnd(t.identifier)},{passive:false});el.addEventListener('touchcancel',e=>{for(const t of e.changedTouches)tEnd(t.identifier)});
 let md=false;el.addEventListener('mousedown',e=>{if(state!=='play')return;md=true;tStart('m',e.clientX,e.clientY)});addEventListener('mousemove',e=>{if(md)tMove('m',e.clientX,e.clientY)});addEventListener('mouseup',()=>{if(md){md=false;tEnd('m')}})}
function bindBtn(el,k){const on=e=>{e.preventDefault();e.stopPropagation();AU.unlock();if(!VIRT[k])VIRTP[k]=1;VIRT[k]=1;el.classList.add('on')},off=e=>{e.preventDefault();e.stopPropagation();VIRT[k]=0;el.classList.remove('on')};
 el.addEventListener('touchstart',on,{passive:false});el.addEventListener('touchend',off,{passive:false});el.addEventListener('touchcancel',off,{passive:false});
 el.addEventListener('mousedown',on);el.addEventListener('mouseup',off);el.addEventListener('mouseleave',off);el.addEventListener('contextmenu',e=>e.preventDefault())}
addEventListener('blur',clearInput);document.addEventListener('visibilitychange',()=>{if(document.hidden){clearInput();if(state==='play')pauseGame()}});
/* ---------- gamepad (standard mapping; USB or Bluetooth, desktop or phone) ---------- */
const GP={on:false,L:0,R:0,U:0,D:0,J:0,A:0,Y:0,V:0,id:'',prev:{}};let gpIdx=0,gpSeen=false;
function pollPad(){let pads=[];try{pads=navigator.getGamepads?navigator.getGamepads():[]}catch(e){}let p=null;for(const q of pads||[])if(q&&q.connected!==false&&q.buttons&&q.buttons.length){p=q;break}
 if(!p){if(GP.on){GP.on=false;toast('Controller disconnected')}GP.L=GP.R=GP.U=GP.D=GP.J=GP.A=GP.Y=GP.V=0;return}
 if(!GP.on){GP.on=true;GP.id=p.id||'';if(!gpSeen){gpSeen=true}toast('🎮 Controller connected');refreshCtlHint()}
 const b=i=>!!(p.buttons[i]&&(p.buttons[i].pressed||p.buttons[i].value>0.5)),ax=i=>p.axes&&p.axes.length>i?p.axes[i]:0;
 const x=ax(0),y=ax(1);GP.L=b(14)||x<-0.4?1:0;GP.R=b(15)||x>0.4?1:0;GP.U=b(12)||y<-0.55?1:0;GP.D=b(13)||y>0.55?1:0;
 GP.J=b(0)?1:0;GP.A=(b(2)||b(1)||b(5)||b(7))?1:0;GP.Y=(b(4)||b(6))?1:0;GP.V=b(3)?1:0;
 const now={st:b(9),bk:b(8),a:b(0),b:b(1),u:GP.U,d:GP.D,l:GP.L,r:GP.R},pr=GP.prev;const edge=k=>now[k]&&!pr[k];GP.prev=now;
 if(edge('st')){if(state==='play')pauseGame();else if(state==='pause')resumeGame()}
 if(edge('bk'))toggleMute();
 if(document.body.classList.contains('uiopen')){if(edge('u')||edge('l'))gpFocus(gpIdx-1);if(edge('d')||edge('r'))gpFocus(gpIdx+1);
  if(edge('a')){const t=document.querySelector('#ui .gpf')||document.querySelector('#ui [data-a]');if(t)t.click()}
  if(edge('b')){const bk=document.querySelector('#ui [data-a="back"],#ui [data-a="resume"]');if(bk)bk.click()}}}
addEventListener('gamepadconnected',()=>pollPad());
function gpFocus(i,ns){const bs=[...document.querySelectorAll('#ui [data-a]')];if(!bs.length)return;gpIdx=(i+bs.length)%bs.length;bs.forEach((b,j)=>b.classList.toggle('gpf',j===gpIdx));if(!ns){try{bs[gpIdx].scrollIntoView({block:'nearest'})}catch(e){}AU.fx('menu')}}
function uiKey(e){const nav={ArrowDown:1,ArrowRight:1,KeyS:1,KeyD:1,ArrowUp:-1,ArrowLeft:-1,KeyW:-1,KeyA:-1}[e.code];
 if(nav){gpFocus(gpIdx+(document.querySelector('#ui .gpf')?nav:0))}
 else if(e.code==='Enter'||e.code==='Space'||e.code==='KeyZ'){const t=document.querySelector('#ui .gpf')||document.querySelector('#ui [data-a]');if(t)t.click()}
 else if(e.code==='Escape'||e.code==='Backspace'||e.code==='KeyP'){const bk=document.querySelector('#ui [data-a="back"],#ui [data-a="resume"]');if(bk)bk.click()}}
function readInput(){pollPad();let L=K.L||GP.L,R=K.R||GP.R,U=K.U||GP.U,D=K.D||GP.D;for(const t of TOUCH.values()){if(t.z.L)L=1;if(t.z.R)R=1;if(t.z.U)U=1;if(t.z.D)D=1}
 if(window.__BOT&&G&&state==='play'){const b=botInput();L=b.L;R=b.R;U=b.U;D=b.D;b.J&&(KP.J=1);b.Jh&&(K.J=1);b.A&&(KP.A=1);b.Y&&(KP.Y=1);b.V&&(KP.V=1);if(!b.Jh&&window.__BOTJ)K.J=0;window.__BOTJ=b.Jh}
 inp.L=L&&!R?1:0;inp.R=R&&!L?1:0;inp.U=U?1:0;inp.D=D?1:0;
 const j=!!(K.J||GP.J||VIRT.jump||VIRTP.jump||KP.J);inp.jumpP=((j&&!lastJ)||swipeJump||KP.J||VIRTP.jump)?1:0;inp.jump=j||swipeJump?1:0;lastJ=j;swipeJump=0;
 const a=!!(K.A||GP.A||VIRT.act||VIRTP.act||KP.A);inp.actP=(a&&!lastA)||KP.A||VIRTP.act?1:0;inp.act=a?1:0;lastA=a;
 const y=!!(K.Y||GP.Y||KP.Y);inp.ramP=(y&&!lastY)||KP.Y?1:0;lastY=y;
 const v=!!(K.V||GP.V||VIRT.dive||VIRTP.dive||KP.V);inp.diveP=(v&&!lastV)||KP.V||VIRTP.dive?1:0;inp.dive=v?1:0;lastV=v;
 VIRTP.jump=VIRTP.act=VIRTP.dive=0;KP.J=KP.A=KP.Y=KP.V=0}
/* ---------- art ---------- */
const IMG={},META={};
function loadArt(onp){return fetch('art/meta.json?v='+VERSION).then(r=>r.json()).then(m=>{Object.assign(META,m);const ns=Object.keys(m);let done=0;
 return Promise.all(ns.map(n=>new Promise(res=>{const im=new Image();im.onload=()=>{IMG[n]=im;done++;onp&&onp(done/ns.length);res()};im.onerror=()=>{done++;res()};im.src='art/'+n+'.webp?v='+VERSION})))}).catch(()=>{})}
/* draw sprite anchored bottom-center; art is authored at 2 image px per world unit */
function spr(n,x,y,sc=1,flip=false,alpha=1,rot=0,ay=1){const im=IMG[n];if(!im)return;const w=im.width*0.5*sc,h=im.height*0.5*sc;c.save();c.translate(x,y);if(rot)c.rotate(rot);if(flip)c.scale(-1,1);if(alpha<1)c.globalAlpha*=alpha;c.drawImage(im,-w/2,-h*ay,w,h);c.restore()}
function sprH(n,sc=1){const im=IMG[n];return im?im.height*0.5*sc:0}
const TINT={};function tinted(n,col){const k=n+col;if(TINT[k])return TINT[k];const im=IMG[n];if(!im)return null;const cc=document.createElement('canvas');cc.width=im.width;cc.height=im.height;const x=cc.getContext('2d');x.drawImage(im,0,0);x.globalCompositeOperation='source-atop';x.fillStyle=col;x.fillRect(0,0,cc.width,cc.height);return TINT[k]=cc}
function sprT(n,col,x,y,sc=1,flip=false,alpha=1){const im=tinted(n,col);if(!im)return;const w=im.width*0.5*sc,h=im.height*0.5*sc;c.save();c.translate(x,y);if(flip)c.scale(-1,1);c.globalAlpha*=alpha;c.drawImage(im,-w/2,-h,w,h);c.restore()}
/* ---------- fx ---------- */
function P(o){if(SIM)return o;if(G.parts.length<420)G.parts.push(o);return o}
function burst(x,y,n,cols,sp=240,life=0.6,size=3,grav=600){for(let i=0;i<n;i++){const a=Math.random()*TAU,v=sp*(0.3+Math.random()*0.7);P({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-sp*0.25,l:life*(0.5+Math.random()*0.7),m:life,s:size*(0.5+Math.random()),c:cols[i%cols.length],g:grav})}}
function dust(x,y,n=6,col='rgba(230,200,150,.8)'){for(let i=0;i<n;i++)P({x:x+rand(-12,12),y:y-rand(0,6),vx:rand(-60,60),vy:-rand(10,60),l:rand(0.35,0.7),m:0.7,s:rand(5,10),c:col,g:-30,puff:1})}
function ring(x,y,col,r=50,life=0.35,w=5){P({ring:1,x,y,l:life,m:life,s:r,c:col,w,vx:0,vy:0,g:0})}
function stars(x,y,n=6){burst(x,y,n,['#fff6a0','#ffd23a','#fff'],200,0.6,4,300)}
function ftxt(x,y,s,col='#fff',big=0){if(SIM)return;for(const t of G.texts)if(Math.abs(t.x-x)<120&&Math.abs(t.y-y)<26&&t.l>0.7)y-=26;G.texts.push({x,y,s,c:col,l:1.1,m:1.1,big})}
function shake(a){if(SIM)return;G.shake=Math.max(G.shake,a)}
function hitstop(t){if(SIM)return;G.hs=Math.max(G.hs,t)}
function flash(col,a=0.6){if(SIM)return;G.flash={c:col,a}}
let toastT=0;function toast(s,ms=1800){const t=$('toast');if(!t)return;t.textContent=s;t.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('on'),ms)}
function rng(seed){let s=seed>>>0;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296}}
const ovr=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
/* respawn fix (Oct 30): blinking pit falls are free; respawn backs up onto solid ground */
function rfOk(x,row,w){const a=Math.floor((x-w/2)/TS),b=Math.floor((x+w/2)/TS);for(let t=a;t<=b;t++){if(!solidK(tileAt(t,row)))return false;for(let r=1;r<=2;r++){const k=tileAt(t,row-r);if(solidK(k)||k===5||k===6)return false}}return true}
function rfBack(s,fx,w){const row=Math.floor((s.y+1)/TS),d=sgn(fx-s.x)||1;let ex=s.x;for(let i=0;i<80;i++){if(!rfOk(ex+d*4,row,w))break;ex+=d*4}const need=w*2,dist=Math.abs(ex-s.x);if(rfOk(s.x,row,w)&&dist>=need)return s.x;for(let k=Math.max(0,need-dist);k<TS*30;k+=4){if(rfOk(s.x-d*k,row,w)&&rfOk(s.x-d*k-d*w,row,w))return s.x-d*k}return s.x}
function rfRestore(p){const s=p.rfSafe||(G.cp?{x:G.cp.x,y:G.cp.y}:{x:3*TS,y:9*TS});p.x=rfBack(s,p.x,p.w);p.y=s.y;p.vx=0;p.vy=0;p.pound=0;p.ram=0;p.ledge=null;p.onG=false;p.inv=Math.max(p.inv,1);camUpdate(0,true)}
function bx(o){return{x:o.x-o.w/2,y:o.y-o.h,w:o.w,h:o.h}}

/* ===== worlds, levels, chunk builder (Vol 4: Ocean Giraffe) ===== */
const ROWS=16,LVH=ROWS*TS;
const WORLDS=[
 {name:'Sunny Beach',bg:'bg1',ter:'ter1',cap:'sand',top:'#f6dc94',top2:'#d8b468',edge:'#8a6a3a',plank:'#b08250',song:'w1',amb:'spray',sky:'#9ad8ff',fog:'rgba(255,240,200,.06)',water:['rgba(70,200,230,.55)','rgba(10,90,150,.8)']},
 {name:'Tide Pools',bg:'bg2',ter:'ter2',cap:'algae',top:'#6aa04a',top2:'#3a5a2a',edge:'#1a1a1a',plank:'#8a6a4a',song:'w2',amb:'spray',sky:'#f8c890',fog:'rgba(255,200,140,.07)',water:['rgba(90,190,200,.55)','rgba(20,70,110,.82)']},
 {name:'Coral Caves',bg:'bg3',ter:'ter3',cap:'coral',top:'#ff8aa8',top2:'#3a8a9a',edge:'#0a2a3a',plank:'#7a5a3a',song:'w3',amb:'bubbles',sky:'#2a6a9a',fog:'rgba(80,200,255,.08)',water:['rgba(60,180,240,.5)','rgba(8,40,110,.85)']},
 {name:'Shipwreck Cove',bg:'bg4',ter:'ter4',cap:'deck',top:'#a87848',top2:'#6a4422',edge:'#2a1608',plank:'#9a6a3a',song:'w4',amb:'embers',sky:'#f08a5a',fog:'rgba(255,140,90,.07)',water:['rgba(70,150,200,.55)','rgba(20,40,90,.85)']}];
const BOSSES=[
 {k:'tusk',name:'LARRY THE LOBSTER',hp:6},
 {k:'bab',name:'OLGA THE OCTOPUS',hp:7},
 {k:'croc',name:'SHARKY THE SHARK',hp:8},
 {k:'cak',name:'CAPTAIN CRAB',hp:12}];
const LEVELS=[
 {name:'Seashell Shore',w:0,ch:['start','sign:Captain Crab grabbed Peter AND his birthday present for Kelly! Swipe and hold to run. Swipe up or tap JUMP to jump.','flat','sign:Tap ACTION near seaweed, crabs or gems and your long TONGUE slurps them up!','crab','tree*','sign:Double-tap ACTION for a NECK RAM. It smashes barnacle rocks!','wall','cp','sign:This is Pip the sea turtle! Hop in the water and you ride on his back.','sea*','sign:Rock wall ahead? Tap DIVE to swim under it with Pip! Swipe up to come back up.','dive','crab','cp','sign:Life ring? Jump, then tap ACTION to SWING with your neck. JUMP lets go!','swing1*','urchin','feast','end']},
 {name:'Sandcastle Bay',w:0,ch:['start','gull','steps*','crab','sea','hermit','cp','dive*','crab','ledge','swing1','cp','urchin','feast*','boss:0']},
 {name:'Tide Pool Trail',w:1,ch:['start','sign:Tide pools! Swim with Pip, then JUMP out onto the rocks. Watch out for jellyfish!','pool*','crab','plat','jellypool','cp','ledge*','gull','reef','cp','hermit','mound','feast*','end']},
 {name:'Starfish Rocks',w:1,ch:['start','pool','urchin*','cliff','cp','sea','gull','dive*','cp','coco','swing2','feast*','boss:1']},
 {name:'Coral Caves',w:2,ch:['start','sign:Cracked coral? Tap ACTION while riding Pip to SHELL DASH right through it!','reef*','fishsea','cp','bricks*','puffsea','dive','cp','thorns','swing2','feast*','end']},
 {name:'Glowing Grotto',w:2,ch:['start','dive*','coco','cp','reef','fishsea','swing3*','cp','puffsea','ledge','feast*','boss:2']},
 {name:'Shipwreck Cove',w:3,ch:['start','sign:Captain Crab\'s ship is close! Swing, swim and dive past his crew.','pier*','gull','hermit','cp','dive','wall','swing2*','cp','reef','crab','feast*','end']},
 {name:"Captain Crab's Ship",w:3,ch:['start','crab','thorns*','swing2','cp','sea*','coco','dive','cp','ledge*','feast','sign:Captain Crab has Peter and the present! RAM him or stomp him when he is dizzy. Watch out for cannonballs!','boss:3']}];
/* tiles: 0 air, 1 ground, 2 one-way plank, 3 cracked coral, 4 barnacle rock, 5 urchin spikes, 6 water */
function buildLevel(li){const L=LEVELS[li],R=rng(4000+li*77),T=[];let h=9;
 const ents=[],signs=[],hooks=[],gems=[],stars=[],cps=[];let boss=null,cage=null,goal=null;
 const col=(top,kind=1)=>{const a=new Array(ROWS).fill(0);if(top<ROWS)for(let y=top;y<ROWS;y++)a[y]=kind;T.push(a);return T.length-1};
 const flat=n=>{for(let i=0;i<n;i++)col(h)};
 const pit=(n,water)=>{for(let i=0;i<n;i++){const a=new Array(ROWS).fill(0);if(water){for(let y=h+1;y<ROWS-1;y++)a[y]=6;a[ROWS-1]=1}T.push(a)}};
 const sea=n=>pit(n,true);
 const set=(cx,cy,k)=>{if(T[cx]&&cy>=0&&cy<ROWS)T[cx][cy]=k};
 const plank=(cx,cy,n)=>{for(let i=0;i<n;i++)set(cx+i,cy,2)};
 const gem=(cx,cy)=>gems.push({x:cx*TS+TS/2,y:cy*TS+TS/2,t:R()*6});
 const arc=(cx,cy,n)=>{for(let i=0;i<n;i++)gem(cx+i,cy-Math.round(Math.sin(i/(n-1||1)*Math.PI)*1.5))};
 const foe=(k,cx,cy,o={})=>ents.push(Object.assign({k,x:cx*TS+TS/2,y:cy*TS},o));
 const star=(cx,cy)=>stars.push({x:cx*TS+TS/2,y:cy*TS+TS/2,id:stars.length});
 const food=(cx,cy,k='leaves')=>ents.push({k:'food',f:k,x:cx*TS+TS/2,y:cy*TS+TS/2});
 const S0=h+1,DEEP=ROWS-2;/* water surface row and deepest water row */
 for(const raw of L.ch){let name=raw,arg='';if(raw.includes(':')){[name,arg]=[raw.slice(0,raw.indexOf(':')),raw.slice(raw.indexOf(':')+1)]}
  const st=name.endsWith('*');if(st)name=name.slice(0,-1);const x0=T.length;
  switch(name){
  case 'start':flat(8);break;
  case 'sign':flat(2);signs.push({x:(T.length-1)*TS,y:h*TS,text:arg});flat(3);break;
  case 'flat':flat(4);arc(T.length-3,h-2,4);flat(6);if(R()<0.6)foe('crab',T.length-3,h);break;
  case 'crab':flat(4);foe('crab',T.length-1,h);flat(4);arc(x0+2,h-2,4);foe('crab',T.length-1,h);flat(3);break;
  case 'urchin':flat(4);foe('urchin',T.length-1,h);flat(6);arc(x0+3,h-3,4);if(st)star(x0+5,h-5);break;
  case 'hermit':flat(4);foe('hermit',T.length+3,h);flat(10);arc(x0+5,h-3,4);break;
  case 'gull':flat(6);foe('gull',T.length-2,h-4);flat(6);arc(x0+4,h-2,5);break;
  case 'steps':for(let i=0;i<3;i++){h-=1;flat(3);gem(T.length-2,h-1)}if(st)star(T.length-2,h-4);flat(3);for(let i=0;i<3;i++){h+=1;flat(2)}break;
  case 'plat':flat(2);plank(T.length,h-3,3);flat(3);plank(T.length,h-5,3);gem(T.length+1,h-6);flat(3);if(st)star(T.length-1,h-7);flat(3);break;
  case 'feast':flat(2);for(let i=0;i<8;i++)gem(T.length+i,h-1-((i%2)));food(T.length+4,h-4,'mango');flat(10);if(st)star(T.length-5,h-5);plank(T.length-7,h-3,3);break;
  case 'cp':flat(3);cps.push({x:(T.length-1)*TS+TS/2,y:h*TS,on:false});flat(3);break;
  case 'wall':flat(3);for(let i=0;i<2;i++){const cx=col(h);for(let y=h-5;y<h;y++)set(cx,y,4)}gem(T.length+1,h-1);flat(5);break;
  case 'tree':flat(3);food(T.length,h-4);food(T.length+2,h-5);if(st)star(T.length+1,h-6);flat(5);foe('crab',T.length-1,h);flat(2);break;
  case 'swing1':flat(2);{const g=9;hooks.push({x:(T.length+g/2)*TS,y:(h-5)*TS});for(let i=0;i<5;i++)gem(T.length+2+i,h-3);if(st)star(T.length+g/2|0,h-7);pit(g,L.w!==2)}flat(4);break;
  case 'swing2':flat(2);{const g=14;hooks.push({x:(T.length+4)*TS,y:(h-5)*TS},{x:(T.length+10)*TS,y:(h-5)*TS});arc(T.length+5,h-3,4);if(st)star(T.length+7,h-6);pit(g,true)}flat(4);break;
  case 'swing3':flat(2);{const g=19;hooks.push({x:(T.length+4)*TS,y:(h-5)*TS},{x:(T.length+9.5)*TS,y:(h-6)*TS},{x:(T.length+15)*TS,y:(h-5)*TS});arc(T.length+6,h-3,7);if(st)star(T.length+9,h-8);pit(g,false)}flat(4);break;
  /* --- ocean chunks (ride Pip) --- */
  case 'sea':flat(2);{const s=T.length;sea(14);arc(s+2,S0-2,5);for(let i=0;i<4;i++)gem(s+8+i,DEEP);foe('jelly',s+10,S0,{bob:1});if(st)star(s+6,DEEP)}flat(4);break;
  case 'pool':flat(2);{const s=T.length;sea(7);for(let i=0;i<3;i++)gem(s+2+i,DEEP);if(st)star(s+3,DEEP-1);arc(s+1,S0-2,4)}flat(4);break;
  case 'jellypool':flat(2);{const s=T.length;sea(10);foe('jelly',s+3,S0,{bob:1});foe('jelly',s+7,S0-2,{bob:1});for(let i=0;i<5;i++)gem(s+2+i,DEEP)}flat(4);break;
  case 'dive':flat(2);{const s=T.length;sea(16);/* rock wall that reaches below the surface: swim UNDER it */
   for(let i=6;i<9;i++)for(let y=0;y<=S0+1;y++)set(s+i,y,1);
   for(let i=0;i<5;i++)gem(s+5+i,DEEP);if(st)star(s+7,DEEP);foe('jelly',s+3,S0,{bob:1});arc(s+11,S0-2,3)}flat(4);break;
  case 'reef':flat(2);{const s=T.length;sea(14);for(let y=S0;y<=DEEP;y++){set(s+6,y,3);set(s+7,y,3)}
   for(let i=0;i<4;i++)gem(s+9+i,DEEP-1);if(st)star(s+10,DEEP);foe('fish',s+3,DEEP-1,{rng:2})}flat(4);break;
  case 'fishsea':flat(2);{const s=T.length;sea(16);foe('fish',s+5,DEEP-1,{rng:3});foe('fish',s+11,S0+2,{rng:3,v:1});arc(s+3,DEEP,4);arc(s+10,DEEP,4);if(st)star(s+8,DEEP)}flat(4);break;
  case 'puffsea':flat(2);{const s=T.length;sea(14);foe('puff',s+5,S0+2);foe('puff',s+9,DEEP-1);foe('jelly',s+12,S0,{bob:1});for(let i=0;i<4;i++)gem(s+6+i,DEEP);if(st)star(s+7,S0+1)}flat(4);break;
  case 'pier':flat(2);{const s=T.length;sea(16);plank(s+2,h-1,4);plank(s+9,h-2,4);foe('gull',s+8,h-6);arc(s+2,h-3,4);for(let i=0;i<4;i++)gem(s+5+i,DEEP);if(st)star(s+14,DEEP)}flat(4);break;
  /* --- land chunks --- */
  case 'pit':flat(2);pit(3);gem(T.length-2,h-3);flat(4);break;
  case 'coco':flat(3);plank(T.length,h-4,3);foe('coco',T.length+1,h-4);flat(4);if(st)star(T.length-3,h-7);gem(T.length-3,h-5);flat(5);break;
  case 'bricks':flat(2);{const s0=T.length;flat(8);for(let y=h-3;y<h;y++){set(s0,y,1);set(s0+7,y,1)}for(let i=1;i<7;i++){set(s0+i,h-3,3);gem(s0+i,h-1)}if(st)star(s0+4,h-2);gem(s0+3,h-4);gem(s0+4,h-4)}flat(3);break;
  case 'mound':flat(3);{const cx=T.length;for(let i=0;i<3;i++){col(h);for(let y=h-4;y<h;y++)set(cx+i,y,3)}if(st)star(cx+1,h-6);gem(cx,h-5);gem(cx+2,h-5)}flat(3);foe('urchin',T.length-1,h);flat(3);break;
  case 'cliff':flat(2);for(let i=0;i<3;i++){h-=2;flat(3);gem(T.length-2,h-1)}flat(4);foe('crab',T.length-2,h);for(let i=0;i<3;i++){h+=2;flat(2)}if(st)star(x0+10,h-9);break;
  case 'thorns':flat(3);{const s=T.length;flat(7);for(let i=1;i<6;i++)set(s+i,h-1,5);plank(s+1,h-4,2);plank(s+4,h-4,2);if(st)star(s+3,h-6);arc(s+1,h-5,5)}flat(3);break;
  case 'ledge':{flat(3);const up=h>=7?5:3;gem(T.length-2,h-1);h-=up;flat(6);gem(T.length-4,h-1);gem(T.length-3,h-1);if(st)star(T.length-3,h-3);foe('crab',T.length-2,h);h+=up;flat(4);break}
  case 'end':flat(5);goal={x:(T.length-2)*TS,y:h*TS};flat(8);break;
  case 'boss':{flat(2);const a=T.length;h=9;flat(26);
   const bi=+arg,bk=BOSSES[bi].k;boss={i:bi,x0:a*TS,x1:(a+26)*TS,y:h*TS};
   if(bk==='croc'){for(let i=10;i<17;i++){const c2=new Array(ROWS).fill(0);for(let y=h+1;y<ROWS-1;y++)c2[y]=6;c2[ROWS-1]=1;T[a+i]=c2}plank(a+12,h,3)}
   if(bk==='bab'){hooks.push({x:(a+8)*TS,y:(h-5)*TS},{x:(a+18)*TS,y:(h-5)*TS});plank(a+3,h-4,3);plank(a+20,h-4,3)}
   if(bk==='cak'){plank(a+4,h-4,4);plank(a+18,h-4,4)}
   flat(6);break}
  default:flat(4)}
 }
 return{T,ents,signs,hooks,gems,stars,cps,boss,cage,goal,cols:T.length,W:T.length*TS}}
function tileAt(tx,ty){if(tx<0)return 1;if(!G||tx>=G.L.cols)return 1;if(ty<0)return 0;if(ty>=ROWS)return 0;return G.L.T[tx][ty]}
const solidK=k=>k===1||k===3||k===4;
/* water helpers */
function waterTop(tx){if(!G||tx<0||tx>=G.L.cols)return null;const c=G.L.T[tx];for(let y=0;y<ROWS;y++){if(c[y]===6)return y*TS;}return null}
function inWater(x,y){return tileAt(Math.floor(x/TS),Math.floor(y/TS))===6}

/* ===== player: Kelly's giraffe ===== */
const PH={foot:{w:28,h:76,spd:235,acc:1900,jv:640,hold:0.6},ride:{w:58,h:90,spd:300,acc:2100,jv:690,hold:0.6},swim:{w:70,h:56,spd:250,acc:1500,jv:620,hold:0.6}};
const SWF=22;/* Pip floats with his belly this far under the water line */
function newPlayer(x,y,mode){return{x,y,vx:0,vy:0,face:1,onG:false,mode,hp:3,maxhp:3,inv:0,coy:0,jbuf:0,holdJ:0,atk:0,atkK:'',atkHit:null,lastTap:-9,ram:0,ramDx:0,ramDy:0,ramCd:0,pound:0,swing:null,tng:0,tngT:null,anim:0,land:0,dead:0,w:PH[mode].w,h:PH[mode].h,squash:0,swCd:0,ledge:null,lgCd:0}}
function setMode(p,m){p.mode=m;p.w=PH[m].w;p.h=PH[m].h}
function headPt(p){if(p.mode==='swim')return{x:p.x+p.face*36,y:p.y-p.h-44};return p.mode==='ride'?{x:p.x+p.face*34,y:p.y-p.h+6}:{x:p.x+p.face*8,y:p.y-p.h+10}}
/* tile collision (axis separated) */
function collideX(o){const b=bx(o),y0=Math.floor((b.y+2)/TS),y1=Math.floor((b.y+b.h-2)/TS);
 if(o.vx>0){const tx=Math.floor((b.x+b.w)/TS);for(let ty=y0;ty<=y1;ty++)if(solidK(tileAt(tx,ty))){o.x=tx*TS-o.w/2-0.01;return tx}}
 else if(o.vx<0){const tx=Math.floor(b.x/TS);for(let ty=y0;ty<=y1;ty++)if(solidK(tileAt(tx,ty))){o.x=(tx+1)*TS+o.w/2+0.01;return tx}}
 return null}
function collideY(o,py,drop){const b=bx(o),x0=Math.floor((b.x+2)/TS),x1=Math.floor((b.x+b.w-2)/TS);o.onG=false;
 if(o.vy>=0){const ty=Math.floor(o.y/TS);for(let tx=x0;tx<=x1;tx++){const k=tileAt(tx,ty);if(solidK(k)||(k===2&&!drop&&py<=ty*TS+1)){o.y=ty*TS;o.vy=0;o.onG=true;return{tx,ty,k}}}}
 else{const ty=Math.floor(b.y/TS);for(let tx=x0;tx<=x1;tx++){const k=tileAt(tx,ty);if(solidK(k)){o.y=(ty+1)*TS+o.h;o.vy=0;return{tx,ty,k,up:1}}}}
 return null}
function breakTile(tx,ty,why){if(SIM)return false;const k=tileAt(tx,ty);if(k!==3&&k!==4)return false;G.L.T[tx][ty]=0;const x=tx*TS+TS/2,y=ty*TS+TS/2;
 burst(x,y,14,k===3?['#c8743a','#8a4a20','#e8a060']:['#9a9aa8','#6c6c7c','#d8d8e0'],260,0.7,5,1400);AU.fx('crack');shake(5);addScore(20,x,y,false);return true}
function addScore(n,x,y,show=true){G.score+=n;if(show)ftxt(x,y,'+'+n,'#fff6c0')}
function addGem(x,y){G.gems++;G.lvGems++;addScore(50,x,y,false);AU.fx('gem');burst(x,y,6,['#7aff7a','#d0ffd0','#30d050'],140,0.4,3,200);
 if(G.gems>=100){G.gems-=100;G.lives++;AU.fx('life');ftxt(x,y-20,'1UP!','#7aff7a',1)}}
function hurtPlayer(p,src){if(SIM){p.simHurt=1;return}if(p.inv>0||p.dead||G.won)return;if(window.__GOD){p.inv=0.3;return}p.hp--;p.inv=1.5;AU.fx('hurt');shake(8);flash('#ff3030',0.35);hitstop(0.06);
 const d=src?sgn(p.x-src):-p.face;p.vx=d*280;p.vy=-420;p.ram=0;p.pound=0;p.swing=null;p.atk=0;if(p.mode==='swim'){if(p.under)p.vy=-160;else p.air=true}
 if(p.hp<=0)killPlayer(p)}
function killPlayer(p,why){if(SIM){p.dead=1;return}if(p.dead)return;if(window.__GOD&&why!=='fall'){p.hp=p.maxhp;return}p.dead=1;p.hp=0;p.vx=0;p.vy=-600;AU.fx(why==='water'?'splash':'hurt');G.deadT=1.6;G.deaths++}
function startAttack(p,k){p.atk=k==='kick'?0.32:k==='bonk'?0.22:0.2;p.atkK=k;p.atkHit=new Set();AU.fx(k==='kick'?'kick':k==='bonk'?'bonk':'punch');if(k==='kick'&&!p.onG)p.vy=Math.min(p.vy,-120)}
function attackBox(p){const r=p.atkK==='kick'?56:p.atkK==='bonk'?54:40;if(p.mode==='ride')return{x:p.face>0?p.x+10:p.x-10-r-20,y:p.y-p.h-6,w:r+20,h:56};return{x:p.face>0?p.x:p.x-r,y:p.y-p.h+10,w:r,h:44}}
function ramBox(p){if(p.mode==='swim')return{x:p.face>0?p.x:p.x-84,y:p.y-p.h-14,w:84,h:p.h+16};if(p.ramDy<0)return{x:p.x-34,y:p.y-p.h-30,w:68,h:70};return{x:p.face>0?p.x:p.x-80,y:p.y-p.h,w:80,h:p.h-10}}
/* Peter Oct 31 11:11 PM: easy ring grab - ACTION anywhere near a ring grabs it, no aiming. Reach is measured from the head OR the body, any direction, ~1.7x the old head reach */
const HOOK_R=205;function nearHook(p){if(p.mode!=='ride'||p.swCd>0)return null;const hp=headPt(p),cy=p.y-p.h*0.55;let best=null,bd=HOOK_R;for(const h of G.L.hooks){if(h===p.relH&&G.t-p.relAt<0.6)continue;const ry=h.y+30;const d=Math.min(Math.hypot(h.x-hp.x,ry-hp.y),Math.hypot(h.x-p.x,ry-cy),Math.hypot(h.x-p.x,h.y-cy));if(d<bd){bd=d;best=h}}return best}
function tongueTarget(p){if(p.mode==='foot')return null;const hp=headPt(p);let best=null,bd=150;
 const test=(o,kind)=>{const dx=(o.x-hp.x)*p.face,dy=o.y-hp.y;if(dx<-20||dy>40)return;const d=Math.hypot(dx,dy);if(d<bd){bd=d;best={o,kind}}};
 for(const e of G.ents){if(e.dead)continue;if(e.k==='food')test(e,'food');else if(EDEF[e.k]&&EDEF[e.k].eat)test({x:e.x,y:e.y-e.h/2,e},'bug')}for(const s of G.L.stars)if(!s.got)test(s,'star');
 if(!best)for(const g of G.L.gems)if(!g.got&&g.y<p.y-p.h+10)test(g,'gem');return best}
function findLedge(p){if(p.onG||p.swing||p.ledge||p.lgCd>0||p.pound)return null;const dir=p.face,fx=p.x+dir*(p.w/2+6),tx=Math.floor(fx/TS);
 for(let ty=Math.floor((p.y-p.h-48)/TS);ty<=Math.floor((p.y-24)/TS);ty++){if(ty<1)continue;const k=tileAt(tx,ty);if(!solidK(k))continue;if(solidK(tileAt(tx,ty-1))||solidK(tileAt(tx,ty-2)))continue;
  const top=ty*TS;if(top<p.y-p.h-48||top>p.y-24)continue;if(solidK(tileAt(Math.floor((p.x)/TS),ty-1))||solidK(tileAt(Math.floor((p.x)/TS),ty-2)))return null;return{tx,ty,x:dir>0?tx*TS+p.w/2+4:(tx+1)*TS-p.w/2-4,y:top}}return null}
function startLedge(p,l){p.ledge={sx:p.x,sy:p.y,x:l.x,y:l.y,t:0};p.vx=p.vy=0;p.ram=0;p.pound=0;p.atk=0;AU.fx('grab');if(!SIM){dust(l.x,l.y,4);ftxt(l.x,l.y-p.h-14,'NECK GRAB!','#9ff0ff')}}
function doAction(p){const now=G.t;const dbl=now-p.lastTap<0.3;p.lastTap=now;
 if(p.swing)return;const hk=nearHook(p);if(hk){grabHook(p,hk);return}
 if(!p.onG){const lg=findLedge(p);if(lg){startLedge(p,lg);return}}
 const tt=tongueTarget(p);if(tt&&!dbl){p.tng=0.3;p.tngT=tt;AU.fx('tongue');return}
 if(!p.onG&&inp.D){startPound(p);return}
 if(inp.U){startRam(p,-1);return}
 if(dbl){startRam(p,0);return}
 if(hk){grabHook(p,hk);return}
 startAttack(p,'bonk')}
function startRam(p,dy){if(p.ramCd>0||p.mode==='foot')return;if(p.mode==='swim')dy=0;p.ram=dy<0?0.24:0.3;p.ramDy=dy;p.ramDx=dy<0?0:p.face;p.atk=0;AU.fx('ram');p.ramHit=new Set();
 if(p.mode==='swim'){p.vx=p.face*560;if(!SIM){bubbles(p.x-p.face*40,p.y-24,6);ftxt(p.x,p.y-p.h-60,'SHELL DASH!','#9ff0ff')}return}
 if(dy<0){p.vy=-780;p.vx*=0.4}else{p.vx=p.face*660;p.vy=Math.min(p.vy,0)}dust(p.x-p.face*20,p.y,5)}
function startPound(p){p.pound=1;p.vy=950;p.vx*=0.2;p.ram=0;AU.fx('swing')}
function grabHook(p,h){const dx=p.x-h.x,dy=(p.y-p.h*0.55)-h.y;const L=clamp(Math.hypot(dx,dy),70,120);const a=clamp(Math.atan2(dx,dy),-1.45,1.45);
 p.swing={h,L,a,av:clamp((p.vx*Math.cos(a)-p.vy*Math.sin(a))/L,-5,5),tw:0,fx:p.x,fy:p.y};p.ram=0;p.pound=0;p.atk=0;p.ledge=null;AU.fx('grab');p.vy=0}
function releaseSwing(p,jump){const s=p.swing;if(!s)return;p.relH=s.h;p.relAt=G.t;const tv=s.av*s.L;p.vx=clamp(Math.cos(s.a)*tv,-560,560);p.vy=clamp(-Math.sin(s.a)*tv,-700,600)-(jump?330:0);p.swing=null;p.swCd=0.3;if(jump)AU.fx('jump');if(Math.abs(p.vx)>20)p.face=sgn(p.vx)}
function updatePlayer(p,dt){const C=PH[p.mode];p.anim+=dt;p.inv=Math.max(0,p.inv-dt);p.ramCd=Math.max(0,p.ramCd-dt);p.swCd=Math.max(0,p.swCd-dt);p.squash=Math.max(0,p.squash-dt*4);
 if(p.dead){p.vy+=GRAV*dt;p.y+=p.vy*dt;return}
 p.lgCd=Math.max(0,p.lgCd-dt);
 if(p.ledge){const l=p.ledge;l.t+=dt;const k=Math.min(1,l.t/0.3),e=k<0.5?2*k*k:1-Math.pow(-2*k+2,2)/2;p.x=lerp(l.sx,l.x,e);p.y=lerp(l.sy,l.y,Math.min(1,e*1.3));if(k>=1){p.x=l.x;p.y=l.y;p.ledge=null;p.onG=true;p.vy=0;p.vx=p.face*60;p.lgCd=0.25;p.squash=0.4}return}
 if(G.cut){p.vx=0;if(p.mode==='swim')return;p.vy+=GRAV*dt;const py=p.y;p.y+=p.vy*dt;collideY(p,py);return}
 if(p.mode==='swim'){updateSwim(p,dt);return}
 if(inp.diveP&&!SIM)ftxt(p.x,p.y-p.h-30,'DIVE works while riding Pip!','#9ff0ff');
 /* swing */
 if(p.swing){const s=p.swing;let acc=-(GRAV/s.L)*Math.sin(s.a);const pump=(inp.R?1:0)-(inp.L?1:0);acc+=pump*4.2*Math.cos(s.a)*(Math.abs(s.a)<1.1?1:0.2);
  s.av+=acc*dt;s.av*=(1-0.12*dt);s.av=clamp(s.av,-6,6);s.a+=s.av*dt;s.a=clamp(s.a,-1.45,1.45);
  p.x=s.h.x+Math.sin(s.a)*s.L;p.y=s.h.y+Math.cos(s.a)*s.L+p.h*0.55;if(s.tw!==undefined&&s.tw<1){s.tw=Math.min(1,s.tw+dt/0.2);const e=1-Math.pow(1-s.tw,3);p.x=lerp(s.fx,p.x,e);p.y=lerp(s.fy,p.y,e)}if(Math.abs(s.av)>0.3)p.face=sgn(s.av*Math.cos(s.a));
  if(inp.jumpP||inp.actP&&G.t-p.lastTap>0.15){releaseSwing(p,inp.jumpP);p.lastTap=G.t}
  else if(!(s.tw<1)){const b=bx(p);if(solidAt(b)){releaseSwing(p,false);p.vx*=-0.3}}
  if(p.swing&&Math.random()<0.1&&Math.abs(s.av)>2)AU.fx('swing');return}
 /* horizontal */
 const want=(inp.R?1:0)-(inp.L?1:0);
 if(p.ram>0&&p.ramDy===0){p.ram-=dt;p.vx=p.ramDx*660;p.vy=0;if(Math.random()<0.6)dust(p.x-p.face*30,p.y,1);if(p.ram<=0){p.ramCd=0.22;p.vx=p.face*C.spd}}
 else{if(p.ram>0){p.ram-=dt;if(p.ram<=0)p.ramCd=0.2}
  const ctl=p.onG?1:0.75;if(want){const v0=p.vx;if(Math.abs(v0)>C.spd&&sgn(v0)===want)p.vx=sgn(v0)*Math.max(C.spd,Math.abs(v0)-(p.onG?1400:500)*dt);else{p.vx+=want*C.acc*ctl*dt;if(Math.abs(p.vx)>C.spd)p.vx=sgn(p.vx)*C.spd}if(p.atk<=0||p.mode==='ride')p.face=want}
  else{const f=(p.onG?2400:500)*dt;p.vx=Math.abs(p.vx)<=f?0:p.vx-sgn(p.vx)*f}}
 /* jump */
 p.coy=p.onG?0.1:p.coy-dt;p.jbuf=inp.jumpP?0.12:p.jbuf-dt;
 if(p.jbuf>0&&p.coy>0&&p.pound===0){p.vy=-C.jv;p.coy=0;p.jbuf=0;p.holdJ=1;AU.fx('jump');dust(p.x,p.y,5);p.squash=0.6}
 if(!inp.jump)p.holdJ=0;
 const rising=p.vy<0;let g=GRAV;if(p.holdJ&&rising)g*=C.hold;if(p.ram>0&&p.ramDy===0)g=0;if(p.pound)g=0;
 /* action */
 if(inp.actP)doAction(p);if(inp.ramP&&p.mode==='ride')startRam(p,inp.U?-1:0);
 if(p.atk>0)p.atk-=dt;if(p.tng>0){p.tng-=dt;if(p.tngT&&p.tng<0.18){const t=p.tngT;p.tngT=null;collectTongue(t)}}
 /* integrate */
 p.vy=Math.min(p.vy+g*dt,p.pound?950:1100);
 p.x+=p.vx*dt;const hx=collideX(p);if(hx!==null){if(p.ram>0&&p.ramDy===0){const b=bx(p),y0=Math.floor(b.y/TS),y1=Math.floor((b.y+b.h-2)/TS);let br=false;for(let ty=y0;ty<=y1;ty++)br=breakTile(hx,ty)||br;if(!br){p.ram=0;p.ramCd=0.25;shake(4);AU.fx('bonk');p.vx=-p.face*120}}else p.vx=0}
 const py=p.y;p.y+=p.vy*dt;const wasG=p.onG;const hy=collideY(p,py,inp.D&&!p.pound&&p.onG);
 if(hy&&hy.up){if(p.ram>0||p.vy<=0){let br=breakTile(hy.tx,hy.ty);const b=bx(p);for(let tx=Math.floor(b.x/TS);tx<=Math.floor((b.x+b.w)/TS);tx++)if(tx!==hy.tx)br=breakTile(tx,hy.ty)||br;if(br&&p.ram>0)p.vy=-300}}
 if(hy&&!hy.up&&p.pound){let br=false;const b=bx(p);for(let tx=Math.floor((b.x+2)/TS);tx<=Math.floor((b.x+b.w-2)/TS);tx++)br=breakTile(tx,hy.ty)||br;
  if(br){p.onG=false;p.vy=600}else{p.pound=0;shake(10);AU.fx('pound');ring(p.x,p.y,'rgba(255,240,200,.9)',90,0.35,6);dust(p.x,p.y,12);poundWave(p)}}
 if(p.onG&&!wasG&&py<p.y+1){p.squash=0.5;if(p.vy===0&&!p.pound)AU.fx('land')}
 if(p.onG)p.pound=0;
 if(!p.onG&&!p.dead&&(inp.U||(want===p.face&&p.vy>-60))){const lg=findLedge(p);if(lg)startLedge(p,lg)}
 /* hazards */
 const b=bx(p);for(let tx=Math.floor(b.x/TS);tx<=Math.floor((b.x+b.w)/TS);tx++)for(let ty=Math.floor(b.y/TS);ty<=Math.floor((b.y+b.h-1)/TS);ty++){const k=tileAt(tx,ty);
  if(k===5&&p.y>ty*TS+14)hurtPlayer(p,tx*TS+TS/2);if(k===6&&p.y>ty*TS+8&&!p.dead){mountPip(p);return}}
 if(p.onG&&!p.ledge&&!SIM&&rfOk(p.x,Math.floor((p.y+1)/TS),p.w+TS))p.rfSafe={x:p.x,y:p.y};
 if(p.y>LVH+120){if(p.inv>0&&!p.dead&&!SIM){rfRestore(p);return}killPlayer(p,'fall')}
 if(G.arena){const a=G.arena;if(p.x<a.x0+p.w/2){p.x=a.x0+p.w/2;p.vx=Math.max(0,p.vx)}if(p.x>a.x1-p.w/2){p.x=a.x1-p.w/2;p.vx=Math.min(0,p.vx)}}
 if(p.x<p.w/2)p.x=p.w/2}
function solidAt(b){for(let tx=Math.floor(b.x/TS);tx<=Math.floor((b.x+b.w)/TS);tx++)for(let ty=Math.floor(b.y/TS);ty<=Math.floor((b.y+b.h)/TS);ty++)if(solidK(tileAt(tx,ty)))return true;return false}
function splash(x,y){if(SIM)return;burst(x,y,18,['#9ad8ff','#e0f6ff','#4aa8ff'],320,0.7,4,1200);ring(x,y,'rgba(200,240,255,.8)',50,0.4,4)}
function collectTongue(t){const o=t.o;if(t.kind==='food'){o.dead=1;const p=G.p;if(p.hp<p.maxhp){p.hp++;AU.fx('heart');ftxt(o.x,o.y,'+1 HEART','#ff8aa0')}else{addScore(200,o.x,o.y);AU.fx('slurp')}burst(o.x,o.y,8,['#7ad04a','#c0f080'],160,0.5,3,300)}
 else if(t.kind==='bug'){if(!o.e.dead){hitEnemy(o.e,'yum');AU.fx('slurp')}}
 else if(t.kind==='star')getStar(o);else if(t.kind==='gem'){o.got=1;addGem(o.x,o.y)}}
function getStar(s){if(s.got)return;s.got=1;G.lvStars[s.id]=1;addScore(1000,s.x,s.y);AU.fx('star');stars(s.x,s.y,14);ftxt(s.x,s.y-20,'GOLD STAR!','#ffe060',1)}

/* ===== riding Pip: swim on the surface, DIVE under, SHELL DASH ===== */
function bubbles(x,y,n=3){for(let i=0;i<n;i++)P({x:x+rand(-10,10),y:y+rand(-8,8),vx:rand(-20,20),vy:-rand(40,110),l:rand(0.6,1.2),m:1.2,s:rand(2.5,5.5),c:'rgba(225,250,255,.85)',g:-60,bub:1})}
function mountPip(p){if(p.mode==='swim')return;const tx=Math.floor(p.x/TS);const sy=waterTop(tx);if(sy===null)return;
 setMode(p,'swim');p.sy=sy;p.y=sy+SWF;p.vy=0;p.vx*=0.6;p.under=false;p.air=false;p.ram=0;p.pound=0;p.swing=null;p.ledge=null;p.atk=0;p.onG=false;
 if(!SIM){splash(p.x,sy);AU.fx('splash');if(!G.metPip){G.metPip=1;ftxt(p.x,p.y-150,'HOP ON, PIP!','#7affc0',1)}if(G.pip){G.pip.x=p.x;G.pip.y=p.y}}}
function dismountPip(p){setMode(p,'ride');p.under=false;p.air=false;p.squash=0.4;if(!SIM){dust(p.x,p.y,6);if(G.pip){G.pip.x=p.x-p.face*30;G.pip.y=(p.sy||p.y)+SWF;G.pip.hop=0}}}
function updateSwim(p,dt){const C=PH.swim;const tx=Math.floor(p.x/TS);let sy=waterTop(tx);if(sy===null)sy=p.sy!==undefined?p.sy:p.y-SWF;p.sy=sy;
 const want=(inp.R?1:0)-(inp.L?1:0);
 if(p.ram>0){p.ram-=dt;p.vx=p.ramDx*560;if(p.under)p.vy*=0.85;if(Math.random()<0.5&&!SIM)bubbles(p.x-p.face*44,p.y-20,1);if(p.ram<=0){p.ramCd=0.25;p.vx=p.face*C.spd}}
 else{const spd=p.under?C.spd*0.92:C.spd;if(want){p.vx+=want*C.acc*dt;if(Math.abs(p.vx)>spd)p.vx=sgn(p.vx)*spd;p.face=want}else{const f=(p.air?300:900)*dt;p.vx=Math.abs(p.vx)<=f?0:p.vx-sgn(p.vx)*f}}
 if(inp.actP){const tt=tongueTarget(p);if(tt&&p.ram<=0){p.tng=0.3;p.tngT=tt;AU.fx('tongue')}else startRam(p,0)}
 if(inp.ramP)startRam(p,0);
 if(p.tng>0){p.tng-=dt;if(p.tngT&&p.tng<0.18){const t=p.tngT;p.tngT=null;collectTongue(t)}}
 const floatY=sy+SWF,row=Math.floor(sy/TS);
 if(p.under){const tv=((inp.D?1:0)-(inp.U?1:0))*200;p.vy+=((tv||-28)-p.vy)*Math.min(1,dt*4);
  if(inp.jumpP)p.vy=-320;if(inp.diveP){p.vy=300;if(!SIM)bubbles(p.x,p.y-30,4)}
  if(p.y<=floatY+1&&p.vy<0){const clear=[p.x-p.w/2+4,p.x,p.x+p.w/2-4].every(x=>{const t=Math.floor(x/TS),w=waterTop(t);return w!==null&&!solidK(tileAt(t,Math.floor(w/TS)-1))});
   if(clear){p.under=false;p.y=floatY;p.vy=0;if(!SIM){splash(p.x,sy);AU.fx('splash')}}else{p.y=floatY+1;p.vy=Math.max(0,p.vy)}}
  if(!SIM&&Math.random()<dt*5)bubbles(p.x+p.face*30,p.y-p.h-40,1)}
 else if(p.air){p.vy=Math.min(p.vy+GRAV*(inp.jump&&p.vy<0?0.6:1)*dt,1000);if(p.vy>0&&p.y>=floatY&&waterTop(tx)!==null){p.air=false;p.y=floatY;p.vy=0;if(!SIM){splash(p.x,sy);AU.fx('splash')}}}
 else{p.y+=(floatY+Math.sin(G.t*3.2)*2-p.y)*Math.min(1,dt*10);p.vy=0;
  if(inp.jumpP){p.vy=-C.jv;p.air=true;AU.fx('jump');if(!SIM)splash(p.x,sy)}
  else if(inp.diveP){const below=tileAt(tx,row+1);if(below===6||below===0){p.under=true;p.vy=320;AU.fx('swing');if(!SIM){bubbles(p.x,p.y-20,10);ftxt(p.x,p.y-p.h-60,'DIVE!','#9ff0ff')}}}}
 /* integrate */
 p.x+=p.vx*dt;const hx=collideX(p);
 if(hx!==null){if(p.ram>0){const b=bx(p),y0=Math.floor(b.y/TS),y1=Math.floor((b.y+b.h-2)/TS);let br=false;for(let ty=y0;ty<=y1;ty++)br=breakTile(hx,ty)||br;if(!br){p.ram=0;p.ramCd=0.25;shake(4);AU.fx('bonk');p.vx=-p.face*120}}
  else{/* shore: pushing into land at the surface hops you out */if(!p.under&&!p.air&&want&&!solidK(tileAt(hx,row-2))&&!solidK(tileAt(hx,row-3))){p.vy=-600;p.air=true;AU.fx('jump');if(!SIM)splash(p.x,sy)}p.vx=0}}
 if(p.under||p.air){const py=p.y;p.y+=p.vy*dt;const hy=collideY(p,py,false);
  if(hy&&hy.up&&p.ram>0)breakTile(hy.tx,hy.ty);
  if(hy&&!hy.up&&p.air&&!inWater(p.x,p.y-4)){dismountPip(p);return}}
 if(!p.air&&!p.under&&waterTop(tx)===null){p.air=true;p.vy=Math.min(p.vy,0)}
 if(p.air&&p.y>LVH+120){if(p.inv>0&&!SIM){setMode(p,'ride');rfRestore(p);return}killPlayer(p,'fall')}
 if(G.arena){const a=G.arena;if(p.x<a.x0+p.w/2){p.x=a.x0+p.w/2;p.vx=Math.max(0,p.vx)}if(p.x>a.x1-p.w/2){p.x=a.x1-p.w/2;p.vx=Math.min(0,p.vx)}}
 if(p.x<p.w/2)p.x=p.w/2}

/* ===== enemies, items, projectiles ===== */
const EDEF={crab:{w:40,h:28,spd:50,pts:100,eat:1},gull:{w:56,h:42,spd:90,pts:150,fly:1},urchin:{w:40,h:32,spd:18,pts:150,spiky:1},hermit:{w:44,h:40,spd:0,pts:200},jelly:{w:34,h:34,spd:0,pts:150,fly:1,spiky:1},coco:{w:46,h:52,spd:0,pts:150},fish:{w:44,h:30,spd:85,pts:120,swim:1},puff:{w:40,h:34,spd:0,pts:180,swim:1}};
function spawnEnts(){G.ents=[];for(const e of G.L.ents){const o=Object.assign({},e);if(o.k==='food'){o.t=Math.random()*6;G.ents.push(o);continue}
 const d=EDEF[o.k];Object.assign(o,{w:d.w,h:d.h,vx:-d.spd,vy:0,face:-1,hp:1,t:Math.random()*3,st:'walk',x0:o.x,y0:o.y,cd:1+Math.random(),onG:false});if(o.k==='hermit')o.st='curl';if(o.k==='jelly'&&o.bob){o.y0=o.y+10}if(o.k==='fish'||o.k==='puff'){o.y0=o.y+TS*0.5;o.y=o.y0}G.ents.push(o)}}
function enemyActive(e){return Math.abs(e.x-G.p.x)<viewW*0.75+200}
function updEnemies(dt){const p=G.p;
 for(const e of G.ents){if(e.dead){if(e.dying){e.dying-=dt;e.vy+=GRAV*dt;e.x+=e.vx*dt;e.y+=e.vy*dt;e.rot=(e.rot||0)+dt*8}continue}
  if(e.k==='food'){e.t+=dt;if(!p.dead&&ovr(bx({x:e.x,y:e.y+18,w:34,h:36}),bx(p))){G.p.tngT={o:e,kind:'food'};collectTongue(G.p.tngT);G.p.tngT=null}continue}
  if(!enemyActive(e))continue;e.t+=dt;e.stun=Math.max(0,(e.stun||0)-dt);
  if(e.k==='crab'||e.k==='urchin'){if(e.stun>0){e.vx=0}else if(Math.abs(e.vx)<1)e.vx=-EDEF[e.k].spd*(e.face||-1)*-1;
   e.vy+=GRAV*dt;e.x+=e.vx*dt;const hx=collideX(e);if(hx!==null){e.vx=-e.vx}const py=e.y;e.y+=e.vy*dt;collideY(e,py);
   if(e.onG){const ahead=e.x+sgn(e.vx)*(e.w/2+4);const tx=Math.floor(ahead/TS),ty=Math.floor((e.y+4)/TS);const k=tileAt(tx,ty);if(!(solidK(k)||k===2))e.vx=-e.vx}
   if(e.vx)e.face=sgn(e.vx);if(e.y>LVH+80)e.dead=1}
  else if(e.k==='jelly'){e.x=e.x0+Math.sin(e.t*0.7)*40;e.y=e.y0+Math.sin(e.t*2.4)*10;e.face=Math.cos(e.t*0.7)>0?1:-1}
  else if(e.k==='fish'){const r=(e.rng||3)*TS;e.x=e.x0+Math.sin(e.t*0.8)*r;e.y=e.y0+Math.sin(e.t*2.1)*8;e.face=Math.cos(e.t*0.8)>0?1:-1;e.vx=Math.cos(e.t*0.8)*r*0.8}
  else if(e.k==='puff'){e.y=e.y0+Math.sin(e.t*1.6)*10;e.face=sgn(p.x-e.x);const ph=(e.t%3.4);const pf=ph>2.0&&ph<3.2;if(pf!==!!e.puffed){e.puffed=pf;if(pf)AU.fx('pound')}e.w=e.puffed?62:40;e.h=e.puffed?56:34}
  else if(e.k==='gull'){if(!e.st||e.st==='walk')e.st='fly';
   if(e.st==='fly'){e.x=e.x0+Math.sin(e.t*0.9)*120;e.y=e.y0+Math.sin(e.t*2.2)*14;e.face=Math.cos(e.t*0.9)>0?1:-1;e.cd-=dt;
    if(e.cd<=0&&Math.abs(p.x-e.x)<240&&p.y>e.y+40&&!p.dead){e.st='dive';e.tx=p.x;e.ty=p.y-30;e.face=sgn(p.x-e.x);AU.fx('throw')}}
   else if(e.st==='dive'){const dx=e.tx-e.x,dy=e.ty-e.y,d=Math.hypot(dx,dy);if(d<12){e.st='rise'}else{e.x+=dx/d*360*dt;e.y+=dy/d*360*dt}}
   else{const y=e.y0;e.y-=200*dt;if(e.y<=y){e.y=y;e.st='fly';e.cd=2.4;e.x0=e.x-Math.sin(e.t*0.9)*120}}}
  else if(e.k==='coco'){e.face=sgn(p.x-e.x);e.cd-=dt;if(e.cd<=0&&Math.abs(p.x-e.x)<460&&!p.dead){e.cd=2.3;e.thr=0.35;const tx=p.x+p.vx*0.5,dx=tx-e.x;const T=0.9;G.shots.push({k:'coconut',x:e.x,y:e.y-40,vx:dx/T,vy:-(GRAV*0.5*T)+(p.y-30-(e.y-40))/T,r:14,g:1,rot:0});AU.fx('throw')}e.thr=Math.max(0,(e.thr||0)-dt)}
  else if(e.k==='hermit'){if(e.st==='curl'){e.vy+=GRAV*dt;const py=e.y;e.y+=e.vy*dt;collideY(e,py);if(Math.abs(p.x-e.x)<380&&!p.dead&&e.stun<=0){e.st='roll';e.vx=sgn(p.x-e.x)*290;AU.fx('ram')}}
   else{e.vy+=GRAV*dt;e.x+=e.vx*dt;if(collideX(e)!==null){e.vx=-e.vx;shake(2)}const py=e.y;e.y+=e.vy*dt;collideY(e,py);e.rot=(e.rot||0)+e.vx*dt/20;if(e.stun>0){e.vx*=0.9;if(e.stun<0.1)e.st='curl'}
    if(e.y>LVH+80)e.dead=1;if(Math.abs(p.x-e.x)>700){e.st='curl';e.vx=0}}}
  /* player interactions */
  if(p.dead)continue;const eb=bx(e),pb=bx(p);
  if(p.ram>0&&ovr(ramBox(p),eb)){hitEnemy(e,'ram');continue}
  if(p.atk>0&&!p.atkHit.has(e)&&ovr(attackBox(p),eb)){p.atkHit.add(e);if(e.k==='hermit'&&e.st==='roll'&&p.atkK==='punch'){e.vx=-e.vx;e.stun=0.6;AU.fx('bonk');continue}hitEnemy(e,p.atkK);continue}
  if(ovr(pb,eb)){const fromTop=p.vy>60&&p.y-eb.y<26;
   if(fromTop&&!(EDEF[e.k].spiky)&&!(e.k==='puff'&&e.puffed)){if(e.k==='hermit'&&e.st==='roll'){e.stun=1.6;e.vx*=0.3;bounce(p);AU.fx('bonk');continue}hitEnemy(e,'stomp');bounce(p);continue}
   if(p.pound&&fromTop){hitEnemy(e,'pound');continue}
   if(p.swing&&!EDEF[e.k].spiky){hitEnemy(e,'kick');continue}
   if(e.k==='hermit'&&e.st!=='roll'){p.x+=sgn(p.x-e.x)*3;continue}
   hurtPlayer(p,e.x)}}
 G.ents=G.ents.filter(e=>!e.dead||e.dying>0||e.k==='food'&&!e.dead)}
function bounce(p){p.vy=inp.jump?-720:-480;p.holdJ=inp.jump?1:0;p.pound=0;p.squash=0.5}
function hitEnemy(e,how){e.dead=1;e.dying=1.2;e.vy=-520;e.vx=sgn(e.x-G.p.x)*220;const pts=EDEF[e.k].pts*(G.combo>0?2:1);G.combo=1.2;addScore(pts,e.x,e.y-e.h);AU.fx('kill');hitstop(0.04);
 stars(e.x,e.y-e.h/2,8);ring(e.x,e.y-e.h/2,'rgba(255,255,255,.8)',36,0.25,4);const words={ram:G.p&&G.p.mode==='swim'?'SHELL DASH!':'RAM!',stomp:'STOMP!',kick:'KICK!',punch:'POW!',bonk:'BONK!',pound:'POUND!',yum:'YUM!'};ftxt(e.x,e.y-e.h-22,words[how]||'POW!','#ffe060');shake(3)}
function poundWave(p){for(const e of G.ents){if(e.dead||e.k==='food')continue;if(Math.abs(e.x-p.x)<120&&Math.abs(e.y-p.y)<50)hitEnemy(e,'pound')}if(G.boss)bossPound(p)}
function updShots(dt){const p=G.p;for(const s of G.shots){s.t=(s.t||0)+dt;
  if(s.k==='wave'){s.x+=s.vx*dt;s.l-=dt;if(s.l<=0)s.dead=1;const tx=Math.floor((s.x+sgn(s.vx)*14)/TS),ty=Math.floor((s.y+4)/TS);if(!solidK(tileAt(tx,ty))&&tileAt(tx,ty)!==2)s.dead=1;
   if(!p.dead&&Math.abs(p.x-s.x)<22+p.w/2&&p.y>s.y-30&&p.y<=s.y+4&&!p.swing)hurtPlayer(p,s.x);if(Math.random()<0.5)dust(s.x,s.y,1,'rgba(255,220,160,.8)');continue}
  if(s.g)s.vy+=GRAV*0.5*dt*(s.k==='feather'?0:1);s.x+=s.vx*dt;s.y+=s.vy*dt;s.rot=(s.rot||0)+dt*(s.k==='bone'?12:6);
  if(s.y>LVH+60||s.t>6)s.dead=1;const tx=Math.floor(s.x/TS),ty=Math.floor(s.y/TS);if(solidK(tileAt(tx,ty))&&s.k!=='feather'){s.dead=1;burst(s.x,s.y,6,s.k==='bone'?['#2a2a30','#6a6a74']:s.k==='ink'?['#3a1a5a','#6a3a9a']:['#7a4a22','#a87040'],140,0.4,3);continue}
  if(p.dead)continue;
  if(p.ram>0||p.atk>0&&p.mode==='ride'){const rb=p.ram>0?ramBox(p):attackBox(p);if(ovr(rb,{x:s.x-s.r,y:s.y-s.r,w:s.r*2,h:s.r*2})){s.dead=1;stars(s.x,s.y,5);addScore(30,s.x,s.y);AU.fx('bonk');continue}}
  if(ovr(bx(p),{x:s.x-s.r*0.8,y:s.y-s.r*0.8,w:s.r*1.6,h:s.r*1.6})){s.dead=1;hurtPlayer(p,s.x)}}
 G.shots=G.shots.filter(s=>!s.dead)}
function updItems(dt){const p=G.p;if(p.dead)return;const pb=bx(p);const pad=p.mode==='ride'?10:4;const big={x:pb.x-pad,y:pb.y-pad,w:pb.w+pad*2,h:pb.h+pad*2};
 for(const g of G.L.gems){if(g.got)continue;if(Math.abs(g.x-p.x)>90)continue;if(ovr(big,{x:g.x-12,y:g.y-12,w:24,h:24})){g.got=1;addGem(g.x,g.y)}}
 for(const s of G.L.stars){if(s.got)continue;if(ovr(big,{x:s.x-16,y:s.y-16,w:32,h:32}))getStar(s)}
 for(const cp of G.L.cps){if(!cp.on&&p.x>cp.x-10){cp.on=true;G.cp=cp;AU.fx('cp');ftxt(cp.x,cp.y-110,'CHECKPOINT!','#7aff7a',1);burst(cp.x,cp.y-90,12,['#ff5050','#ffe060','#fff'],200,0.6,3)}}
 G.sign=null;for(const s of G.L.signs){if(Math.abs(p.x-s.x)<120){G.sign=s;s.seen=1}}
 if(G.L.goal&&!G.won&&p.x>G.L.goal.x-20)levelClear();
 if(G.L.cage&&!G.L.cage.open){const cg=G.L.cage,cb={x:cg.x-50,y:cg.y-100,w:100,h:100};if(p.atk>0&&!p.atkHit.has(cg)&&ovr(attackBox(p),cb)){p.atkHit.add(cg);cg.hp--;cg.sh=0.3;AU.fx('crack');shake(5);burst(cg.x,cg.y-50,10,['#c8a060','#8a6a30'],220,0.6,4,1200);if(cg.hp<=0)openCage()}
  if(p.x>cb.x-p.w/2+6){p.x=cb.x-p.w/2+6;p.vx=Math.min(0,p.vx)}}}

/* ===== bosses ===== */
const BSZ={tusk:{w:96,h:150,sc:1},croc:{w:120,h:120,sc:1},bab:{w:100,h:130,sc:1},vex:{w:100,h:110,sc:1},cak:{w:100,h:165,sc:1}};
function startBoss(){const A=G.L.boss,D=BOSSES[A.i],z=BSZ[D.k];G.arena={x0:A.x0,x1:A.x1};
 const b=G.boss={i:A.i,k:D.k,name:D.name,hp:D.hp,max:D.hp,x:A.x1-160,y:A.y,vx:0,vy:0,w:z.w,h:z.h,face:-1,st:'intro',t:0,inv:0,flash:0,ph:1,n:0,gy:A.y,onG:true};
 if(b.k==='vex'){b.y=A.y-200;b.onG=false}if(b.k==='bab'){b.perch=1;b.x=A.x0+21.5*TS;b.y=A.y-4*TS}
 AU.music('boss');AU.fx(b.k==='cak'?'laugh':'roar');G.bossIntro=2.2;shake(6)}
function bossOpen(b){return b.st==='dizzy'}
function damageBoss(b,n,how){if(b.inv>0||b.st==='intro'||b.st==='dead'||b.st==='dive'&&b.k==='croc'&&b.sub)return false;const dz=bossOpen(b);const dmg=dz?n+1:n;b.hp-=dmg;b.inv=0.7;b.flash=0.2;AU.fx('hit');shake(9);hitstop(0.08);
 stars(b.x,b.y-b.h*0.7,12);ftxt(b.x,b.y-b.h-24,dz?'CRITICAL!':(how==='stomp'?'STOMP!':'HIT!'),dz?'#ff9a40':'#ffe060',1);addScore(dz?500:250,b.x,b.y-b.h);
 if(b.k==='cak'&&b.ph===1&&b.hp<=b.max/2){b.ph=2;b.st='rage';b.t=0;AU.fx('roar');flash('#ff4020',0.4);ftxt(b.x,b.y-b.h-50,'CAPTAIN CRAB IS FURIOUS!','#ff6040',1)}
 if(b.hp<=0){b.hp=0;b.st='dead';b.t=0;G.shots.length=0;for(const e of G.ents)if(!e.dead&&e.k!=='food')hitEnemy(e,'pound');AU.fx('roar');shake(16);flash('#fff',0.7);G.slow=1.2}
 else if(!dz&&(b.k==='tusk'||b.k==='cak')&&how!=='stomp'){/* knock back a bit */b.x+=sgn(b.x-G.p.x)*30}
 return true}
function bossPound(p){const b=G.boss;if(!b)return;if(Math.abs(b.x-p.x)<130&&Math.abs(b.y-p.y)<60&&b.st==='dizzy')damageBoss(b,1,'pound')}
function wave(x,y,dir,spd=330){G.shots.push({k:'wave',x,y,vx:dir*spd,l:2.6,r:16})}
function lob(k,x,y,tx,ty,T,r=14){G.shots.push({k,x,y,vx:(tx-x)/T,vy:-(GRAV*0.5*T)+(ty-y)/T,r,g:1})}
function bossGround(b,dt){b.vy+=GRAV*dt;b.y+=b.vy*dt;if(b.y>=b.gy){if(b.vy>300){shake(8);dust(b.x,b.y,10)}b.y=b.gy;const land=b.vy>300;b.vy=0;b.onG=true;return land}b.onG=false;return false}
function updBoss(dt){const b=G.boss,p=G.p,A=G.arena;if(!b)return;b.t+=dt;b.inv=Math.max(0,b.inv-dt);b.flash=Math.max(0,b.flash-dt);const ph2=b.hp<=b.max/2;const dirP=sgn(p.x-b.x);
 if(b.st==='intro'){if(b.k!=='vex'&&b.k!=='bab')bossGround(b,dt);if(b.t>1.6){b.st='idle';b.t=0}return}
 if(b.st==='dead'){b.vy+=GRAV*0.4*dt;if(b.k==='vex'){b.y=Math.min(b.gy,b.y+200*dt)}else bossGround(b,dt);if(b.t>0.3&&Math.random()<0.3)stars(b.x+rand(-40,40),b.y-rand(20,b.h),3);if(b.t>2.2&&!G.won)bossBeaten();return}
 if(b.st==='dizzy'){if(b.k==='vex'){b.y=Math.min(b.gy,b.y+400*dt)}else bossGround(b,dt);if(b.t>(b.dz||1.6)){b.st=b.k==='vex'?'rise':(b.k==='bab'?'climb':'idle');b.t=0;b.n=0}}
 else if(b.k==='tusk'){
  if(b.st==='idle'){bossGround(b,dt);b.face=dirP;if(b.t>(ph2?0.7:1.1)){b.n++;if(b.n%3===0){b.st='hop';b.t=0;b.vy=-780;AU.fx('roar')}else{b.st='wind';b.t=0}}}
  else if(b.st==='wind'){b.x+=Math.sin(b.t*60)*1.5;if(b.t>0.45){b.st='charge';b.t=0;b.vx=b.face*(ph2?520:430);AU.fx('ram')}}
  else if(b.st==='charge'){bossGround(b,dt);b.x+=b.vx*dt;if(Math.random()<0.5)dust(b.x-b.face*40,b.y,1);if(b.x<A.x0+b.w/2||b.x>A.x1-b.w/2){b.x=clamp(b.x,A.x0+b.w/2,A.x1-b.w/2);b.st='dizzy';b.t=0;b.dz=ph2?1.4:1.8;shake(12);AU.fx('crack');stars(b.x+b.face*40,b.y-b.h*0.8,10)}}
  else if(b.st==='hop'){const land=bossGround(b,dt);if(land){wave(b.x-40,b.y,-1);wave(b.x+40,b.y,1);if(ph2){b.st='hop2';b.t=0;b.vy=-600}else{b.st='idle';b.t=0}AU.fx('pound')}}
  else if(b.st==='hop2'){const land=bossGround(b,dt);if(land){wave(b.x-40,b.y,-1,420);wave(b.x+40,b.y,1,420);b.st='idle';b.t=0;AU.fx('pound')}}}
 else if(b.k==='croc'){const pool={x0:A.x0+10*TS,x1:A.x0+17*TS};
  if(b.st==='idle'){bossGround(b,dt);b.face=dirP;b.x+=b.face*70*dt;if(b.x>pool.x0-50&&b.x<pool.x1+50)b.x-=b.face*140*dt;
   if(Math.abs(p.x-b.x)<170&&b.t>0.5){b.st='bite';b.t=0;AU.fx('roar')}else if(b.t>2.4){b.st='dive';b.t=0;b.sub=0;b.tx=(pool.x0+pool.x1)/2}}
  else if(b.st==='bite'){if(b.t<0.35){b.x-=b.face*30*dt}else if(b.t<0.7){b.x+=b.face*520*dt}else{b.st='idle';b.t=0;b.n++;if(b.n%2===0){b.st='dizzy';b.t=0;b.dz=1.2}}
   if((b.x<pool.x1&&b.x>pool.x0)){b.x=b.face>0?pool.x0-1:pool.x1+1}b.x=clamp(b.x,A.x0+50,A.x1-50)}
  else if(b.st==='dive'){if(!b.sub){const d=b.tx-b.x;b.face=sgn(d);b.x+=sgn(d)*Math.min(Math.abs(d),300*dt);b.y=b.gy-Math.abs(Math.sin(b.t*8))*10;if(Math.abs(d)<4){b.sub=1;b.t=0;splash(b.x,b.gy+20);AU.fx('splash')}}
   else{b.y=b.gy+90;b.x=b.tx+Math.sin(b.t*3)*60;if(b.t>1.3){b.st='leap';b.t=0;b.sub=0;const T=1.0;b.vx=(clamp(p.x,A.x0+60,A.x1-60)-b.x)/T;b.vy=-GRAV*0.5*T-90/T;b.y=b.gy+20;splash(b.x,b.gy+20);AU.fx('splash');b.face=sgn(b.vx)}}}
  else if(b.st==='leap'){b.x+=b.vx*dt;b.vy+=GRAV*dt;b.y+=b.vy*dt;const inPool=b.x>pool.x0&&b.x<pool.x1;if(b.vy>0&&b.y>=b.gy&&!inPool){b.y=b.gy;b.vy=0;shake(10);wave(b.x-40,b.y,-1);wave(b.x+40,b.y,1);b.st='dizzy';b.t=0;b.dz=ph2?1.3:1.7;AU.fx('pound')}
   else if(b.vy>0&&b.y>b.gy+30&&inPool){b.st='dive';b.sub=1;b.t=0.4;b.tx=b.x;splash(b.x,b.gy+20)}}}
 else if(b.k==='bab'){const perchX=[A.x0+4.5*TS,A.x0+21.5*TS],perchY=b.gy-4*TS;
  if(b.st==='idle'){if(b.perch){b.y=perchY;b.face=dirP;if(b.t>0.6){b.st='throw';b.t=0;b.n=0}}else{bossGround(b,dt);if(b.t>0.4){b.st='climb';b.t=0}}}
  else if(b.st==='throw'){b.face=dirP;if(b.t>(ph2?0.55:0.8)){b.t=0;b.n++;b.thr=0.3;const T=0.95;lob('ink',b.x+b.face*30,b.y-140,p.x+p.vx*0.4,p.y-20,T,16);if(ph2){lob('ink',b.x+b.face*30,b.y-140,p.x-90,p.y-20,T,16);lob('ink',b.x+b.face*30,b.y-140,p.x+90,p.y-20,T,16)}AU.fx('throw');
    if(b.n>=(ph2?4:3)){b.st='leapdown';b.t=0;b.perch=0;const T2=0.8;b.vx=(clamp(p.x,A.x0+80,A.x1-80)-b.x)/T2;b.vy=-400;AU.fx('roar')}}b.thr=Math.max(0,(b.thr||0)-dt)}
  else if(b.st==='leapdown'){b.x+=b.vx*dt;const land=bossGround(b,dt);if(land){wave(b.x-40,b.y,-1);wave(b.x+40,b.y,1);b.st='dizzy';b.t=0;b.dz=ph2?1.5:1.9;AU.fx('pound')}}
  else if(b.st==='climb'){if(!b.cl){b.cl=1;b.tp=Math.abs(b.x-perchX[0])>Math.abs(b.x-perchX[1])?0:1;b.tp=1-b.tp;const tx=perchX[b.tp],T=0.9;b.vx=(tx-b.x)/T;b.vy=-(GRAV*0.5*T)+(perchY-b.y)/T;b.face=sgn(b.vx)}
   b.x+=b.vx*dt;b.vy+=GRAV*dt;b.y+=b.vy*dt;if(b.vy>0&&b.y>=perchY){b.y=perchY;b.vy=0;b.perch=1;b.cl=0;b.st='idle';b.t=0;b.x=perchX[b.tp]}}}
 else if(b.k==='vex'){const hy=b.gy-210;
  if(b.st==='idle'||b.st==='rise'){if(b.st==='rise'){b.y-=260*dt;if(b.y<=hy){b.y=hy;b.st='idle';b.t=0}}else{b.y=hy+Math.sin(b.t*2)*16}
   b.x+=Math.cos(b.t*0.8)*160*dt;b.x=clamp(b.x,A.x0+80,A.x1-80);b.face=dirP;
   if(b.st==='idle'){b.cd=(b.cd||1.2)-dt;if(b.cd<=0){b.cd=ph2?1.0:1.4;b.n++;for(let i=-1;i<=1;i++){const a=Math.atan2(p.y-40-b.y,p.x-b.x)+i*0.28;G.shots.push({k:'feather',x:b.x,y:b.y-40,vx:Math.cos(a)*300,vy:Math.sin(a)*300,r:10,g:0,rot:a})}AU.fx('throw');
    if(b.n>=(ph2?2:3)){b.st='tele';b.t=0;b.n=0;AU.fx('roar')}}}}
  else if(b.st==='tele'){b.y-=30*dt;b.face=dirP;if(b.t>0.6){b.st='dive';b.t=0;b.tx=p.x;b.ty=b.gy;const dx=b.tx-b.x,dy=b.ty-b.y,d=Math.hypot(dx,dy);b.vx=dx/d*640;b.vy=dy/d*640}}
  else if(b.st==='dive'){b.x+=b.vx*dt;b.y+=b.vy*dt;b.x=clamp(b.x,A.x0+60,A.x1-60);if(b.y>=b.gy){b.y=b.gy;shake(12);dust(b.x,b.y,14,'rgba(255,255,255,.9)');wave(b.x-40,b.y,-1,300);wave(b.x+40,b.y,1,300);b.st='dizzy';b.t=0;b.dz=ph2?1.6:2.0;AU.fx('pound')}}}
 else if(b.k==='cak'){
  if(b.st==='rage'){bossGround(b,dt);b.x+=Math.sin(b.t*50)*2;if(b.t>1.2){b.st='idle';b.t=0}}
  else if(b.st==='idle'){bossGround(b,dt);b.face=dirP;if(b.t>(ph2?0.5:0.8)){b.n++;const m=b.n%4;b.st=m===1?'throw':m===2?'leap':m===3?(G.ents.filter(e=>!e.dead&&e.k==='crab').length<3?'summon':'throw'):'leap';b.t=0;b.c=0}}
  else if(b.st==='throw'){bossGround(b,dt);b.face=dirP;if(b.t>0.35){b.t=0;b.c++;b.thr=0.3;const sp=ph2?[-120,0,120]:[0];for(const o of sp)lob('bone',b.x+b.face*30,b.y-120,p.x+o+p.vx*0.3,p.y-20,0.85,14);AU.fx('throw');if(b.c>=(ph2?3:2)){b.st='idle';b.t=0}}b.thr=Math.max(0,(b.thr||0)-dt)}
  else if(b.st==='summon'){bossGround(b,dt);if(b.t>0.6&&!b.sm){b.sm=1;AU.fx('laugh');for(const sx of[A.x0+60,A.x1-60]){G.ents.push({k:'crab',x:sx,y:b.gy-200,w:40,h:28,vx:sgn(p.x-sx)*60,vy:0,face:1,hp:1,t:0,st:'walk',x0:sx,y0:b.gy,cd:1,onG:false})}}if(b.t>1.1){b.sm=0;b.st='idle';b.t=0}}
  else if(b.st==='leap'){if(!b.lp){b.lp=1;const tx=clamp(p.x+(p.x<(A.x0+A.x1)/2?120:-120),A.x0+80,A.x1-80);const T=0.85;b.vx=(tx-b.x)/T;b.vy=-GRAV*0.5*T;AU.fx('laugh')}
   b.x+=b.vx*dt;const land=bossGround(b,dt);if(land&&b.t>0.2){b.lp=0;wave(b.x-40,b.y,-1,ph2?420:340);wave(b.x+40,b.y,1,ph2?420:340);b.st='dizzy';b.t=0;b.dz=ph2?1.1:1.4;AU.fx('pound')}}}
 b.x=clamp(b.x,A.x0+30,A.x1-30);
 /* player vs boss */
 if(p.dead||b.st==='dead'||b.st==='intro')return;const bb={x:b.x-b.w/2,y:b.y-b.h,w:b.w,h:b.h};if(b.k==='croc'&&b.st==='dive'&&b.sub)return;
 const pb=bx(p);
 if(p.ram>0&&ovr(ramBox(p),bb)){if(damageBoss(b,1,'ram')){p.ram=0;p.ramCd=0.3;p.vx=-p.face*260;p.vy=-300}return}
 if(p.atk>0&&!p.atkHit.has(b)&&ovr(attackBox(p),bb)){p.atkHit.add(b);if(bossOpen(b))damageBoss(b,0,'bonk');else{AU.fx('bonk');ftxt(b.x,b.y-b.h-10,'RAM or STOMP!','#fff')}return}
 if(ovr(pb,bb)){const fromTop=p.vy>40&&p.y-bb.y<34;if(fromTop){damageBoss(b,1,'stomp');p.vy=-760;p.holdJ=0;p.pound=0;return}
  if(bossOpen(b)){p.x+=sgn(p.x-b.x)*4;return}hurtPlayer(p,b.x)}}
function bossBeaten(){const b=G.boss;save.bosses=save.bosses||{};save.bosses[b.i]=1;persist();if(b.k==='cak'){G.finale=1;const A=G.arena,p=G.p,d=p.x<(A.x0+A.x1)/2?1:-1,px=clamp(p.x+d*150,A.x0+90,A.x1-90),cx=clamp(p.x+d*240,A.x0+40,A.x1-40);p.face=d;G.fin=[{n:'peter',x:px,y:G.L.boss.y+2,fl:d>0,sc:1.05},{n:'cake',x:cx,y:G.L.boss.y+2,fl:false,sc:0.9}];AU.fx('free');ftxt(px,G.L.boss.y-200,'PETER IS FREE!','#7aff7a',1);ftxt(cx,G.L.boss.y-150,'PRESENT SAVED!','#ffe060',1);ftxt(px,G.L.boss.y-170,'YOU DID IT, KELLY!','#ff9ad0',1)}levelClear()}

/* ===== rendering ===== */
let HUDR={x:0,y:0,w:0,h:0},BOSSR=null,TIPR=null;const PAT={};
function pat(n){if(PAT[n])return PAT[n];const im=IMG[n];if(!im)return '#6a4a2a';const p=c.createPattern(im,'repeat');try{p.setTransform(new DOMMatrix().scale(0.5))}catch(e){}return PAT[n]=p}
function hsh(x,y){let h=(x*374761393+y*668265263)|0;h=(h^(h>>>13))*1274126177|0;return((h^(h>>>16))>>>0)/4294967296}
function camUpdate(dt,snap){const p=G.p,cm=G.cam;let tx=p.x-viewW*0.4+p.vx*0.25,ty=p.y-VV*0.62;
 if(G.arena){const a=G.arena,aw=a.x1-a.x0;tx=aw<=viewW?a.x0+aw/2-viewW/2:clamp(p.x-viewW/2,a.x0,a.x1-viewW)}
 tx=clamp(tx,0,Math.max(0,G.L.W-viewW));const ymax=LVH-VV,ymin=Math.min(0,ymax);ty=clamp(ty,ymin,ymax);
 if(snap){cm.x=tx;cm.y=ty}else{cm.x+=(tx-cm.x)*Math.min(1,dt*6);cm.y+=(ty-cm.y)*Math.min(1,dt*4)}}
function drawBG(){const Wd=WORLDS[LEVELS[G.li].w],im=IMG[Wd.bg];c.fillStyle=Wd.sky;c.fillRect(0,0,W,gameH);if(!im)return;
 const h=gameH*1.08,w=h*im.width/im.height,off=-((G.cam.x*S*0.18)%(w*2)),y=gameH-h+Math.min(0,(-G.cam.y)*S*0.05);
 for(let i=0,x=off;x<W;i++,x+=w){c.save();if(i%2){c.translate(x+w,y);c.scale(-1,1);c.drawImage(im,0,0,w,h)}else c.drawImage(im,x,y,w,h);c.restore()}
 c.fillStyle=Wd.fog;c.fillRect(0,0,W,gameH)}
function drawTiles(){const Wd=WORLDS[LEVELS[G.li].w],T=G.L.T,x0=Math.max(0,Math.floor(G.cam.x/TS)-1),x1=Math.min(G.L.cols-1,Math.ceil((G.cam.x+viewW)/TS)+1);
 const P=pat(Wd.ter);
 for(let tx=x0;tx<=x1;tx++){const col=T[tx];let y=0;while(y<ROWS){if(col[y]===1){let e=y;while(e<ROWS&&col[e]===1)e++;c.fillStyle=P;c.fillRect(tx*TS,y*TS,TS+0.6,(e-y)*TS+(e>=ROWS?80:0));
   c.fillStyle='rgba(0,0,0,.28)';if(tx>0&&T[tx-1]&&!solidK(T[tx-1][y]))c.fillRect(tx*TS,y*TS,4,(e-y)*TS+80);if(tx<G.L.cols-1&&!solidK(T[tx+1][y]))c.fillRect(tx*TS+TS-4,y*TS,4,(e-y)*TS+80);y=e}else y++}}
 for(let tx=x0;tx<=x1;tx++){const col=T[tx];for(let ty=0;ty<ROWS;ty++){const k=col[ty],X=tx*TS,Y=ty*TS;
  if(k===1&&(ty===0||(!solidK(col[ty-1])&&col[ty-1]!==6))){drawCap(Wd,tx,X,Y)}
  else if(k===1&&ty>0&&col[ty-1]===6){/* sea floor */c.fillStyle='rgba(255,240,190,.35)';c.fillRect(X,Y,TS+0.6,5)}
  if(k===1&&ty<ROWS-1&&(col[ty+1]===6||col[ty+1]===0)&&ty>0&&solidK(col[ty-1])){/* overhang underside */c.fillStyle='rgba(0,0,0,.35)';c.fillRect(X,Y+TS-6,TS+0.6,6);c.fillStyle=Wd.edge;for(let i=0;i<3;i++){const dx=X+hsh(tx,i+3)*TS;c.beginPath();c.moveTo(dx-4,Y+TS);c.lineTo(dx,Y+TS+8+hsh(i,tx)*8);c.lineTo(dx+4,Y+TS);c.fill()}}
  else if(k===2){c.fillStyle='rgba(0,0,0,.25)';c.fillRect(X+2,Y+12,TS-4,6);c.fillStyle=Wd.plank;c.beginPath();c.roundRect?c.roundRect(X,Y,TS+0.5,14,4):c.rect(X,Y,TS,14);c.fill();c.fillStyle='rgba(255,255,255,.22)';c.fillRect(X+3,Y+2,TS-6,3);c.fillStyle='rgba(0,0,0,.25)';c.fillRect(X+TS-2,Y,2,14)}
  else if(k===3)drawCoral(tx,ty,X,Y);
  else if(k===4){if(IMG.rock)c.drawImage(IMG.rock,X-1,Y-1,TS+2,TS+2);else{c.fillStyle='#999';c.fillRect(X,Y,TS,TS)}}
  else if(k===5)drawSpikes(tx,X,Y);}}}
function drawEnt(e){const fl=e.face>0;if(e.dead&&!e.dying)return;c.save();if(e.dying){c.translate(e.x,e.y-e.h/2);c.rotate(e.rot||0);c.translate(-e.x,-(e.y-e.h/2));c.globalAlpha=clamp(e.dying,0,1)}
 if(e.k==='food'){const n=e.f==='mango'?'mango':'leaves';spr(n,e.x,e.y+18+Math.sin(e.t*2)*3,1);if(G.p.mode==='ride'&&Math.hypot(e.x-G.p.x,e.y-G.p.y)<200){c.globalAlpha=0.5+0.5*Math.sin(G.t*6);c.strokeStyle='#fff6a0';c.lineWidth=2;c.beginPath();c.arc(e.x,e.y,24,0,TAU);c.stroke()}}
 else if(e.k==='crab'){drawCrab(e,e.x,e.y+2,1)}
 else if(e.k==='gull'){const fr=(e.st==='dive')?'gull2':(Math.floor(e.t*7)%2?'gull1':'gull2');spr(fr,e.x,e.y+12+(fr==='gull1'?2:-2),1,fl)}
 else if(e.k==='jelly')drawJelly(e);
 else if(e.k==='urchin'){drawUrchin(e,fl)}
 else if(e.k==='hermit'){if(e.st==='roll')spr('hermit',e.x,e.y-e.h/2+4,1,fl,1,e.rot||0,0.5);else spr('hermit',e.x,e.y+3+Math.abs(Math.sin(e.t*3))*-1.5,1,fl)}
 else if(e.k==='coco'){spr('coco',e.x,e.y+3+Math.sin(e.t*4)*1.2,1,fl,1,e.thr>0?-0.18*(fl?-1:1):Math.sin(e.t*2)*0.03)}
 else if(e.k==='fish')drawFish(e,fl);
 else if(e.k==='puff'){e.ps=(e.ps||0)+((e.puffed?1:0)-(e.ps||0))*0.2;const big=e.ps>0.5,sc=big?0.8+0.2*e.ps:1-0.15*e.ps;spr(big?'puff2':'puff1',e.x,e.y+(big?14:6),sc,fl,1,Math.sin(e.t*9)*0.07)}
 c.restore();if(e.stun>0&&!e.dying)dizzyStars(e.x,e.y-e.h-6,18)}
function dizzyStars(x,y,r){for(let i=0;i<3;i++){const a=G.t*5+i*TAU/3;spr('star',x+Math.cos(a)*r,y+Math.sin(a)*r*0.35+6,0.45)}}
function drawPlayer(p){if(p.inv>0&&Math.floor(p.inv*14)%2&&!p.dead)return;if(p.mode==='swim'){drawSwimmer(p);return}let n,rot=0;const ride=p.mode==='ride';
 if(ride){if(p.ledge){n='ride_jump';rot=-p.face*0.35}else if(p.tng>0)n='ride_tongue';else if(p.ram>0||p.swing||p.pound)n='ride_ram';else if(!p.onG)n='ride_jump';else if(Math.abs(p.vx)>30)n=Math.floor(p.anim*9)%2?'ride_run1':'ride_run2';else n='ride_idle';
  if(p.swing)rot=-p.swing.a*0.6+(p.face>0?-0.5:0.5);if(p.pound)rot=p.face*0.9;if(p.ram>0&&p.ramDy<0)rot=-p.face*1.1}
 else{if(p.atk>0)n=p.atkK==='kick'?'kelly_kick':'kelly_punch';else if(!p.onG)n='kelly_jump';else if(Math.abs(p.vx)>30)n=Math.floor(p.anim*9)%2?'kelly_run1':'kelly_run2';else n='kelly_idle'}
 if(p.onG&&!p.dead){c.fillStyle='rgba(0,0,0,.25)';c.beginPath();c.ellipse(p.x,p.y,ride?44:20,6,0,0,TAU);c.fill()}
 if(p.swing){const hp=headPt(p),h=p.swing.h;c.strokeStyle='#5a3a1a';c.lineWidth=3;c.beginPath();c.moveTo(h.x,h.y+20);c.lineTo(hp.x,hp.y);c.stroke()}
 if(p.tng>0&&p.tngT){const hp=headPt(p),o=p.tngT.o,k=1-Math.abs(p.tng-0.15)/0.15,tx=lerp(hp.x,o.x,k),ty=lerp(hp.y+14,o.y,k);c.strokeStyle='#e8507a';c.lineWidth=6;c.lineCap='round';c.beginPath();c.moveTo(hp.x+p.face*6,hp.y+16);c.lineTo(tx,ty);c.stroke();c.fillStyle='#ff7aa0';c.beginPath();c.arc(tx,ty,6,0,TAU);c.fill()}
 const sq=p.squash>0?1+p.squash*0.12:1;c.save();c.translate(p.x,p.y);c.scale(1/sq*(1),sq>1?1/sq*0.98+0.02:1);c.translate(-p.x,-p.y);
 const anchorY=p.swing?0.5:1,yy=p.swing?p.y-p.h*0.5:p.y+2;
 const rdt=clamp(p.anim-(p._la===undefined?p.anim:p._la),0,0.1);p._la=p.anim;const isRun=/_run[12]$/.test(n),amp=rigStep(p,rdt,isRun,PH[p.mode].spd),useRig=!p.dead&&(isRun||(/_idle$/.test(n)&&p.onG&&p._ramt>0.15));
 if(!(useRig&&(ride?drawRideRig(p,p.x,yy,1,p.face<0,amp):drawKellyRig(p,p.x,yy,0.98,p.face<0,amp))))spr(n,p.x,yy,ride?1:0.98,p.face<0,1,rot,anchorY);c.restore();
 if(p.ram>0){c.globalAlpha=0.5;spr(n,p.x-p.face*22,p.y+2,1,p.face<0,0.4,rot);c.globalAlpha=1}
 if(G.p.mode==='ride'&&!p.swing){const hk=nearHook(p);if(hk){c.strokeStyle='rgba(255,240,140,'+(0.5+0.5*Math.sin(G.t*10))+')';c.lineWidth=3;c.beginPath();c.arc(hk.x,hk.y+38,22,0,TAU);c.stroke()}}}
const BSPR={tusk_idle:'lob_idle',tusk_charge:'lob_charge',tusk_dizzy:'lob_dizzy',croc_idle:'shk_idle',croc_bite:'shk_bite',croc_dizzy:'shk_dizzy',bab_idle:'oct_idle',bab_throw:'oct_throw',bab_dizzy:'oct_dizzy',cak_idle:'cap_idle',cak_throw:'cap_throw',cak_rage:'cap_rage',cak_dizzy:'cap_dizzy'};
function drawBoss(b){if(!b)return;const k=b.k;let n;const st=b.st;
 if(st==='dizzy'||st==='dead')n=k+'_dizzy';
 else if(k==='tusk')n=st==='charge'||st==='wind'?'tusk_charge':'tusk_idle';
 else if(k==='croc')n=st==='bite'&&b.t>0.3||st==='leap'?'croc_bite':'croc_idle';
 else if(k==='bab')n=b.thr>0||st==='leapdown'?'bab_throw':'bab_idle';
 else if(k==='vex')n=st==='dive'||st==='tele'?'vex_dive':'vex_fly';
 else n=st==='rage'||(b.ph===2&&st!=='throw')?'cak_rage':(b.thr>0?'cak_throw':'cak_idle');
 n=BSPR[n]||n;const fl=b.face>0;if(b.onG||k!=='vex'){c.fillStyle='rgba(0,0,0,.28)';c.beginPath();c.ellipse(b.x,b.gy-(b.perch?4*TS:0)+(b.perch?0:0),b.w*0.6,9,0,0,TAU);c.fill()}
 if(k==='croc'&&st==='dive'&&b.sub){spr(n,b.x,b.y,0.9,fl,0.55,Math.sin(G.t*3)*0.08);for(let i=0;i<2;i++)if(Math.random()<0.2)P({x:b.x+rand(-30,30),y:b.gy+14,vx:0,vy:-40,l:0.5,m:0.5,s:4,c:'rgba(220,250,255,.8)',g:-50});return}
 if(b.ph===2&&k==='cak'&&st!=='dead'){c.save();c.globalAlpha=0.35+0.15*Math.sin(G.t*8);c.fillStyle='#ff3020';c.beginPath();c.ellipse(b.x,b.y-b.h/2,b.w,b.h*0.65,0,0,TAU);c.fill();c.restore()}
 if(st==='tele'){c.save();c.globalAlpha=0.4+0.4*Math.sin(G.t*30);c.fillStyle='#ff4060';c.beginPath();c.arc(b.x,b.y-60,90,0,TAU);c.fill();c.restore()}
 const yy=b.y+4+(st==='wind'?Math.sin(G.t*50)*2:0);
 const fa=st==='dead'?clamp(1-(b.t-0.8)/1.2,0,1):1;if(fa<=0)return;if(b.flash>0)sprT(n,'#ffffff',b.x,yy,1,fl,0.9*fa);else spr(n,b.x,yy,1,fl,fa);
 if(st==='dizzy')dizzyStars(b.x,b.y-b.h-10,40)}
function drawShot(s){if(s.k==='ink'){c.save();c.translate(s.x,s.y);c.rotate(Math.sin(s.t*8)*0.2);const g=c.createRadialGradient(-5,-5,2,0,0,17);g.addColorStop(0,'#8a5ac8');g.addColorStop(1,'#2a0a44');c.fillStyle=g;c.beginPath();c.arc(0,0,15,0,TAU);c.fill();c.fillStyle='#2a0a44';for(let i=0;i<3;i++){c.beginPath();c.ellipse(-8+i*8,12+Math.sin(s.t*10+i)*2,3,6,0,0,TAU);c.fill()}c.strokeStyle='#14001f';c.lineWidth=2;c.beginPath();c.arc(0,0,15,0,TAU);c.stroke();c.restore();return}
 if(s.k==='coconut')spr('coconut',s.x,s.y,1,false,1,s.rot,0.5);else if(s.k==='bone')spr('bone',s.x,s.y,1,false,1,s.rot,0.5);
 else if(s.k==='feather'){c.save();c.translate(s.x,s.y);c.rotate(s.rot);c.fillStyle='#7a3ac8';c.beginPath();c.ellipse(0,0,18,6,0,0,TAU);c.fill();c.strokeStyle='#2a0a4a';c.lineWidth=2;c.beginPath();c.moveTo(-20,0);c.lineTo(18,0);c.stroke();c.restore()}
 else if(s.k==='wave'){c.save();c.translate(s.x,s.y);c.scale(sgn(s.vx),1);c.fillStyle='rgba(255,230,180,.85)';c.beginPath();c.moveTo(-18,0);c.quadraticCurveTo(0,-46,18,0);c.closePath();c.fill();c.strokeStyle='rgba(140,90,40,.8)';c.lineWidth=3;c.stroke();c.restore()}}
function drawWorld(){const L=G.L,cm=G.cam;c.save();c.translate(-cm.x,-cm.y);
 const vx0=cm.x-80,vx1=cm.x+viewW+80,vis=x=>x>vx0&&x<vx1;
 for(const s of L.signs)if(vis(s.x))spr('sign',s.x,s.y+2,0.8);
 for(const cp of L.cps)if(vis(cp.x)){if(cp.on)spr('flag',cp.x,cp.y+2,0.9,false,1,Math.sin(G.t*3)*0.03);else sprT('flag','rgba(60,60,70,1)',cp.x,cp.y+2,0.9,false,0.55)}
 if(L.goal&&vis(L.goal.x)){spr('flag',L.goal.x,L.goal.y+2,1.6,false,1,Math.sin(G.t*3)*0.04);if(Math.random()<0.2)stars(L.goal.x+rand(-30,30),L.goal.y-rand(40,140),1)}
 if(L.cage&&vis(L.cage.x)){const cg=L.cage;cg.sh=Math.max(0,(cg.sh||0)-0.016);const sh=cg.sh>0?Math.sin(G.t*80)*4:0;if(!cg.open){spr('cage',cg.x+sh,cg.y+4,1);spr('jinxy',cg.x+sh,cg.y-8,0.82,false,1,Math.sin(G.t*3)*0.04);for(let i=0;i<4;i++){const bx0=cg.x+sh-34+i*22;c.fillStyle='#8a5a22';rr(bx0-3,cg.y-92,7,86,3);c.fill();c.fillStyle='rgba(255,220,150,.5)';c.fillRect(bx0-1,cg.y-90,2,80)}if(G.p&&Math.abs(G.p.x-cg.x)<260){c.textAlign='center';c.font='18px "Lilita One",sans-serif';c.lineWidth=4;c.strokeStyle='#3a1a00';c.strokeText('PUNCH THE CAGE!',cg.x,cg.y-112);c.fillStyle='#fff';c.fillText('PUNCH THE CAGE!',cg.x,cg.y-112)}}}
 drawTiles();drawWaterBack(vx0,vx1);
 for(const h of L.hooks)if(vis(h.x)){c.strokeStyle='#4a3a2a';c.lineWidth=3;c.beginPath();c.moveTo(h.x,h.y-600);c.lineTo(h.x,h.y-10);c.stroke();spr('hook',h.x,h.y+44,1,false,1,Math.sin(G.t*2+h.x)*0.06)}
 for(const g of L.gems)if(!g.got&&vis(g.x)){spr('gem',g.x,g.y+11+Math.sin(G.t*3+g.t)*2,0.95);if(hsh(g.x|0,(G.t*4)|0)<0.04)stars(g.x+rand(-8,8),g.y-6,1)}
 for(const s of L.stars)if(!s.got&&vis(s.x)){c.save();c.globalAlpha=0.35;c.fillStyle='#fff2a0';c.beginPath();c.arc(s.x,s.y,24+Math.sin(G.t*4)*4,0,TAU);c.fill();c.restore();spr('star',s.x,s.y+16,1.25+Math.sin(G.t*4)*0.08,false,1,Math.sin(G.t*2)*0.2)}
 for(const e of G.ents)if(vis(e.x))drawEnt(e);
 if(G.free){const f=G.free;spr('jinxy',f.x,f.y,0.9,f.face<0)}
 drawBoss(G.boss);
 if(G.fin){for(const f of G.fin)spr(f.n,f.x,f.y,f.sc||1,f.fl)}
 if(G.pip&&!G.pip.hide&&G.p)drawPipFollower(G.pip);
 if(G.p)drawPlayer(G.p);
 for(const s of G.shots)drawShot(s);
 drawWaterFront(vx0,vx1);
 for(const q of G.parts){const a=clamp(q.l/q.m,0,1);c.globalAlpha=a;if(q.ring){c.strokeStyle=q.c;c.lineWidth=q.w*a;c.beginPath();c.arc(q.x,q.y,q.s*(1.2-a),0,TAU);c.stroke()}else{c.fillStyle=q.c;if(q.bub){c.strokeStyle=q.c;c.lineWidth=1.4;c.beginPath();c.arc(q.x+Math.sin(q.l*9)*2,q.y,q.s,0,TAU);c.stroke();c.fillStyle='rgba(255,255,255,.5)';c.fillRect(q.x-q.s*0.4,q.y-q.s*0.5,1.6,1.6)}else if(q.puff){c.beginPath();c.arc(q.x,q.y,q.s*(1.5-a*0.5),0,TAU);c.fill()}else c.fillRect(q.x-q.s/2,q.y-q.s/2,q.s,q.s)}}c.globalAlpha=1;
 c.textAlign='center';for(const t of G.texts){const a=clamp(t.l/t.m*1.6,0,1);c.globalAlpha=a;c.font=(t.big?'26px':'18px')+' "Lilita One",sans-serif';c.lineWidth=5;c.strokeStyle='rgba(30,10,0,.85)';c.strokeText(t.s,t.x,t.y);c.fillStyle=t.c;c.fillText(t.s,t.x,t.y)}c.globalAlpha=1;
 c.restore()}
function ambient(dt){const Wd=WORLDS[LEVELS[G.li].w];G.amb=G.amb||[];if(G.amb.length<40&&Math.random()<dt*20){G.amb.push({x:Math.random()*W,y:Wd.amb==='snow'||Wd.amb==='leaves'?-10:Wd.amb==='embers'||Wd.amb==='bubbles'?gameH+10:Math.random()*gameH*0.8,vx:rand(-20,20)+(Wd.amb==='snow'?-30:0),vy:Wd.amb==='snow'?rand(40,90):Wd.amb==='leaves'?rand(30,60):Wd.amb==='embers'?-rand(30,70):Wd.amb==='bubbles'?-rand(20,40):rand(-5,5),l:rand(4,9),s:rand(1.5,4),k:Wd.amb,ph:Math.random()*6})}
 for(const a of G.amb){a.x+=(a.vx+Math.sin(G.t+a.ph)*15)*dt-G.camDx*S*0.3;a.y+=a.vy*dt;a.l-=dt}G.amb=G.amb.filter(a=>a.l>0&&a.y>-20&&a.y<gameH+20&&a.x>-30&&a.x<W+30);
 for(const a of G.amb){c.globalAlpha=Math.min(1,a.l);c.fillStyle=a.k==='snow'?'#fff':a.k==='leaves'?'#7ac04a':a.k==='embers'?'#ffa040':a.k==='bubbles'?'rgba(220,250,255,.7)':a.k==='spray'?'rgba(255,255,255,.55)':'rgba(255,240,200,.6)';
  if(a.k==='leaves'){c.save();c.translate(a.x,a.y);c.rotate(G.t*2+a.ph);c.beginPath();c.ellipse(0,0,a.s*2,a.s,0,0,TAU);c.fill();c.restore()}else{c.beginPath();c.arc(a.x,a.y,a.s,0,TAU);c.fill()}}c.globalAlpha=1}
function rr(x,y,w,h,r){c.beginPath();if(c.roundRect)c.roundRect(x,y,w,h,r);else c.rect(x,y,w,h)}
function heart(x,y,s,full){c.save();c.translate(x,y);c.scale(s/16,s/16);c.beginPath();c.moveTo(0,5);c.bezierCurveTo(-8,-3,-8,-9,-3,-9);c.bezierCurveTo(-1,-9,0,-7,0,-6);c.bezierCurveTo(0,-7,1,-9,3,-9);c.bezierCurveTo(8,-9,8,-3,0,5);c.closePath();c.fillStyle=full?'#ff3a5a':'rgba(0,0,0,.45)';c.fill();c.lineWidth=1.6;c.strokeStyle='#fff';c.stroke();c.restore()}
function drawHUD(){const p=G.p,x=10+SAFE.l,y=8+SAFE.t;c.textAlign='left';
 const pw=portrait?Math.min(W-130-SAFE.r-x,250):250,ph=62;c.fillStyle='rgba(20,10,0,.48)';rr(x,y,pw,ph,16);c.fill();
 c.save();c.beginPath();c.arc(x+31,y+31,25,0,TAU);c.fillStyle='#7fd8f0';c.fill();c.clip();const im=IMG.ride_idle;if(im)c.drawImage(im,im.width*0.36,0,im.width*0.64,im.width*0.64,x+6,y+8,50,50);c.restore();c.strokeStyle='#fff';c.lineWidth=3;c.beginPath();c.arc(x+31,y+31,25,0,TAU);c.stroke();
 for(let i=0;i<p.maxhp;i++)heart(x+70+i*22,y+18,18,i<p.hp);
 c.font='17px "Lilita One",sans-serif';c.fillStyle='#fff';c.strokeStyle='rgba(0,0,0,.7)';c.lineWidth=3;
 const t1='x'+G.lives;c.strokeText(t1,x+72+p.maxhp*22,y+24);c.fillText(t1,x+72+p.maxhp*22,y+24);
 spr('gem',x+78,y+52,0.45);const t2=String(G.gems).padStart(2,'0');c.strokeText(t2,x+88,y+52);c.fillText(t2,x+88,y+52);
 for(let i=0;i<3;i++){if(G.lvStars[i])spr('star',x+126+i*19,y+53,0.42);else{c.globalAlpha=0.35;spr('star',x+126+i*19,y+53,0.42);c.globalAlpha=1}}
 const sc=String(G.score).padStart(6,'0');c.textAlign='right';c.strokeText(sc,x+pw-10,y+52);c.fillStyle='#ffe27a';c.fillText(sc,x+pw-10,y+52);
 HUDR={x,y,w:pw,h:ph};
 /* boss bar */
 BOSSR=null;const b=G.boss;if(b&&b.st!=='dead'||b&&b.hp>0){const rightRes=130+SAFE.r;let bxp,byp,bw;const free0=x+pw+12,free1=W-rightRes;
  if(free1-free0>=300){bw=Math.min(440,free1-free0);bxp=free0+(free1-free0-bw)/2;byp=y+6}else{bxp=x;bw=W-x-10-SAFE.r;byp=y+ph+8}
  c.fillStyle='rgba(20,0,0,.6)';rr(bxp,byp,bw,46,12);c.fill();c.textAlign='center';c.font='15px "Lilita One",sans-serif';c.fillStyle='#fff';c.fillText(b.name,bxp+bw/2,byp+18);
  c.fillStyle='rgba(0,0,0,.6)';rr(bxp+10,byp+25,bw-20,13,6);c.fill();const f=clamp(b.hp/b.max,0,1);const g=c.createLinearGradient(bxp,0,bxp+bw,0);g.addColorStop(0,'#ff3030');g.addColorStop(1,'#ffb030');c.fillStyle=g;rr(bxp+10,byp+25,(bw-20)*f,13,6);c.fill();BOSSR={x:bxp,y:byp,w:bw,h:46}}
 /* sign tip */
 TIPR=null;if(G.sign&&!G.boss&&!G.cut){const s=G.sign.text;const top=Math.max(y+ph,BOSSR?BOSSR.y+BOSSR.h:0)+10;const maxW=Math.min(560,W-24-SAFE.l-SAFE.r);c.font='17px "Baloo 2",sans-serif';const lines=wrapText(s,maxW-28);const bh=lines.length*22+16;let bxp=(W-maxW)/2;
  c.fillStyle='rgba(255,248,225,.94)';rr(bxp,top,maxW,bh,14);c.fill();c.strokeStyle='#8a5a2a';c.lineWidth=3;c.stroke();c.fillStyle='#3a2210';c.textAlign='center';lines.forEach((l,i)=>c.fillText(l,W/2,top+28+i*22-6));TIPR={x:bxp,y:top,w:maxW,h:bh}}
 /* level banner */
 if(G.banner>0){const a=clamp(G.banner,0,1);c.globalAlpha=a;c.textAlign='center';c.font='30px "Lilita One",sans-serif';c.lineWidth=6;c.strokeStyle='#3a1a00';const L=LEVELS[G.li];const t='WORLD '+(L.w+1)+'-'+(G.li%2+1)+': '+L.name.toUpperCase();const yy=gameH*0.4;c.strokeText(t,W/2,yy);c.fillStyle='#ffe27a';c.fillText(t,W/2,yy);c.globalAlpha=1}
 if(G.bossIntro>0&&G.boss){const a=clamp(G.bossIntro,0,1);c.globalAlpha=a;c.textAlign='center';c.font='34px "Lilita One",sans-serif';c.lineWidth=7;c.strokeStyle='#300';const yy=gameH*0.42;c.strokeText(G.boss.name,W/2,yy);c.fillStyle='#ff7040';c.fillText(G.boss.name,W/2,yy);c.globalAlpha=1}}
function wrapText(s,mw){const w=s.split(' '),out=[];let l='';for(const x of w){const t=l?l+' '+x:x;if(c.measureText(t).width>mw&&l){out.push(l);l=x}else l=t}if(l)out.push(l);return out}
function drawPadBG(){if(!portrait)return;const g=c.createLinearGradient(0,gameH,0,H);g.addColorStop(0,'#0c4a5e');g.addColorStop(1,'#04202c');c.fillStyle=g;c.fillRect(0,gameH,W,H-gameH);c.fillStyle='#7fe8ff';c.fillRect(0,gameH,W,3);
 c.globalAlpha=0.07;c.fillStyle='#bff6ff';for(let i=0;i<14;i++){const y=gameH+((i*37)%(H-gameH));c.beginPath();c.ellipse((i*131)%W,y,40+(i%3)*20,10,0,0,TAU);c.fill()}c.globalAlpha=1}
function render(){c.setTransform(DPR,0,0,DPR,0,0);c.clearRect(0,0,W,H);if(!G){c.fillStyle='#1d1206';c.fillRect(0,0,W,H);return}
 c.save();c.beginPath();c.rect(0,0,W,gameH);c.clip();drawBG();
 const sx=G.shake>0?rand(-G.shake,G.shake):0,sy=G.shake>0?rand(-G.shake,G.shake):0;c.save();c.translate(sx,sy);c.scale(S,S);drawWorld();c.restore();
 ambient(G.dtR||0.016);if(G.flash&&G.flash.a>0){c.globalAlpha=G.flash.a;c.fillStyle=G.flash.c;c.fillRect(0,0,W,gameH);c.globalAlpha=1}
 const vg=c.createRadialGradient(W/2,gameH/2,Math.min(W,gameH)*0.45,W/2,gameH/2,Math.max(W,gameH)*0.75);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.35)');c.fillStyle=vg;c.fillRect(0,0,W,gameH);
 c.restore();drawPadBG();if(state==='play'||state==='pause')drawHUD()}

/* ===== run-cycle rig: real alternating strides (body art + animated legs) ===== */
function rigLimb(x,y,a,len,w,fill,line){const ex=x+Math.sin(a)*len,ey=y+Math.cos(a)*len;c.lineCap='round';
 c.strokeStyle=line;c.lineWidth=w+3.2;c.beginPath();c.moveTo(x,y);c.lineTo(ex,ey);c.stroke();
 c.strokeStyle=fill;c.lineWidth=w;c.beginPath();c.moveTo(x,y);c.lineTo(ex,ey);c.stroke();return[ex,ey]}
function rigStep(p,dt,running,spd){if(p._rph===undefined){p._rph=0;p._ramt=0}
 p._ramt+=((running?1:0)-p._ramt)*Math.min(1,dt*14);
 const v=Math.abs(p.vx);if(running)p._rph=(p._rph+Math.min(1.375,v/(p.mode==='ride'?118:78))*dt)%1;/* cadence (arm check, Oct 30 2026): capped at ~2.75 steps/s (Jinxy gallop was ~5) */
 else if(p._ramt>0.02){/* settle the nearer leg pair toward a neutral passing pose */const t=p._rph%0.5;p._rph+=(t<0.25?-t:0.5-t)*Math.min(1,dt*10)}
 return p._ramt*clamp(v/spd,0.55,1)+0.0}
/* Kelly on foot. ix/iy in sprite pixels; bottom-centre of the sprite = ground */
function kellyLeg(hx,hy,t,amp,back){const th=0.1+amp*0.74*Math.sin(t),cs=Math.cos(t),kn=0.14+amp*(1.6*Math.pow(Math.max(0,cs),1.3)+0.16*Math.max(0,-cs));
 const J=back?'#1b3048':'#2a4a70',JL=back?'#0a1420':'#0e1a28',B=back?'#6a3a14':'#8e5222',BL=back?'#2a1404':'#3a1a06';
 const k=rigLimb(hx,hy,th,32,back?19:21,J,JL);
 if(!back){c.strokeStyle='rgba(120,160,210,.35)';c.lineWidth=3;c.beginPath();c.moveTo(hx+Math.cos(th)*5,hy-Math.sin(th)*5);c.lineTo(k[0]+Math.cos(th)*4,k[1]-Math.sin(th)*4);c.stroke()}
 const sa=th-kn,a=rigLimb(k[0],k[1],sa,24,back?14:15,J,JL);
 /* boot: shaft continues the shin, foot points forward */
 const b=rigLimb(a[0],a[1],sa,8,back?17:18,B,BL),fa=sa+Math.PI/2-0.15-amp*0.35*Math.max(0,cs);
 c.save();c.translate(b[0],b[1]);c.rotate(-fa+Math.PI/2);c.fillStyle=BL;c.beginPath();c.ellipse(5,1,13.5,7.8,0,0,TAU);c.fill();c.fillStyle=B;c.beginPath();c.ellipse(5,0,11.8,6.2,0,0,TAU);c.fill();
 c.fillStyle=BL;c.fillRect(-7,4.6,24,3);if(!back){c.fillStyle='rgba(255,210,150,.45)';c.fillRect(-2,-4,8,2)}c.restore()}
function drawKellyRig(p,x,y,sc,flip,amp){const im=IMG.kelly_torso;if(!im)return false;const f=0.5*sc,t=p._rph*TAU,
 bob=amp*5*Math.cos(2*t),lean=amp*0.035*Math.sin(2*t);
 c.save();c.translate(x,y);c.scale(flip?-f:f,f);const hx=3,hy=-66+bob;
 kellyLeg(hx-3,hy,t+Math.PI,amp,true);
 c.save();c.translate(hx,hy);c.rotate(lean);c.translate(-hx,-hy);c.drawImage(im,-59,-161+bob);c.restore();
 kellyLeg(hx+2,hy,t,amp,false);c.restore();return true}
/* Jinxy (ride mode): four-legged gallop under the body art */
function girLeg(hx,hy,t,amp,front,back){const cs=Math.cos(t),s=Math.sin(t),up=front?0.12+amp*0.7*s:-0.08+amp*0.64*s,
 bend=0.1+amp*1.25*Math.pow(Math.max(0,cs),1.3),lo=front?up-bend:up+bend*0.95;
 const T=back?'#c98a34':'#f2b24e',L=back?'#5a3410':'#8a5418',P=back?'#8a4e14':'#b8661c';
 const k=rigLimb(hx,hy,up,30,back?15:16.5,T,L);
 c.fillStyle=P;for(const q of [0.3,0.62]){c.beginPath();c.ellipse(hx+(k[0]-hx)*q+1.5,hy+(k[1]-hy)*q,4.4,3.2,-up,0,TAU);c.fill()}
 const a=rigLimb(k[0],k[1],lo,28,back?10:11,T,L);c.fillStyle=T;c.beginPath();c.arc(k[0],k[1],back?7:8,0,TAU);c.fill();
 c.save();c.translate(a[0],a[1]);c.rotate(-lo);c.fillStyle=back?'#2e1806':'#4a2608';c.beginPath();c.moveTo(-6.5,-2);c.lineTo(6.5,-2);c.lineTo(8,8);c.quadraticCurveTo(0,10,-8,8);c.closePath();c.fill();c.fillStyle='rgba(255,220,170,.25)';c.fillRect(-4,0,6,2);c.restore()}
function girLegS(hx,hy,t,amp,front,back,k){c.save();c.translate(hx,hy);c.scale(k,k);girLeg(0,0,t,amp,front,back);c.restore()}
function drawRideRig(p,x,y,sc,flip,amp){const im=IMG.ride_body;if(!im)return false;const f=0.5*sc,t=p._rph*TAU,
 bob=amp*4.5*Math.cos(t+0.4),pitch=amp*0.05*Math.sin(t+0.4),K=0.85;
 c.save();c.translate(x,y);c.scale(flip?-f:f,f);c.translate(0,bob);c.rotate(pitch);
 const HX=-28,FX=26,HY=-59,FY=-59;
 girLegS(HX+4,HY,t,amp,false,true,K);girLegS(FX+4,FY,t+Math.PI*0.9,amp,true,true,K);
 c.drawImage(im,-im.width/2,-im.height);
 girLegS(HX,HY+2,t+Math.PI*0.2,amp,false,false,K);girLegS(FX,FY+2,t+Math.PI*1.1,amp,true,false,K);
 c.restore();return true}
/* Hyena: 4-leg walk (lateral sequence) under the legless body art; sprite faces left natively. Render-only. */
function hyLeg(hx,hy,t,amp,front,back){const s=Math.sin(t),cs=Math.cos(t),lift=Math.pow(Math.max(0,cs),1.4);
 const T=back?'#8f7148':'#c29d68',L=back?'#24180c':'#3b2a1c';
 const up=(front?0.04:-0.06)+amp*0.42*s,u=front?up:up+0.32,lo=front?up-0.05-amp*1.15*lift:up-0.3-amp*0.95*lift;
 const k=rigLimb(hx,hy,-u,front?19:18,front?(back?10:12):(back?12:14.5),T,L);
 const a=rigLimb(k[0],k[1],-lo,front?17:18,back?8:9.5,T,L);
 c.fillStyle=T;c.beginPath();c.arc(k[0],k[1],back?4.8:5.6,0,TAU);c.fill();
 if(!back){c.fillStyle='rgba(60,40,24,.75)';c.beginPath();c.ellipse((hx+k[0])/2,(hy+k[1])/2,2.6,3.4,0,0,TAU);c.fill()}
 c.fillStyle=back?'#3a2a1a':'#5a4430';c.beginPath();c.ellipse(a[0]-3,a[1]+1.5,6.5,3.6,0,0,TAU);c.fill()}
function drawHyenaRig(e,x,y,sc,flip){const im=IMG.hy_body;if(!im)return false;
 const rdt=clamp(e.t-(e._lt===undefined?e.t:e._lt),0,0.1);e._lt=e.t;if(e._rph===undefined){e._rph=(e.x*0.013)%1;e._ramt=1}
 const v=Math.abs(e.vx||0),mv=v>5;e._ramt+=((mv?1:0)-e._ramt)*Math.min(1,rdt*10);if(mv)e._rph=(e._rph+v*rdt/62)%1;
 const amp=e._ramt*clamp(v/75,0.5,1.2),t=e._rph*TAU,bob=amp*1.6*Math.cos(2*t),f=0.5*sc;
 c.save();c.translate(x,y);c.scale(flip?-f:f,f);c.translate(-im.width/2,-im.height);
 hyLeg(106,66+bob,t+Math.PI,amp,false,true);hyLeg(48,66+bob,t+Math.PI*1.5,amp,true,true);
 c.drawImage(im,0,bob);
 hyLeg(118,68+bob,t,amp,false,false);hyLeg(60,68+bob,t+Math.PI*0.5,amp,true,false);
 c.restore();return true}
/* Beetle: 6-leg tripod scuttle under the legless shell art; sprite faces left natively. Render-only. */
function bugLeg(hx,hy,fx,t,amp,back){const s=Math.sin(t),lift=Math.max(0,Math.cos(t));
 const px=fx+amp*5.5*s,py=52-amp*4.5*lift,kx=(hx+px)/2+(px<hx?-2:2),ky=Math.min(hy,py)-5;
 c.strokeStyle=back?'#1a1024':'#2c1c3c';c.lineWidth=back?2.6:3.2;c.lineCap='round';c.lineJoin='round';
 c.beginPath();c.moveTo(hx,hy);c.lineTo(kx,ky);c.lineTo(px,py);c.stroke()}
function drawBeetleRig(e,x,y,sc,flip,wob){const im=IMG.beetle_body;if(!im)return false;
 const rdt=clamp(e.t-(e._lt===undefined?e.t:e._lt),0,0.1);e._lt=e.t;if(e._rph===undefined){e._rph=(e.x*0.017)%1;e._ramt=1}
 const v=Math.abs(e.vx||0),mv=v>3;e._ramt+=((mv?1:0)-e._ramt)*Math.min(1,rdt*12);if(mv)e._rph=(e._rph+Math.min(1.5,v/22)*rdt)%1;/* cadence: beetle tripod capped at 3 steps/s (was ~4.4) */
 const amp=e._ramt*clamp(v/48,0.5,1.2),t=e._rph*TAU,bob=amp*0.8*Math.abs(Math.sin(t)),f=0.5*sc;
 c.save();c.translate(x,y);c.rotate(wob||0);c.scale(flip?-f:f,f);c.translate(-im.width/2,-im.height);
 bugLeg(22,40-bob,14,t+Math.PI,amp,true);bugLeg(32,41-bob,30,t,amp,true);bugLeg(42,40-bob,48,t+Math.PI,amp,true);
 c.drawImage(im,0,-bob);
 bugLeg(18,42-bob,8,t,amp,false);bugLeg(30,43-bob,26,t+Math.PI,amp,false);bugLeg(42,42-bob,52,t,amp,false);
 c.restore();return true}

const RDS=1.35;
/* ===== Vol 4 ocean rendering: caps, coral, water, Pip, sea critters ===== */
function drawCap(Wd,tx,X,Y){const cap=Wd.cap;
 if(cap==='sand'){c.fillStyle=Wd.top2;c.fillRect(X,Y,TS+0.6,10);c.fillStyle=Wd.top;c.beginPath();c.moveTo(X,Y+3);for(let i=0;i<=4;i++)c.lineTo(X+i*TS/4,Y-2+Math.sin((tx*4+i)*1.7)*1.5);c.lineTo(X+TS+0.6,Y+5);c.closePath();c.fill();
  if(hsh(tx,9)<0.22){const sx=X+hsh(tx,3)*TS;c.fillStyle=['#fff3e0','#ffb0a0','#f8d0ff'][(hsh(tx,4)*3)|0];c.beginPath();c.ellipse(sx,Y-1,4,3,0,Math.PI,TAU);c.fill();c.strokeStyle='rgba(120,80,40,.6)';c.lineWidth=1;c.stroke()}}
 else if(cap==='algae'){c.fillStyle='#2a3a22';c.fillRect(X,Y,TS+0.6,8);c.fillStyle=Wd.top;for(let i=0;i<4;i++){const hx=X+hsh(tx,i)*TS,hh=4+hsh(i,tx)*7;c.beginPath();c.ellipse(hx,Y,5,hh*0.5,Math.sin(G.t*2+hx)*0.2,0,TAU);c.fill()}
  if(hsh(tx,5)<0.25){c.fillStyle='#e8e0d0';for(let i=0;i<3;i++){c.beginPath();c.arc(X+8+i*9,Y+3,2.5,0,TAU);c.fill()}}}
 else if(cap==='coral'){c.fillStyle=Wd.top2;c.fillRect(X,Y,TS+0.6,9);for(let i=0;i<2;i++){const hx=X+6+hsh(tx,i)*(TS-12),hh=8+hsh(i,tx)*10,col=['#ff7aa0','#ffb04a','#b07aff','#5ae0d0'][(hsh(tx,i+7)*4)|0];c.strokeStyle=col;c.lineWidth=3;c.lineCap='round';c.beginPath();c.moveTo(hx,Y+2);c.lineTo(hx,Y-hh);c.moveTo(hx,Y-hh*0.5);c.lineTo(hx-4,Y-hh*0.8);c.moveTo(hx,Y-hh*0.6);c.lineTo(hx+4,Y-hh*0.95);c.stroke()}}
 else{c.fillStyle=Wd.top2;c.fillRect(X,Y,TS+0.6,6);c.fillStyle=Wd.top;c.fillRect(X,Y-2,TS+0.6,5);c.fillStyle='rgba(0,0,0,.35)';c.fillRect(X+TS-2,Y-2,2,7);c.fillStyle='#3a2a1a';c.fillRect(X+6,Y,2,2);c.fillRect(X+TS-10,Y,2,2)}}
function drawCoral(tx,ty,X,Y){const g=c.createLinearGradient(X,Y,X,Y+TS);g.addColorStop(0,'#ff9ab4');g.addColorStop(1,'#d0507a');c.fillStyle=g;rr(X+1,Y+1,TS-2,TS-2,8);c.fill();
 c.fillStyle='rgba(255,230,240,.55)';for(let i=0;i<5;i++){c.beginPath();c.arc(X+6+hsh(tx*3+i,ty)*28,Y+6+hsh(ty*5+i,tx)*28,2.2,0,TAU);c.fill()}
 c.strokeStyle='rgba(90,10,40,.75)';c.lineWidth=2;c.beginPath();c.moveTo(X+9,Y+5);c.lineTo(X+19,Y+18);c.lineTo(X+15,Y+32);c.moveTo(X+19,Y+18);c.lineTo(X+31,Y+23);c.stroke();c.strokeStyle='rgba(60,0,30,.5)';c.lineWidth=1.5;rr(X+1,Y+1,TS-2,TS-2,8);c.stroke()}
function drawSpikes(tx,X,Y){c.fillStyle='#3a2050';c.beginPath();c.ellipse(X+TS/2,Y+TS-8,TS/2+2,10,0,0,TAU);c.fill();
 for(let i=0;i<7;i++){const bx0=X+2+i*6,hh=16+hsh(tx,i)*12;c.strokeStyle=i%2?'#7a4aa8':'#5a2a88';c.lineWidth=3;c.lineCap='round';c.beginPath();c.moveTo(bx0,Y+TS-8);c.lineTo(bx0+(i-3)*1.5,Y+TS-8-hh);c.stroke()}
 c.fillStyle='#2a1038';c.beginPath();c.ellipse(X+TS/2,Y+TS-6,TS/2,7,0,0,TAU);c.fill()}
/* water: runs of columns with the same top */
function waterRuns(vx0,vx1){const out=[];const a=Math.max(0,Math.floor(vx0/TS)),b=Math.min(G.L.cols-1,Math.ceil(vx1/TS));let cur=null;
 for(let tx=a;tx<=b;tx++){const col=G.L.T[tx];let t=-1,e=-1;for(let y=0;y<ROWS;y++){if(col[y]===6){if(t<0)t=y;e=y}}
  if(t<0){cur=null;continue}const open=t===0||!solidK(col[t-1]);
  if(cur&&cur.t===t&&cur.e===e&&cur.open===open)cur.x1=(tx+1)*TS;else{cur={t,e,open,x0:tx*TS,x1:(tx+1)*TS};out.push(cur)}}
 return out}
function drawWaterBack(vx0,vx1){const Wd=WORLDS[LEVELS[G.li].w];
 for(const r of waterRuns(vx0,vx1)){const y0=r.t*TS,y1=(r.e+1)*TS;const g=c.createLinearGradient(0,y0,0,y1);g.addColorStop(0,Wd.water[0]);g.addColorStop(1,Wd.water[1]);c.fillStyle=g;c.fillRect(r.x0,y0,r.x1-r.x0+0.6,y1-y0);
  /* caustic light ribbons */
  c.save();c.beginPath();c.rect(r.x0,y0,r.x1-r.x0,y1-y0);c.clip();c.strokeStyle='rgba(200,250,255,.13)';c.lineWidth=3;
  for(let k=0;k<4;k++){c.beginPath();const yy=y0+20+k*38;for(let x=r.x0;x<=r.x1;x+=20){const v=yy+Math.sin(x*0.035+G.t*1.6+k*1.7)*7;x===r.x0?c.moveTo(x,v):c.lineTo(x,v)}c.stroke()}
  /* light shafts */
  c.fillStyle='rgba(220,250,255,.06)';for(let x=Math.floor(r.x0/160)*160;x<r.x1;x+=160){const sx=x+Math.sin(G.t*0.5+x)*20;c.beginPath();c.moveTo(sx,y0);c.lineTo(sx+30,y0);c.lineTo(sx+70,y1);c.lineTo(sx+20,y1);c.closePath();c.fill()}
  /* seaweed on the floor */
  c.lineCap='round';for(let x=r.x0+14;x<r.x1;x+=46){if(hsh(x|0,3)<0.5)continue;const hh=30+hsh(x|0,5)*40;c.strokeStyle=hsh(x|0,8)<0.5?'rgba(60,170,90,.85)':'rgba(40,130,110,.85)';c.lineWidth=5;c.beginPath();c.moveTo(x,y1);for(let i=1;i<=4;i++)c.lineTo(x+Math.sin(G.t*1.8+i+x)*6*i/4,y1-hh*i/4);c.stroke()}
  c.restore()}}
function drawWaterFront(vx0,vx1){const Wd=WORLDS[LEVELS[G.li].w];
 for(const r of waterRuns(vx0,vx1)){const y0=r.t*TS,y1=(r.e+1)*TS;c.fillStyle='rgba(40,140,200,.16)';c.fillRect(r.x0,y0+6,r.x1-r.x0+0.6,y1-y0-6);
  if(!r.open)continue;
  c.beginPath();c.moveTo(r.x0,y0+10);for(let x=r.x0;x<=r.x1;x+=8){c.lineTo(x,y0+Math.sin(x*0.06+G.t*2.6)*2.6+Math.sin(x*0.021-G.t*1.3)*2)}c.lineTo(r.x1,y0+10);c.closePath();
  const g=c.createLinearGradient(0,y0-4,0,y0+10);g.addColorStop(0,'rgba(255,255,255,.75)');g.addColorStop(1,'rgba(140,220,255,.25)');c.fillStyle=g;c.fill();
  c.strokeStyle='rgba(255,255,255,.9)';c.lineWidth=2;c.beginPath();for(let x=r.x0;x<=r.x1;x+=8){const v=y0+Math.sin(x*0.06+G.t*2.6)*2.6+Math.sin(x*0.021-G.t*1.3)*2;x===r.x0?c.moveTo(x,v):c.lineTo(x,v)}c.stroke();
  c.fillStyle='rgba(255,255,255,.8)';for(let x=r.x0+10;x<r.x1;x+=34){const ph=(G.t*0.8+hsh(x|0,1))%1;if(ph<0.5){c.fillRect(x+Math.sin(G.t+x)*6,y0+5+ph*6,8*(1-ph*2),1.6)}}}}
/* Pip the sea turtle (cutout rig: body + 4 rotating flippers) */
function pipFlip(n,rx,ry,a,dark){const im=dark?tinted(n,'rgba(0,30,20,.38)'):IMG[n];if(!im)return;c.save();c.translate(rx,ry);c.rotate(a);c.drawImage(im,-im.width/2,-im.height*0.08);c.restore()}
function drawPip(x,y,face,ph,amp,swim,pitch,alpha=1){const im=IMG.pip_body;if(!im)return;const f=0.5,w=im.width,h=im.height,t=ph*TAU;
 c.save();if(alpha<1)c.globalAlpha*=alpha;c.translate(x,y);c.scale(face<0?-f:f,f);c.rotate(pitch||0);c.translate(-w/2,-h);
 let fa,fb,ra,rb,bob;
 if(swim){fa=0.6+1.0*amp*Math.sin(t);fb=0.6+1.0*amp*Math.sin(t+0.7);ra=1.1+0.35*amp*Math.sin(t+1.4);rb=1.1+0.35*amp*Math.sin(t+2.1);bob=Math.sin(t*2)*2*amp}
 else{fa=0.12+0.5*amp*Math.sin(t);fb=0.12+0.5*amp*Math.sin(t+Math.PI);ra=0.25+0.4*amp*Math.sin(t+Math.PI);rb=0.25+0.4*amp*Math.sin(t);bob=-Math.abs(Math.sin(t))*4*amp}
 pipFlip('pip_bf',w*0.24,h*0.78+bob,rb,true);pipFlip('pip_ff',w*0.64,h*0.74+bob,fb,true);
 c.drawImage(im,0,bob);
 pipFlip('pip_bf',w*0.19,h*0.82+bob,ra,false);pipFlip('pip_ff',w*0.58,h*0.79+bob,fa,false);
 c.restore();return{w,h,bob}}
function updPip(dt){const p=G.p;if(!p)return;if(!G.pip)G.pip={x:p.x-70,y:p.y,face:1,ph:0,amp:0,swim:0,vx:0};const q=G.pip;
 if(p.mode==='swim'||p.dead){q.hide=p.mode==='swim'?1:q.hide;if(p.mode==='swim'){q.x=p.x;q.y=p.y;q.face=p.face}return}q.hide=0;
 if(Math.abs(q.x-p.x)>500){q.x=p.x-p.face*90;q.y=p.y}
 const tx=p.x-p.face*80,d=tx-q.x,sp=Math.min(Math.abs(d)*3.2,340);q.vx=Math.abs(d)>8?sgn(d)*sp:0;q.x+=q.vx*dt;q.face=Math.abs(q.vx)>12?sgn(q.vx):p.face;
 const col=Math.floor(q.x/TS),wt=waterTop(col);let gy=null;for(let y=Math.max(0,Math.floor((p.y-TS)/TS));y<ROWS;y++){const k=tileAt(col,y);if(k===6)break;if(solidK(k)||k===2){gy=y*TS;break}}
 if(wt!==null&&(gy===null||wt<gy)){q.swim=1;q.ty=wt+SWF}else{q.swim=0;q.ty=gy===null?q.y:gy}
 q.y+=(q.ty-q.y)*Math.min(1,dt*(q.ty<q.y?9:14));
 const mv=Math.abs(q.vx)>12;q.amp+=((mv?1:0.15)-q.amp)*Math.min(1,dt*6);q.ph=(q.ph+dt*(mv?Math.min(1.5,Math.abs(q.vx)/220):0.35))%1}
function drawPipFollower(q){if(q.swim){drawPip(q.x,q.y+4,q.face,q.ph,q.amp,true,Math.sin(G.t*2)*0.03)}else{c.fillStyle='rgba(0,0,0,.22)';c.beginPath();c.ellipse(q.x,q.y,40,6,0,0,TAU);c.fill();drawPip(q.x,q.y-25,q.face,q.ph,q.amp,false,0)}}
function drawSwimmer(p){const mv=Math.abs(p.vx)>20||p.under;p._pph=((p._pph||0)+(G.dtR||0.016)*(p.ram>0?3:mv?1.4:0.55))%1;const amp=p.ram>0?0.4:mv?1:0.45;
 const pitch=p.under?clamp(p.vy/700,-0.35,0.35)*(p.face):(p.air?clamp(p.vy/1400,-0.25,0.25)*p.face:Math.sin(G.t*2.4)*0.03);
 const yy=p.y+4;const im=IMG.pip_body;if(!im)return;const w=im.width,h=im.height,f=0.5;
 c.save();c.translate(p.x,yy);c.scale(p.face<0?-f:f,f);c.rotate(p.face<0?-pitch:pitch);
 /* rider on the shell */
 const rn=p.tng>0?'rd_tongue':p.ram>0?'rd_ram':p.under?'rd_dive':'rd_idle',ri=IMG[rn];
 const t=p._pph*TAU,bob=Math.sin(t*2)*2*amp;
 c.translate(-w/2,-h);
 /* flippers + body (inline so the rider rides the same transform) */
 const fa=0.6+1.0*amp*Math.sin(t),fb=0.6+1.0*amp*Math.sin(t+0.7),ra=1.1+0.35*amp*Math.sin(t+1.4),rb=1.1+0.35*amp*Math.sin(t+2.1);
 pipFlip('pip_bf',w*0.24,h*0.78+bob,rb,true);pipFlip('pip_ff',w*0.64,h*0.74+bob,fb,true);
 if(ri){const rx=w*0.38,ry=h*0.42+bob+Math.sin(t*2+0.6)*1.5;c.save();c.translate(rx,ry);c.scale(RDS,RDS);c.drawImage(ri,-ri.width*0.46,-ri.height);
  if(p.under){/* bubble helmet */const hx=-ri.width*0.46+ri.width*0.74,hy=-ri.height*0.78;c.fillStyle='rgba(200,245,255,.18)';c.strokeStyle='rgba(235,252,255,.85)';c.lineWidth=3;c.beginPath();c.arc(hx,hy,38,0,TAU);c.fill();c.stroke();c.strokeStyle='rgba(255,255,255,.9)';c.lineWidth=4;c.beginPath();c.arc(hx,hy,30,-2.6,-1.9);c.stroke()}c.restore()}
 c.drawImage(im,0,bob);
 pipFlip('pip_bf',w*0.19,h*0.82+bob,ra,false);pipFlip('pip_ff',w*0.58,h*0.79+bob,fa,false);
 c.restore();
 if(p.tng>0&&p.tngT){const hp=headPt(p),o=p.tngT.o,k=1-Math.abs(p.tng-0.15)/0.15,tx=lerp(hp.x,o.x,k),ty=lerp(hp.y+14,o.y,k);c.strokeStyle='#e8507a';c.lineWidth=6;c.lineCap='round';c.beginPath();c.moveTo(hp.x+p.face*6,hp.y+16);c.lineTo(tx,ty);c.stroke();c.fillStyle='#ff7aa0';c.beginPath();c.arc(tx,ty,6,0,TAU);c.fill()}
 if(p.ram>0){c.strokeStyle='rgba(220,250,255,.7)';c.lineWidth=3;for(let i=0;i<3;i++){c.beginPath();c.moveTo(p.x-p.face*(50+i*16),p.y-20-i*12);c.lineTo(p.x-p.face*(80+i*16),p.y-20-i*12);c.stroke()}}}
/* crab: legless body art + 8 jointed legs that really step */
function drawCrab(e,x,y,sc){const b=IMG.crab_body,lg=IMG.crab_leg;if(!b||!lg){spr('crab1',x,y,sc);return}
 const rdt=clamp(e.t-(e._lt===undefined?e.t:e._lt),0,0.1);e._lt=e.t;if(e._rph===undefined)e._rph=(e.x*0.017)%1;const v=Math.abs(e.vx||0);if(v>3)e._rph=(e._rph+Math.min(1.4,v/30)*rdt)%1;
 const t=e._rph*TAU,amp=v>3&&!e.dying?1:0.2,f=0.5*sc,bw=b.width,bh=b.height,bob=amp*1.5*Math.abs(Math.sin(t*2));
 c.save();c.translate(x,y-bob);c.scale(f,f);
 for(const side of [-1,1])for(let i=0;i<4;i++){const ph=t+((i+(side>0?1:0))%2)*Math.PI,base=0.72+i*0.17,a=-side*(base+0.24*amp*Math.sin(ph)),lift=Math.max(0,Math.cos(ph))*amp*4;
  c.save();c.translate(side*bw*(0.18+i*0.05),-14-bh*0.34+i*2-lift);c.rotate(a);c.drawImage(lg,-lg.width/2,-lg.width*0.25);c.restore()}
 const claw=Math.sin(e.t*5)*0.05;c.rotate(claw);c.drawImage(b,-bw/2,-bh-14);c.restore()}
function drawJelly(e){const im=IMG.jelly;if(!im)return;const pu=Math.sin(e.t*4),sx=1+0.08*pu,sy=1-0.1*pu;const y=e.y;
 c.save();c.lineCap='round';for(let i=0;i<5;i++){const bx0=e.x-12+i*6;c.strokeStyle=i%2?'rgba(220,140,240,.9)':'rgba(255,170,220,.9)';c.lineWidth=3;c.beginPath();c.moveTo(bx0,y-6);for(let k=1;k<=5;k++)c.lineTo(bx0+Math.sin(e.t*3+i+k*0.8)*4*k/5,y-6+k*6+(1-pu)*1.5);c.stroke()}c.restore();
 c.save();c.translate(e.x,y-2);c.scale(sx,sy);spr('jelly',0,0,1,e.face>0);c.restore()}
function drawUrchin(e,fl){const v=Math.abs(e.vx||0);c.save();c.strokeStyle='#2a1038';c.lineWidth=2.5;c.lineCap='round';for(let i=0;i<4;i++){const ph=e.t*7+i*1.6,fx=e.x-12+i*8;c.beginPath();c.moveTo(fx,e.y-4);c.lineTo(fx+Math.sin(ph)*3*(v>2?1:0.3),e.y+1);c.stroke()}c.restore();
 const br=1+Math.sin(e.t*3)*0.04;spr('urchin',e.x,e.y+1,br,fl,1,Math.sin(e.t*4)*0.05)}
function drawFish(e,fl){const im=IMG[e.v?'fish2':'fish1'];if(!im)return;const f=0.5,w=im.width,h=im.height,cut=Math.round(w*0.58),wag=Math.sin(e.t*11)*0.32;
 c.save();c.translate(e.x,e.y-h*f*0.5);c.scale(fl?-f:f,f);c.translate(-w/2,-h/2);
 /* tail half (art faces left: tail is the right part) swings around the joint */
 c.save();c.translate(cut,h/2);c.rotate(wag);c.drawImage(im,cut,0,w-cut,h,0,-h/2,w-cut,h);c.restore();
 c.drawImage(im,0,0,cut+1,h,0,0,cut+1,h);c.restore()}

/* ===== menus (DOM) ===== */
const ui=$('ui');
function show(html,cls=''){ui.innerHTML='<div class="scr '+cls+'">'+html+'</div>';document.body.classList.add('uiopen');gpIdx=0;
 ui.querySelectorAll('[data-a]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();AU.unlock();AU.fx('menu');act(b.dataset.a,b.dataset.v)}));
 if(GP.on||kbUsed)setTimeout(()=>gpFocus(0,1),30);$('bgart').hidden=!(cls.includes('title')||cls.includes('menu'))}
let kbUsed=false;addEventListener('keydown',()=>kbUsed=true,{once:true});
function hideUI(){ui.innerHTML='';document.body.classList.remove('uiopen');$('bgart').hidden=true}
function ctlLine(){return GP.on?'🎮 Controller: stick/D-pad move · A jump · X action · Y ram · Start pause':'Swipe &amp; hold anywhere to move · swipe up to jump · tap ACTION'}
function refreshCtlHint(){const h=document.querySelector('#ui .ctl');if(h)h.innerHTML=ctlLine()}
function titleScreen(){state='title';AU.music('title');const cont=save.reached>0;
 show(`<div class="logo"><div class="l1">KELLY'S</div><div class="l2">GIRAFFE ADVENTURE</div><div class="l3">VOL. 4 · OCEAN GIRAFFE</div></div>
 <div class="tbtns"><button class="btn go" data-a="play">▶ ${cont?'CONTINUE':'PLAY'}</button>${cont?'<button class="btn alt" data-a="new">NEW GAME</button>':''}
 <button class="btn alt" data-a="levels">LEVELS</button><button class="btn alt2" data-a="how">HOW TO PLAY</button></div>
 <p class="tag">Team up with Pip the sea turtle! Swim, dive and ram through 8 levels and 4 sea bosses to save Peter and his birthday present!</p>${save.best?'<p class="sub">Best score: '+save.best.toLocaleString()+'</p>':''}<p class="ctl sub">${ctlLine()}</p><div class="studio"><img src="art/logo589.webp?v=${VERSION}" alt="five8nine"></div>`,'title')}
/* story pages: every page has SKIP (jumps straight past the whole story) */
const STORY={1:[['story1','<b>Oh no!</b> Peter was setting up a birthday beach picnic for Kelly when <b>Captain Crab</b> popped out of the waves, scooped Peter up in a net and ran off with <b>Kelly\'s birthday present</b>!'],['story2','Kelly\'s giraffe can\'t swim very far... but <b>Pip the sea turtle</b> can! "Hop on my shell," says Pip. "His ship went that way!" Together they set off across the sea.']],
 2:[['story3','Past the tide pools lie the glowing <b>Coral Caves</b>. Pip dives deep, the giraffe holds her breath in a bubble, and far ahead they spot the red sails of <b>Captain Crab\'s ship</b>. Hang on, Peter!']],
 3:[['story4','<b>You did it!</b> Captain Crab is beaten, Peter is free, and the present is safe and sound. Pip brought balloons, Peter brought cake, and even Captain Crab says sorry. <b>YOU DID IT, KELLY!</b> 🎂🦒🐢']]};
let storyCtx=null;
function storyScreen(i,next,pg=0){state='story';storyCtx={i,next,pg};const pages=STORY[i],P=pages[pg],last=pg>=pages.length-1;
 show(`<div class="storyx"><button class="btn dim skip" data-a="skipstory">SKIP ▶▶</button><img class="story" src="art/${P[0]}.webp?v=${VERSION}" alt=""><p class="big">${P[1]}</p><div class="btns"><button class="btn go" data-a="${last?next:'storynext'}">${last&&i===3?'THE END':'NEXT ▶'}</button></div></div>`,'menu');AU.music(i===3?'bday':'title')}
function levelsScreen(){state='levels';let h='<h2>LEVELS</h2><div class="lvls">';LEVELS.forEach((L,i)=>{const lock=i>save.reached;const st=save.stars[i]||[];const sn=[0,1,2].map(k=>st[k]?'★':'☆').join('');const bs=L.ch.find(x=>x.startsWith('boss:'));
  h+=`<button class="btn lv ${lock?'dim':''}" data-a="${lock?'locked':'lvl'}" data-v="${i}"><span class="n">World ${L.w+1}-${i%2+1}</span> ${L.name}${bs?' <small>· BOSS</small>':''}<span class="st">${lock?'🔒':sn}</span></button>`});
 show(h+'</div><button class="btn alt" data-a="back">◀ BACK</button>','menu')}
function howScreen(){state='how';show(`<h2>HOW TO PLAY</h2><ul class="how">
 <li><b>Move:</b> swipe and hold anywhere (let go to stop). <b>Swipe up</b> or tap <b>JUMP</b> to jump. Hold JUMP to go higher.</li>
 <li><b>Ride Pip:</b> hop into the water and you land on Pip's shell. Swim left and right, tap <b>JUMP</b> to leap out onto the rocks or sand.</li>
 <li><b>DIVE</b> (top button) only works while riding Pip. Tap it to dive under the water and swim under rock walls. Swipe up/down to steer, swipe up to come back up.</li>
 <li><b>ACTION</b> on land: tap for a HEAD BONK, double-tap for a NECK RAM (smashes barnacle rocks). On Pip: tap for a <b>SHELL DASH</b> that smashes cracked coral.</li>
 <li>Near seaweed, watermelon, crabs or gems: tap ACTION and your long <b>TONGUE</b> slurps them up!</li>
 <li>Cliff too tall? Jump at it and hold <b>UP</b> to <b>NECK GRAB</b> the edge. Life ring? Jump and tap ACTION to <b>SWING</b>.</li>
 <li>Collect sea-glass gems (100 = extra life) and 3 gold stars in every level. Never stomp jellyfish, sea urchins or puffed-up pufferfish!</li>
 <li><b>Bosses:</b> wait till they are dizzy, then RAM or STOMP for big damage.</li>
 <li>🎮 <b>Controllers:</b> stick or D-pad to move, A jump, X or B action, Y dive, Start pause. Keys: arrows/WASD, Z or Space jump, X action, V or Shift dive, P pause, M sound.</li></ul><button class="btn alt" data-a="back">◀ BACK</button>`,'menu')}
function pauseGame(){if(state!=='play')return;state='pause';clearInput();show(`<h2>PAUSED</h2><p>${LEVELS[G.li].name}</p><button class="btn go" data-a="resume">▶ RESUME</button><button class="btn alt" data-a="restart">RESTART LEVEL</button><button class="btn alt2" data-a="how2">HOW TO PLAY</button><button class="btn dim" data-a="quit">QUIT TO TITLE</button>`)}
function resumeGame(){hideUI();state='play';clearInput();AU.music(G.boss&&G.boss.st!=='dead'?'boss':WORLDS[LEVELS[G.li].w].song)}
function clearScreen(){state='clear';const L=LEVELS[G.li],n=G.lvStars.filter(Boolean).length;AU.music('win');
 show(`<h2>${G.L.boss?'BOSS BEATEN!':'LEVEL CLEAR!'}</h2><p class="big">${L.name}</p><table class="st"><tr><td>Gems</td><td>${G.lvGems}</td></tr><tr><td>Gold stars</td><td>${'★'.repeat(n)}${'☆'.repeat(3-n)}</td></tr><tr><td>Score</td><td>${G.score.toLocaleString()}</td></tr></table>
 <button class="btn go" data-a="next">NEXT ▶</button><button class="btn dim" data-a="quit">TITLE</button>`)}
function overScreen(){state='over';AU.stop();AU.fx('over');if(G.score>save.best){save.best=G.score;persist()}
 show(`<h2>GAME OVER</h2><p class="big">Score: ${G.score.toLocaleString()}</p><p>Pip believes in you! Try this level again?</p><button class="btn go" data-a="retry">TRY AGAIN</button><button class="btn dim" data-a="quit">TITLE</button>`)}
function winScreen(){state='win';AU.music('bday');if(G.score>save.best){save.best=G.score;persist()}save.won=1;persist();
 show(`<h2>YOU DID IT, KELLY!</h2><p class="big">🎂 Peter and the present are saved! 🎁</p><img class="story" src="art/story4.webp?v=${VERSION}" alt=""><p class="big">Final score: ${G.score.toLocaleString()}</p><p>Gold stars: ${Object.values(save.stars).reduce((a,s)=>a+(s||[]).filter(Boolean).length,0)} / 24</p><button class="btn go" data-a="again">PLAY AGAIN</button><button class="btn alt" data-a="levels">LEVELS</button><button class="btn dim" data-a="quit">TITLE</button>`,'menu')}
function act(a,v){
 if(a==='play'){if(save.reached>0)newGame(save.reached);else{storyScreen(1,'start1')}}
 else if(a==='new'){save.reached=0;persist();storyScreen(1,'start1')}
 else if(a==='start1')newGame(0);
 else if(a==='levels')levelsScreen();else if(a==='how')howScreen();else if(a==='how2'){howScreen();state='pause';ui.querySelector('[data-a="back"]').dataset.a='pauseback';ui.querySelector('[data-a="pauseback"]').addEventListener('click',()=>{state='play';pauseGame()})}
 else if(a==='back')titleScreen();else if(a==='pauseback'){}
 else if(a==='lvl')newGame(+v);else if(a==='locked')toast('Beat the level before it to unlock!');
 else if(a==='resume')resumeGame();else if(a==='restart'){hideUI();startLevel(G.li,G.levelStart)}
 else if(a==='quit'){G=null;titleScreen()}
 else if(a==='storynext'){storyScreen(storyCtx.i,storyCtx.next,storyCtx.pg+1)}
 else if(a==='skipstory'){act(storyCtx.next)}
 else if(a==='next'){if(G.li===3&&!G.storyDone)storyScreen(2,'next2');else if(G.finale)storyScreen(3,'win');else if(G.li+1<LEVELS.length)startLevel(G.li+1);else winScreen()}
 else if(a==='next2'){G.storyDone=1;startLevel(G.li+1)}
 else if(a==='win')winScreen();
 else if(a==='retry'){G.lives=5;G.score=G.levelStart.score;startLevel(G.li,G.levelStart)}
 else if(a==='again'){save.reached=0;persist();storyScreen(1,'start1')}}
function toggleMute(){AU.setMuted(!AU.muted);save.muted=AU.muted;persist();$('bMute').textContent=AU.muted?'🔇':'🔊';toast(AU.muted?'Sound off':'Sound on',900)}
$('bMute').addEventListener('click',e=>{e.stopPropagation();AU.unlock();toggleMute()});$('bPause').addEventListener('click',e=>{e.stopPropagation();pauseGame()});

/* ===== game flow + loop ===== */
function newGame(li){G={score:0,lives:5,gems:0,deaths:0};startLevel(li)}
function startLevel(li,snap){const keep=G||{score:0,lives:5,gems:0,deaths:0};if(snap){keep.score=snap.score;keep.gems=snap.gems}
 const L=buildLevel(li);G=Object.assign({},{score:keep.score,lives:keep.lives,gems:keep.gems,deaths:keep.deaths||0,storyDone:keep.storyDone||li>3},{li,L,t:0,ents:[],shots:[],parts:[],texts:[],cam:{x:0,y:0},shake:0,hs:0,flash:null,boss:null,arena:null,cp:null,won:0,lvGems:0,lvStars:[0,0,0],banner:2.6,camDx:0,slow:0,finale:0});
 G.levelStart={score:G.score,gems:G.gems};const lv=LEVELS[li];G.p=newPlayer(3*TS,9*TS,'ride');G.pip=null;G.p.hp=G.p.maxhp=lv.w>=2?4:3;spawnEnts();camUpdate(0,true);
 hideUI();state='play';clearInput();AU.music(WORLDS[lv.w].song)}
function openCage(){const cg=G.L.cage;cg.open=1;AU.fx('free');burst(cg.x,cg.y-60,30,['#c8a060','#8a6a30','#ffe060'],320,0.9,5,900);shake(10);G.free={x:cg.x,y:cg.y,face:-1};G.cut=2.4;ftxt(cg.x,cg.y-150,'JINXY IS FREE!','#7aff7a',1)}
function levelClear(){if(G.won)return;G.won=1;G.wonT=G.finale?3.2:G.L.boss?0.6:1.4;AU.fx('clear');const st=save.stars[G.li]||[];G.lvStars.forEach((v,i)=>{if(v)st[i]=1});save.stars[G.li]=st;save.reached=Math.max(save.reached,Math.min(LEVELS.length-1,G.li+1));if(G.score>save.best)save.best=G.score;persist();
 for(let i=0;i<4;i++)setTimeout(()=>G&&G.p&&stars(G.p.x+rand(-60,60),G.p.y-rand(60,140),10),i*200)}
function respawn(){G.lives--;if(G.lives<=0){G.lives=0;overScreen();return}const p=G.p,cp=G.cp;const np=newPlayer(cp?cp.x:3*TS,cp?cp.y:9*TS,'ride');np.maxhp=p.maxhp;np.hp=p.maxhp;np.inv=2;
 if(G.boss&&G.boss.st!=='dead'){np.x=G.arena.x0+60;np.y=G.L.boss.y;G.shots.length=0;const b=G.boss;if(b.k!=='vex'&&b.k!=='bab'){b.st='idle';b.y=b.gy;b.vy=0;b.x=G.arena.x1-160}b.t=0}
 G.p=np;G.pip=null;G.shots=G.shots.filter(s=>Math.abs(s.x-np.x)>300);camUpdate(0,true)}
function update(dt){G.t+=dt;frame++;const p=G.p;{const sw=p.mode==='swim';if(sw!==update._sw){update._sw=sw;const b=$('bDive');if(b)b.classList.toggle('off',!sw)}}G.banner=Math.max(0,G.banner-dt);G.bossIntro=Math.max(0,(G.bossIntro||0)-dt);G.shake=Math.max(0,G.shake-dt*30);if(G.flash)G.flash.a-=dt*2;G.combo=Math.max(0,(G.combo||0)-dt);
 if(G.cut){G.cut-=dt;const f=G.free;if(f){f.x+=(p.x-f.x)*dt*1.5;f.face=sgn(p.x-f.x)}if(G.cut<=0.8&&p.mode==='foot'){setMode(p,'ride');p.hp=p.maxhp=3;G.free=null;stars(p.x,p.y-60,20);AU.fx('star');ftxt(p.x,p.y-130,'HOP ON, KELLY!','#ffe060',1)}if(G.cut<=0){G.cut=0;levelClear()}}
 if(!G.won||G.wonT>0)updatePlayer(p,dt);
 if(p.dead){G.deadT-=dt;if(G.deadT<=0){respawn();if(state!=='play')return}}
 if(G.L.boss&&!G.boss&&!G.won&&p.x>G.L.boss.x0+140)startBoss();
 updEnemies(dt);updShots(dt);updBoss(dt);updItems(dt);updPip(dt);
 for(const q of G.parts){q.l-=dt;q.vy+=q.g*dt;q.x+=q.vx*dt;q.y+=q.vy*dt}G.parts=G.parts.filter(q=>q.l>0);
 for(const t of G.texts){t.l-=dt;t.y-=40*dt}G.texts=G.texts.filter(t=>t.l>0);
 const ox=G.cam.x;camUpdate(dt);G.camDx=G.cam.x-ox;
 if(G.finale&&G.won&&!SIM&&Math.random()<0.35)burst(G.cam.x+Math.random()*viewW,G.cam.y+20,4,['#ff6aa8','#ffd23a','#7ad0ff','#7aff7a','#fff'],120,1.6,6,260);
 if(G.won){G.wonT-=dt;if(G.wonT<=0&&state==='play'){clearScreen()}}}
let last=performance.now(),acc=0;
function loop(now){requestAnimationFrame(loop);let dt=Math.min(0.05,(now-last)/1000);last=now;if(window.__FIXDT)dt=window.__FIXDT;
 if(state==='play'&&G){for(let k=0;k<(window.__SPEED||1)&&state==='play';k++){readInput();let d=dt;if(G.hs>0){G.hs-=dt;d=0}if(G.slow>0){G.slow-=dt;d*=0.35}const n=d>1/60?2:1;for(let i=0;i<n;i++)update(d/n);G.dtR=dt}}else if(state!=='play')pollPad();
 render()}

/* physics look-ahead planner for the QA bot: simulates the real player code with candidate inputs */
function simRun(p0,plan,frames){const save={};for(const k in inp)save[k]=inp[k];SIM=1;const p=Object.assign({},p0);p.swing=null;p.atkHit=new Set();let best=p.x,ok=true,hurt=0;
 for(let f=0;f<frames;f++){const a=plan(f);inp.L=a.L||0;inp.R=a.R||0;inp.U=0;inp.D=0;inp.jumpP=a.jp||0;inp.jump=a.j||0;inp.actP=0;inp.act=0;inp.ramP=0;
  updatePlayer(p,1/60);if(p.dead){ok=false;break}if(p.simHurt){hurt=1;ok=false;break}best=Math.max(best,p.x)}
 SIM=0;for(const k in save)inp[k]=save[k];return{ok,x:best,end:p,onG:p.onG}}
function planJump(p){const C=[];C.push({n:'run',f:()=>({R:1}),hold:0});for(const h of[6,12,20,32])for(const d of[0,4,9,15])C.push({n:'j'+h+'d'+d,d,h,f:fr=>({R:1,jp:fr===d?1:0,j:fr>=d&&fr<d+h?1:0})});
 C.push({n:'back',f:fr=>fr<14?{L:1}:{R:1,jp:fr===22?1:0,j:fr>=22&&fr<54?1:0}});
 let best=null;for(const c of C){const r=simRun(p,c.f,95);if(!r.ok)continue;const sc=r.x-(c.n==='run'?0:6)-(c.d||0)*0.5+(r.onG?20:0);if(!best||sc>best.sc)best={c,sc,r}}return best}
/* ===== QA autopilot (only when window.__BOT is set by the test harness) ===== */
const BOT={hold:0,wait:0,swingRel:0,lastX:0,stuck:0,ramT:0};
function botInput(){const p=G.p,o={L:0,R:0,U:0,D:0,J:0,Jh:0,A:0,Y:0,V:0};if(p.dead||G.cut||G.won)return o;const ride=p.mode==='ride';const fx=p.x,fy=p.y;const tx=Math.floor(fx/TS),ty=Math.floor((fy-1)/TS);
 const groundAt=cx=>{for(let y=Math.max(0,ty-5);y<ROWS;y++){const k=tileAt(cx,y);if(solidK(k)||k===2)return y;if(k===6||k===5&&y>=ty)return k===5?-y:99}return 99};
 /* boss mode */
 if(G.boss&&G.boss.st!=='dead'){const b=G.boss,d=b.x-p.x,ad=Math.abs(d);
  for(const s of G.shots){if(s.k==='wave'&&Math.abs(s.x-p.x)<110&&sgn(p.x-s.x)===sgn(s.vx)&&p.onG){o.J=1;o.Jh=1}
   if(s.k!=='wave'&&Math.hypot(s.x-p.x,s.y-(p.y-40))<140&&s.vy>0&&p.onG&&BOT.ramT<=0&&ride){o.A=1;BOT.ramT=0.2}}
  BOT.ramT-=1/60;
  if(b.st==='dizzy'){if(ad>90){o[d>0?'R':'L']=1}if(ad<170&&p.onG&&BOT.ramT<=0){if(ride){o.Y=1;BOT.ramT=0.4}else o.A=1}if(b.k==='bab'&&p.onG&&ad<60){o.J=1;o.Jh=1}}
  else{const want=b.k==='bab'||b.k==='vex'?0:260;const A=G.arena;let goal=p.x;if(ad<want)goal=b.x+(b.x>(A.x0+A.x1)/2?-want-40:want+40);
   if(b.k==='vex'){goal=b.x+(b.st==='tele'?(d>0?-260:260):0);if(b.st==='dive')goal=p.x+(b.vx>0?-200:200)}
   if(b.k==='bab'){goal=b.perch?(b.x<(A.x0+A.x1)/2?A.x1-120:A.x0+120):p.x;if(!b.perch&&b.st!=='climb'&&ad<240)goal=b.x+(d>0?-300:300)}
   if(b.k==='croc'){const pool0=A.x0+10*TS,pool1=A.x0+17*TS;if(b.st==='dive'||b.st==='leap'){goal=p.x<(pool0+pool1)/2?A.x0+80:A.x1-80}else if(ad<240)goal=b.x+(d>0?-300:300);goal=goal>pool0-60&&goal<pool1+60?(p.x<pool0?pool0-80:pool1+80):goal}
   if((b.k==='tusk'&&b.st==='charge'||b.k==='cak'&&b.st==='leap')&&ad<200&&sgn(b.vx||-d)===sgn(-d)&&p.onG){o.J=1;o.Jh=1}
   goal=clamp(goal,A.x0+40,A.x1-40);if(Math.abs(goal-p.x)>20)o[goal>p.x?'R':'L']=1}
  if(!p.onG&&BOT.hold>0){o.Jh=1;BOT.hold--}if(o.J)BOT.hold=14;return o}
 if(p.mode==='swim')return botSwim(o,p);
 /* swinging */
 if(p.swing){BOT.plan=null;const s=p.swing;o.R=1;if(BOT.sw!==s){BOT.sw=s;BOT.swf=0}BOT.swf++;if(BOT.swf<10)return o;const nextH=G.L.hooks.find(h=>h.x>s.h.x+40&&h.x-s.h.x<330);if(s.a<-0.15&&s.av>0&&nextH&&Math.abs(nextH.x-p.x)<240&&p.x>s.h.x-10){o.J=1;BOT.grab=1}else if(!nextH&&s.a>0.25&&s.av>0){o.J=1}else if(nextH&&s.a>0.35&&s.av>0){o.J=1;BOT.grab=1}return o}
 o.R=1;
 /* executing a committed plan */
 if(BOT.plan&&ride){const hk=nearHook(p);const gc=groundAt(Math.floor(p.x/TS));if(hk&&hk.x>p.x-20&&!p.onG&&(gc===99||gc>=ROWS-1)){BOT.plan=null;BOT.grab=1}}
 if(BOT.plan){const f=BOT.pf++;const a=BOT.plan(f);o.R=a.R||0;o.L=a.L||0;if(a.jp)o.J=1;o.Jh=a.j?1:0;if(f>=BOT.plen||(f>4&&p.onG&&BOT.pj&&f>BOT.pjf)){BOT.plan=null}else{botCombat(o,p,ride);return o}}
 if(!p.onG){if(BOT.hold>0){o.Jh=1;BOT.hold--}
  if(ride){const hk=nearHook(p);const gc=groundAt(Math.floor(p.x/TS));if(hk&&hk.x>p.x-20&&(BOT.grab||BOT.needHook||((gc===99||gc>=ROWS-1)&&p.vy>-100))){o.A=1;BOT.grab=0;BOT.needHook=0}}
  return o}
 BOT.grab=0;
 if(G.L.cage&&!G.L.cage.open&&G.L.cage.x-p.x<110){o.R=1;BOT.pc=(BOT.pc||0)+1;if(BOT.pc%14===0)o.A=1;return o}
 const ftx=Math.floor((p.x+p.w/2+8)/TS);let gapW=0;for(let i=0;i<12;i++){const g=groundAt(ftx+i);if(g===99||g>=ROWS-1||g<0||g>ty+3)gapW++;else if(gapW)break;else if(i>2)break}
 const front=Math.floor((p.x+p.w/2+6)/TS);let wallH=0,wallK=0;for(let y=ty;y>=Math.max(0,ty-6);y--){const k=tileAt(front,y);if(solidK(k)){wallH++;wallK=k}else if(wallH)break;else if(y<ty-1)break}
 const hasHook=G.L.hooks.some(h=>h.x>p.x&&h.x-p.x<300);
 if(ride&&wallH>=3&&(wallK===3||wallK===4)){o.Y=1;return o}
 if(ride&&gapW>5&&hasHook){BOT.plan=null;if(gapW<=7||ftx*TS-p.x<p.w){o.J=1;o.Jh=1;BOT.hold=24;BOT.needHook=1}return o}
 const pl=planJump(p);if(pl){BOT.plan=pl.c.f;BOT.pf=0;BOT.plen=pl.c.n==='run'?8:Math.min(95,(pl.c.d||0)+(pl.c.h||32)+60);BOT.pj=pl.c.n!=='run';BOT.pjf=(pl.c.d||0)+6;const a=BOT.plan(BOT.pf++);o.R=a.R||0;o.L=a.L||0;if(a.jp)o.J=1;o.Jh=a.j?1:0}
 else{o.J=1;o.Jh=1;BOT.hold=30}
 botCombat(o,p,ride);
 if(Math.abs(p.x-BOT.lastX)<0.5){BOT.stuck++;if(BOT.stuck>60){o.J=1;o.Jh=1;BOT.hold=30;if(ride&&BOT.stuck%80===61)o.Y=1}}else BOT.stuck=0;BOT.lastX=p.x;
 return o}
function botSwim(o,p){o.R=1;const tx=Math.floor(p.x/TS),srow=Math.floor((p.sy||p.y-SWF)/TS);let wall=null;
 for(let i=1;i<=4&&!wall;i++){const cx=Math.floor((p.x+p.w/2)/TS)+i-1;for(let y=srow-1;y<=srow+1;y++){const k=tileAt(cx,y);if(solidK(k)){const wt=waterTop(cx);wall={i,k,cx,dive:wt!==null&&wt>srow*TS,shore:wt===null,tall:solidK(tileAt(cx,srow-2))||solidK(tileAt(cx,srow-3))};break}}}
 if(wall&&wall.k===3){if(p.ram<=0&&(p.ramCd||0)<=0&&frame%6===0)o.A=1}
 else if(wall&&wall.dive){if(!p.under){if(frame%4===0)o.V=1}else o.D=1}
 else if(wall&&wall.shore){if(p.under)o.U=1;else if(wall.i<=2&&!p.air&&frame%8===0&&wall.tall){o.J=1;o.Jh=1;BOT.hold=20}}
 else if(p.under){const deep=[0,1,2,3].some(i=>{const cx=tx+i+1;for(let y=srow-1;y<srow+2;y++)if(solidK(tileAt(cx,y)))return true;return false});if(!deep)o.U=1}
 for(const e of G.ents){if(e.dead||e.k==='food')continue;const dx=e.x-p.x;if(dx<-30||dx>220||Math.abs(e.y-p.y)>110)continue;const spk=EDEF[e.k]&&EDEF[e.k].spiky||(e.k==='puff'&&e.puffed);
  if(spk){if(!p.under&&dx<180&&e.y>p.y-90){if(frame%4===0)o.V=1}else if(p.under&&Math.abs(e.y-p.y)<90){o.U=0;o.D=0;if(e.y<p.y-20)o.D=1;else o.U=1}}
  else if(dx<170&&p.ram<=0&&frame%10===0)o.A=1;break}
 if(p.air&&BOT.hold>0){o.Jh=1;BOT.hold--}
 if(Math.abs(p.x-BOT.lastX)<0.5){BOT.stuck++;if(BOT.stuck>60){if(p.under)o.U=1;else{o.J=1;o.Jh=1;BOT.hold=24}}}else BOT.stuck=0;BOT.lastX=p.x;return o}
function botCombat(o,p,ride){let foe=null;for(const e of G.ents){if(e.dead||e.k==='food')continue;const dx=e.x-p.x;if(dx>-10&&dx<(ride?160:90)&&Math.abs(e.y-p.y)<80){foe=e;break}}
 for(const s of G.shots)if(s.k==='coconut'&&Math.abs(s.x-p.x)<130&&ride)o.Y=1;
 if(foe){if(ride)o.Y=1;else if(Math.abs(foe.x-p.x)<70&&frame%8===0)o.A=1}}
/* ===== boot ===== */
resize();bindSurface(cv);bindSurface($('pad'));bindBtn($('bJump'),'jump');bindBtn($('bAct'),'act');bindBtn($('bDive'),'dive');
loadArt(f=>{const b=document.querySelector('#load .bar i');if(b)b.style.width=Math.round(f*100)+'%'}).then(()=>{$('load').remove();titleScreen()});
requestAnimationFrame(loop);
window.__G=()=>G;

