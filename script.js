var $=function(s){return document.querySelector(s)};
// Título letra por letra
var t=$('#title'),txt=t.textContent;t.textContent='';
for(var i=0;i<txt.length;i++){var s=document.createElement('span');s.className='ch';s.textContent=txt[i]===' '?'\u00a0':txt[i];s.style.setProperty('--c',[190,215,250][i%3]);s.style.transitionDelay=(i*70)+'ms';t.appendChild(s)}
setTimeout(function(){t.classList.add('go')},200);
// Reveal + progreso + fondo
var io=new IntersectionObserver(function(e){e.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');if(x.target.querySelector('#code'))typeCode()}})},{threshold:.2});
document.querySelectorAll('.rv').forEach(function(e){io.observe(e)});
addEventListener('scroll',function(){var h=document.documentElement,p=scrollY/(h.scrollHeight-innerHeight||1);$('#bar').style.width=p*100+'%'},{passive:true});
// Código en vivo
var lines=['background: #101c35;','color: #48e5ff;','border-radius: 40px;','box-shadow: 0 0 40px #8575ff;','transform: rotate(-4deg) scale(1.05);','font-size: 2rem;','letter-spacing: 4px;'],typing=false;
function typeCode(){if(typing)return;typing=true;var c=$('#code'),pv=$('#pv'),n=0,i=0,css='';c.textContent='#caja {\n';pv.style.cssText='';
(function step(){if(n>=lines.length){c.textContent+='}';setTimeout(function(){typing=false},3000);return}
var L=lines[n];if(i<L.length){c.textContent+=(i===0?'  ':'')+L[i++];setTimeout(step,35)}else{c.textContent+='\n';css+=L;pv.style.cssText=css;n++;i=0;setTimeout(step,250)}})()}
// Juego
var cv=$('#game'),cx=cv.getContext('2d'),W=340,H=420,ship={x:170},bl=[],en=[],sc=0,fr=0;
function mv(e){var r=cv.getBoundingClientRect(),p=e.touches?e.touches[0]:e;ship.x=(p.clientX-r.left)*W/r.width}
cv.addEventListener('mousemove',mv);cv.addEventListener('touchmove',function(e){e.preventDefault();mv(e)},{passive:false});
(function loop(){fr++;cx.fillStyle='#02010c';cx.fillRect(0,0,W,H);
for(var k=0;k<30;k++){cx.fillStyle='#fff6';cx.fillRect((k*97)%W,(k*53+fr*(1+k%3))%H,2,2)}
if(fr%8==0)bl.push({x:ship.x,y:380});if(fr%35==0)en.push({x:20+Math.random()*300,y:-20,r:12+Math.random()*12});
cx.fillStyle='#48e5ff';cx.beginPath();cx.moveTo(ship.x,370);cx.lineTo(ship.x-15,402);cx.lineTo(ship.x+15,402);cx.fill();
cx.fillStyle='#8575ff';bl.forEach(function(b){b.y-=7;cx.fillRect(b.x-2,b.y,4,10)});bl=bl.filter(function(b){return b.y>0});
en.forEach(function(e){e.y+=2;cx.fillStyle='#416dff';cx.beginPath();cx.arc(e.x,e.y,e.r,0,7);cx.fill();
bl.forEach(function(b){if(Math.abs(b.x-e.x)<e.r&&Math.abs(b.y-e.y)<e.r){e.dead=1;b.y=-9;sc++;$('#score').textContent=sc}})});
en=en.filter(function(e){return !e.dead&&e.y<H+30});requestAnimationFrame(loop)})();
// Música
var ac,notes=[262,294,330,349,392,440,494,523];
function tone(f){ac=ac||new (window.AudioContext||window.webkitAudioContext)();var o=ac.createOscillator(),g=ac.createGain();o.type='triangle';o.frequency.value=f;g.gain.setValueAtTime(.3,ac.currentTime);g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+.6);o.connect(g);g.connect(ac.destination);o.start();o.stop(ac.currentTime+.6)}
notes.forEach(function(f,i){var b=document.createElement('button');b.textContent='♪ '+(i+1);b.onclick=function(){tone(f)};$('#pads').appendChild(b)});
var bt=null,bi=0,seq=[0,2,4,7,4,2,5,3];
$('#beat').onclick=function(){if(bt){clearInterval(bt);bt=null;this.textContent='▶ Ritmo automático'}else{this.textContent='⏹ Parar';bt=setInterval(function(){tone(notes[seq[bi++%8]])},280)}};
// Imágenes
var ib=$('#imgbox');
function fx(){ib.style.filter='hue-rotate('+$('#hue').value+'deg) contrast('+$('#con').value+'%) blur('+$('#blur').value+'px)'}
['#hue','#con','#blur'].forEach(function(s){$(s).oninput=fx});
$('#file').onchange=function(e){var f=e.target.files[0];if(!f)return;var r=new FileReader();r.onload=function(){ib.style.backgroundImage='url('+r.result+')';ib.textContent=''};r.readAsDataURL(f)};
// Estilos
$('#acc').oninput=function(e){document.documentElement.style.setProperty('--a',e.target.value)};
$('#font').onchange=function(e){document.documentElement.style.setProperty('--f',e.target.value)};
// Rotador de roles
var R=['programador','creador de juegos','diseñador web','creador de apps'],ri=0,rc=0,rd=0;
(function tk(){var e=$('#role'),w=R[ri];if(!rd){e.textContent=w.slice(0,++rc);if(rc==w.length){rd=1;return setTimeout(tk,1400)}}else{e.textContent=w.slice(0,--rc);if(!rc){rd=0;ri=(ri+1)%R.length}}setTimeout(tk,rd?40:90)})();
// Contadores
var io2=new IntersectionObserver(function(e){e.forEach(function(x){if(x.isIntersecting&&!x.target.d){x.target.d=1;var n=+x.target.dataset.n,i=0,t=setInterval(function(){x.target.textContent=++i;if(i>=n)clearInterval(t)},250)}})});
document.querySelectorAll('.cnt').forEach(function(e){io2.observe(e)});
// Partículas con el cursor y confeti al tocar
var fc=$('#fx'),fg=fc.getContext('2d'),P=[];function rs(){fc.width=innerWidth;fc.height=innerHeight}rs();addEventListener('resize',rs);
function sp(x,y,n,v){for(var i=0;i<n;i++){var a=Math.random()*6.28,s=Math.random()*v;P.push({x:x,y:y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-1,l:1,c:Math.random()<.5?190:250})}}
function pm(e){var p=e.touches?e.touches[0]:e;sp(p.clientX,p.clientY,2,2)}
addEventListener('mousemove',pm);addEventListener('touchmove',pm,{passive:true});
addEventListener('click',function(e){sp(e.clientX,e.clientY,30,7)});
(function fl2(){fg.clearRect(0,0,fc.width,fc.height);P.forEach(function(p){p.x+=p.vx;p.y+=p.vy;p.vy+=.08;p.l-=.02;fg.fillStyle='hsla('+p.c+',100%,60%,'+Math.max(p.l,0)+')';fg.fillRect(p.x,p.y,5,5)});P=P.filter(function(p){return p.l>0});requestAnimationFrame(fl2)})();
// Modo Matrix
var mc=$('#mx'),mg=mc.getContext('2d'),dr=[];
function mr(){mc.width=innerWidth;mc.height=innerHeight;dr=[];for(var i=0;i<Math.ceil(innerWidth/16);i++)dr.push(Math.random()*40)}mr();addEventListener('resize',mr);
setInterval(function(){if(!mc.classList.contains('on'))return;mg.fillStyle='rgba(7,6,26,.12)';mg.fillRect(0,0,mc.width,mc.height);mg.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--a').trim();mg.font='15px monospace';dr.forEach(function(y,i){mg.fillText(String.fromCharCode(0x30A0+Math.random()*60),i*16,y*16);dr[i]=y*16>mc.height&&Math.random()>.97?0:y+1})},60);
$('#mxb').onclick=function(){mc.classList.toggle('on')};
// Efecto 3D en tarjetas
document.querySelectorAll('.proj').forEach(function(c){c.onmousemove=function(e){var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform='perspective(600px) rotateY('+x*16+'deg) rotateX('+-y*16+'deg) scale(1.03)'};c.onmouseleave=function(){c.style.transform=''}});
// Fondo de panales + visualizador de música + modo día/noche
var hx=$('#hx'),hc=hx.getContext('2d'),HR=32,cells=[],HC=1,HRW=1,pal='neon',mode='dark',mxp=-999,myp=-999,an=null,fd=null,ax=null,au=new Audio(),md='auto',mq=matchMedia('(prefers-color-scheme: light)');
au.loop=true;
function hb(){var d=Math.min(devicePixelRatio||1,2);hx.width=innerWidth*d;hx.height=innerHeight*d;hc.setTransform(d,0,0,d,0,0);HR=innerWidth<600?22:32;var w=HR*1.732,h=HR*1.5;HC=Math.ceil(innerWidth/w)+2;HRW=Math.ceil(innerHeight/h)+2;cells=[];for(var r=0;r<HRW;r++)for(var c=0;c<HC;c++)cells.push({x:c*w+(r%2?w/2:0)-w/2,y:r*h,c:c,r:r,n:Math.random(),v:0})}
hb();addEventListener('resize',hb);
function hex(x,y,s){hc.beginPath();for(var j=0;j<6;j++){var a=Math.PI/3*j+Math.PI/6;hc.lineTo(x+s*Math.cos(a),y+s*Math.sin(a))}hc.closePath()}
function hu(h){var r=parseInt(h.substr(1,2),16)/255,g=parseInt(h.substr(3,2),16)/255,b=parseInt(h.substr(5,2),16)/255,M=Math.max(r,g,b),m=Math.min(r,g,b),d=M-m;if(!d)return 0;var x=M==r?((g-b)/d)%6:M==g?(b-r)/d+2:(r-g)/d+4;return(x*60+360)%360}
addEventListener('pointermove',function(e){mxp=e.clientX;myp=e.clientY});
(function hl(){var L=mode=='light',D=document.documentElement,p=scrollY/Math.max(1,D.scrollHeight-innerHeight),T=performance.now()/1000,h0=hu($('#acc').value),pl=an&&!au.paused;
hc.clearRect(0,0,innerWidth,innerHeight);if(pl)an.getByteFrequencyData(fd);
for(var i=0;i<cells.length;i++){var k=cells[i],th=k.r/HRW*.7+k.n*.2,up=Math.min(1,Math.max(0,(p*1.6+.1-th)*3)),a=0,f=k.c/HC;
if(pl){var bi=Math.floor(Math.abs(k.c-HC/2)/(HC/2)*fd.length*.55),br=(HRW-k.r)/HRW,m=fd[bi]/255;a=m>br*.9?(.45+m*.5):0}
var dd=Math.hypot(k.x-mxp,k.y-myp),ho=Math.max(0,1-dd/120),id=(Math.sin(T*1.3+k.c*.5+k.r*.45)+1)*.05;
k.v+=(Math.max(a,ho*.9,id)-k.v)*.3;
var lf=up*12+k.v*10,y=k.y-lf,hue=pal=='ice'?190:pal=='violet'?250:pal=='mine'?h0:205+f*35;
if(lf>1){hex(k.x,k.y,HR-2);hc.fillStyle=L?'rgba(20,30,90,.14)':'rgba(0,0,0,.5)';hc.fill()}
hex(k.x,y,HR-2);hc.fillStyle=L?'rgba(255,255,255,.55)':'rgba(255,255,255,.04)';hc.fill();
if(k.v>.06){hc.fillStyle='hsla('+hue+',95%,'+(L?50:58)+'%,'+Math.min(1,k.v*.9)+')';hc.fill()}
hc.lineWidth=1.5;hc.strokeStyle='hsla('+hue+',90%,'+(L?42:62)+'%,'+(.22+up*.3+k.v*.5)+')';hc.stroke()}
requestAnimationFrame(hl)})();
$('#pal').onchange=function(e){pal=e.target.value};
$('#ld').onclick=function(){$('#song').click()};
$('#song').onchange=function(e){var f=e.target.files[0];if(!f)return;au.src=URL.createObjectURL(f);ax=ax||new (window.AudioContext||window.webkitAudioContext)();if(!an){var s2=ax.createMediaElementSource(au);an=ax.createAnalyser();an.fftSize=256;an.smoothingTimeConstant=.8;s2.connect(an);an.connect(ax.destination);fd=new Uint8Array(an.frequencyBinCount)}ax.resume();au.play();$('#pp').textContent='⏸'};
$('#pp').onclick=function(){if(!au.src){$('#song').click();return}if(au.paused){ax.resume();au.play();this.textContent='⏸'}else{au.pause();this.textContent='▶'}};
function am(){var m=md=='auto'?(mq.matches?'light':'dark'):md;document.documentElement.dataset.m=m;mode=m;$('#md').textContent=md=='auto'?'🌓 Auto':md=='light'?'☀️ Día':'🌙 Noche'}
mq.addEventListener('change',am);am();
$('#md').onclick=function(){md=md=='auto'?'light':md=='light'?'dark':'auto';am()};
