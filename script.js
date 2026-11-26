'use strict';
// EDITE OS LINKS AQUI. Use a URL completa do perfil / da moeda.
function getSocialLinks() {
  return {
    twitter: 'https://x.com/thedoinkdoink',
    pump: 'https://pump.fun/coin/5w46sUhdzJvhuuC6K2T5vFSGXGzFeVsti6ZLA568pump'
  };
}

document.querySelectorAll('[data-social]').forEach(link => {
  link.href = getSocialLinks()[link.dataset.social];
});
const desktop=document.querySelector('#desktop');
const windows=[...document.querySelectorAll('.window')];
const taskList=document.querySelector('#task-list');
const menu=document.querySelector('#start-menu');
const start=document.querySelector('#start-button');
const video=document.querySelector('#video');
const titles={home:'▰ My DOINK',files:'📁 Evidence',socials:'📁 SOCIALS',viewer:'▧ Image viewer',player:'▶ DOINK TV',notes:'▤ doink.txt',trash:'▥ Recycle Bin'};
let topZ=10,currentImage=0,sound=false,audio;
function beep(){if(!sound)return;try{audio??=new(window.AudioContext||window.webkitAudioContext)();audio.resume();const o=audio.createOscillator(),g=audio.createGain();o.type='sine';o.frequency.setValueAtTime(540,audio.currentTime);o.frequency.exponentialRampToValueAtTime(270,audio.currentTime+.07);g.gain.setValueAtTime(.025,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.1);o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+.11)}catch{}}
function focusWindow(win){windows.forEach(w=>w.classList.remove('focused'));win.classList.add('focused');win.style.zIndex=++topZ;renderTasks()}
function setMenu(open){menu.hidden=!open;start.setAttribute('aria-expanded',String(open))}
function openWindow(id){const win=document.getElementById(id);if(!win||!win.classList.contains('window'))return;win.dataset.open='true';win.hidden=false;setMenu(false);focusWindow(win);beep()}
function closeWindow(win){win.hidden=true;delete win.dataset.open;if(win.id==='player')video.pause();renderTasks();focusLast()}
function focusLast(){const visible=windows.filter(w=>!w.hidden).sort((a,b)=>Number(b.style.zIndex)-Number(a.style.zIndex));if(visible[0])focusWindow(visible[0])}
function renderTasks(){taskList.replaceChildren();windows.filter(w=>w.dataset.open).forEach(win=>{const b=document.createElement('button');b.className='task-button'+(!win.hidden&&win.classList.contains('focused')?' active':'');b.textContent=titles[win.id];b.title=titles[win.id];b.onclick=()=>{if(!win.hidden&&win.classList.contains('focused')){win.hidden=true;win.classList.remove('focused');focusLast();renderTasks()}else{win.hidden=false;focusWindow(win)}};taskList.append(b)})}
document.querySelectorAll('[data-open]').forEach(b=>b.addEventListener('click',()=>openWindow(b.dataset.open)));
windows.forEach(win=>{win.addEventListener('pointerdown',()=>focusWindow(win));win.querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>{beep();if(b.dataset.action==='close')closeWindow(win);if(b.dataset.action==='minimize'){win.hidden=true;win.classList.remove('focused');if(win.id==='player')video.pause();focusLast();renderTasks()}if(b.dataset.action==='maximize')win.classList.toggle('maximized')});const bar=win.querySelector('.titlebar');bar.addEventListener('dblclick',e=>{if(!e.target.closest('button'))win.classList.toggle('maximized')});bar.addEventListener('pointerdown',e=>{if(e.target.closest('button')||win.classList.contains('maximized'))return;const rect=win.getBoundingClientRect(),area=desktop.getBoundingClientRect(),dx=e.clientX-rect.left,dy=e.clientY-rect.top;bar.setPointerCapture(e.pointerId);function move(ev){win.style.left=Math.max(0,Math.min(area.width-win.offsetWidth,ev.clientX-area.left-dx))+'px';win.style.top=Math.max(0,Math.min(area.height-35,ev.clientY-area.top-dy))+'px'}function stop(){bar.removeEventListener('pointermove',move);bar.removeEventListener('pointerup',stop);bar.removeEventListener('pointercancel',stop)}bar.addEventListener('pointermove',move);bar.addEventListener('pointerup',stop);bar.addEventListener('pointercancel',stop)})});
document.querySelectorAll('[data-dismiss]').forEach(b=>b.onclick=()=>closeWindow(document.getElementById(b.dataset.dismiss)));
const grid=document.querySelector('#file-grid');
for(let i=1;i<=4;i++){const b=document.createElement('button');b.className='file-item';b.innerHTML=`<img src="assets/${i}.jpg" alt="DOINK evidence ${i}" loading="lazy"><span>${String(i).padStart(2,'0')}.jpg</span>`;b.onclick=()=>showImage(i-1);grid.append(b)}
function showImage(index){currentImage=(index+4)%4;const path=`assets/${currentImage+1}.jpg`;document.querySelector('#viewer-image').src=path;document.querySelector('#viewer-title').textContent=`${String(currentImage+1).padStart(2,'0')}.jpg — Image viewer`;document.querySelector('#image-counter').textContent=`${currentImage+1} / 4`;const download=document.querySelector('#download');download.href=path;download.download=`doink-${currentImage+1}.jpg`;openWindow('viewer')}
document.querySelector('#previous').onclick=()=>showImage(currentImage-1);document.querySelector('#next').onclick=()=>showImage(currentImage+1);
document.querySelectorAll('[data-video]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-video]').forEach(x=>x.classList.toggle('selected',x===b));video.src=`assets/${b.dataset.video}`;video.play().catch(()=>{});beep()});
video.addEventListener('play',()=>document.querySelector('#play-status').textContent='Playing');video.addEventListener('pause',()=>document.querySelector('#play-status').textContent='Paused');video.addEventListener('ended',()=>document.querySelector('#play-status').textContent='Finished');video.addEventListener('error',()=>document.querySelector('#play-status').textContent='Could not open video');
start.onclick=()=>{setMenu(menu.hidden);beep()};document.addEventListener('pointerdown',e=>{if(!e.target.closest('#start-menu')&&!e.target.closest('#start-button'))setMenu(false)});
function updateClock(){const now=new Date();document.querySelector('#clock').textContent=now.toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'});document.querySelector('#clock').title=now.toLocaleDateString()};updateClock();setInterval(updateClock,1000);
document.querySelector('#sound-toggle').onclick=e=>{sound=!sound;e.currentTarget.setAttribute('aria-pressed',String(sound));e.currentTarget.title=sound?'Sound on':'Sound off';e.currentTarget.setAttribute('aria-label',sound?'Disable interface sounds':'Enable interface sounds');beep()};
const notepad=document.querySelector('#notepad');try{notepad.value=localStorage.getItem('doink-notes')??notepad.value}catch{}notepad.addEventListener('input',()=>{try{localStorage.setItem('doink-notes',notepad.value)}catch{}});
function restart(){video.pause();windows.forEach(w=>{w.hidden=true;delete w.dataset.open;w.classList.remove('maximized','focused');w.style.left='';w.style.top=''});setMenu(false);openWindow('home')};document.querySelector('#reset-desktop').onclick=restart;document.querySelector('#power').onclick=restart;
document.querySelector('#fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch{}};
document.addEventListener('keydown',e=>{if(e.key==='Escape'){setMenu(false);const top=windows.filter(w=>!w.hidden).sort((a,b)=>Number(b.style.zIndex)-Number(a.style.zIndex))[0];if(top&&top.id!=='home')closeWindow(top)}if(document.querySelector('#viewer').classList.contains('focused')&&!document.querySelector('#viewer').hidden){if(e.key==='ArrowLeft')showImage(currentImage-1);if(e.key==='ArrowRight')showImage(currentImage+1)}});
window.addEventListener('resize',()=>windows.forEach(w=>{if(w.hidden||w.classList.contains('maximized'))return;const r=w.getBoundingClientRect(),d=desktop.getBoundingClientRect();if(r.right>d.right)w.style.left=Math.max(8,d.width-w.offsetWidth-8)+'px';if(r.top>d.bottom-40)w.style.top='20px'}));
openWindow('home');
